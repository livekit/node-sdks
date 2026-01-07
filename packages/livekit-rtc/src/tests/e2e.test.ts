// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { AccessToken } from 'livekit-server-sdk';
import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { afterAll, describe, expect, it } from 'vitest';
import {
  AudioFrame,
  AudioSource,
  AudioStream,
  ConnectionState,
  LocalAudioTrack,
  ParticipantKind,
  Room,
  RoomEvent,
  RpcError,
  TrackPublishOptions,
  TrackSource,
  dispose,
} from '../index.js';

const hasE2EEnv =
  !!process.env.LIVEKIT_URL && !!process.env.LIVEKIT_API_KEY && !!process.env.LIVEKIT_API_SECRET;
const describeE2E = hasE2EEnv ? describe : describe.skip;
const testTimeoutMs = 10_000;

type TestEnv = {
  url: string;
  apiKey: string;
  apiSecret: string;
};

function normalizeLiveKitUrl(url: string): string {
  if (url.startsWith('http://')) return `ws://${url.slice('http://'.length)}`;
  if (url.startsWith('https://')) return `wss://${url.slice('https://'.length)}`;
  return url;
}

function getTestEnv(): TestEnv {
  if (!hasE2EEnv) {
    throw new Error(
      'Missing required env vars for e2e: LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET',
    );
  }
  return {
    url: normalizeLiveKitUrl(process.env.LIVEKIT_URL!),
    apiKey: process.env.LIVEKIT_API_KEY!,
    apiSecret: process.env.LIVEKIT_API_SECRET!,
  };
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return await Promise.race([
    promise,
    (async () => {
      await delay(timeoutMs);
      throw new Error(message);
    })(),
  ]);
}

async function waitFor(
  condition: () => boolean,
  opts: { timeoutMs: number; intervalMs?: number; debugName?: string },
): Promise<void> {
  const intervalMs = opts.intervalMs ?? 50;
  const deadline = Date.now() + opts.timeoutMs;
  while (Date.now() < deadline) {
    if (condition()) return;
    await delay(intervalMs);
  }
  throw new Error(`Timed out waiting for condition${opts.debugName ? ` (${opts.debugName})` : ''}`);
}

async function createJoinToken(params: {
  env: TestEnv;
  roomName: string;
  identity: string;
  name: string;
}): Promise<string> {
  const token = new AccessToken(params.env.apiKey, params.env.apiSecret, {
    identity: params.identity,
    name: params.name,
    ttl: '30m',
  });
  token.addGrant({
    room: params.roomName,
    roomJoin: true,
    roomCreate: true,
    canPublish: true,
    canSubscribe: true,
  });
  return await token.toJwt();
}

async function connectTestRooms(count: number): Promise<{ roomName: string; rooms: Room[] }> {
  const env = getTestEnv();
  const roomName = `test_room_${randomUUID()}`;
  const rooms = await Promise.all(
    Array.from({ length: count }, async (_, i) => {
      const token = await createJoinToken({
        env,
        roomName,
        identity: `p${i}`,
        name: `Participant ${i}`,
      });
      const room = new Room();
      await room.connect(env.url, token, { autoSubscribe: true, dynacast: false });
      return room;
    }),
  );

  const start = Date.now();
  await waitFor(() => rooms.every((r) => r.remoteParticipants.size === count - 1), {
    timeoutMs: 5000,
    debugName: `participant visibility (${Date.now() - start}ms)`,
  });

  return { roomName, rooms };
}

function waitForRoomEvent<R>(
  room: Room,
  event: RoomEvent,
  timeoutMs: number,
  take: (...args: any[]) => R,
): Promise<R> {
  return withTimeout(
    new Promise<R>((resolve) => {
      const handler = (...args: any[]) => {
        // typed-emitter doesn't expose `.once` in the type surface, so do manual once+cleanup.
        room.off(event as any, handler as any);
        resolve(take(...args));
      };
      room.on(event as any, handler as any);
    }),
    timeoutMs,
    `Timed out waiting for ${event}`,
  );
}

function concatUint8(chunks: Uint8Array[]): Uint8Array {
  const len = chunks.reduce((acc, c) => acc + c.byteLength, 0);
  const out = new Uint8Array(len);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.byteLength;
  }
  return out;
}

function channelSamples(frame: AudioFrame, channelIndex: number): Int16Array {
  const { data, channels, samplesPerChannel } = frame;
  const out = new Int16Array(samplesPerChannel);
  for (let i = 0; i < samplesPerChannel; i++) {
    out[i] = data[i * channels + channelIndex]!;
  }
  return out;
}

function estimateFreqHz(samples: Int16Array, sampleRate: number): number {
  if (samples.length < sampleRate / 10) {
    // need at least ~100ms for low-frequency signals
    return 0;
  }

  // basic autocorrelation over a plausible band around 60Hz
  const expectedHz = 60;
  const minHz = 20;
  const maxHz = 200;
  const minLag = Math.floor(sampleRate / maxHz);
  const maxLag = Math.floor(sampleRate / minHz);
  const expectedLag = Math.floor(sampleRate / expectedHz);
  const searchRadius = Math.floor(expectedLag * 0.5);
  const lagStart = Math.max(minLag, expectedLag - searchRadius);
  const lagEnd = Math.min(maxLag, expectedLag + searchRadius);

  const x = new Float64Array(samples.length);
  let mean = 0;
  for (let i = 0; i < samples.length; i++) mean += samples[i]!;
  mean /= samples.length;
  for (let i = 0; i < samples.length; i++) x[i] = samples[i]! - mean;

  let bestLag = 0;
  let bestCorr = -Infinity;
  for (let lag = lagStart; lag <= lagEnd; lag++) {
    let corr = 0;
    for (let i = 0; i < x.length - lag; i++) corr += x[i]! * x[i + lag]!;
    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }

  return bestLag > 0 ? sampleRate / bestLag : 0;
}

describeE2E('livekit-rtc e2e', () => {
  afterAll(async () => {
    await dispose();
  });

  it.concurrent(
    'connects to a room',
    async () => {
      const { roomName, rooms } = await connectTestRooms(1);
      const room = rooms[0]!;

      expect(room.connectionState).toBe(ConnectionState.CONN_CONNECTED);
      expect(room.name).toBe(roomName);
      expect(room.remoteParticipants.size).toBe(0);

      expect(room.creationTime.getTime()).toBeGreaterThan(0);
      expect(Math.abs(room.creationTime.getTime() - Date.now())).toBeLessThanOrEqual(10_000);

      expect(room.localParticipant?.sid).toMatch(/^PA_/);
      expect(room.localParticipant?.identity).toBe('p0');
      expect(room.localParticipant?.name).toBe('Participant 0');
      expect(room.localParticipant?.kind).toBe(ParticipantKind.STANDARD);

      await room.disconnect();
    },
    testTimeoutMs,
  );

  it.concurrent(
    'connects multiple participants to the same room',
    async () => {
      const { roomName, rooms } = await connectTestRooms(2);
      const [first, second] = rooms;

      expect(first?.name).toBe(roomName);
      expect(second?.name).toBe(roomName);
      expect(first?.remoteParticipants.get(second!.localParticipant!.identity)).toBeTruthy();
      expect(second?.remoteParticipants.get(first!.localParticipant!.identity)).toBeTruthy();

      await Promise.all(rooms.map((r) => r.disconnect()));
    },
    testTimeoutMs,
  );

  it.concurrent(
    'emits participantDisconnected when a participant leaves',
    async () => {
      const { rooms } = await connectTestRooms(2);
      const [first, second] = rooms;
      const secondIdentity = second!.localParticipant!.identity;
      const secondName = second!.localParticipant!.name!;

      const disconnected = waitForRoomEvent(
        first!,
        RoomEvent.ParticipantDisconnected,
        testTimeoutMs,
        (p: { identity: string; name?: string }) => ({ identity: p.identity, name: p.name ?? '' }),
      );

      await second!.disconnect();

      const ev = await disconnected;
      expect(ev.identity).toBe(secondIdentity);
      expect(ev.name).toBe(secondName);

      await first!.disconnect();
    },
    testTimeoutMs,
  );

  it.concurrent(
    'transfers audio between two participants (sine detection)',
    async () => {
      const cases = [
        { pubRateHz: 48_000, pubChannels: 1, subRateHz: 48_000, subChannels: 1 },
        { pubRateHz: 48_000, pubChannels: 2, subRateHz: 48_000, subChannels: 2 },
        { pubRateHz: 48_000, pubChannels: 2, subRateHz: 24_000, subChannels: 2 },
        { pubRateHz: 24_000, pubChannels: 2, subRateHz: 24_000, subChannels: 1 },
      ] as const;

      for (const params of cases) {
        const { rooms } = await connectTestRooms(2);
        const [subRoom, pubRoom] = rooms;

        const subscribed = waitForRoomEvent(
          subRoom!,
          RoomEvent.TrackSubscribed,
          15_000,
          (track: unknown) => track,
        );

        const source = new AudioSource(params.pubRateHz, params.pubChannels);
        const track = LocalAudioTrack.createAudioTrack('sine', source);
        const options = new TrackPublishOptions();
        options.source = TrackSource.SOURCE_MICROPHONE;
        await pubRoom!.localParticipant!.publishTrack(track, options);

        const remoteTrack = await subscribed;
        const stream = new AudioStream(remoteTrack as any, {
          sampleRate: params.subRateHz,
          numChannels: params.subChannels,
        });
        const reader = stream.getReader();

        const sineHz = 60;
        const framesToAnalyze = 100;
        const collected: Int16Array[] = Array.from(
          { length: params.subChannels },
          () => new Int16Array(0),
        );

        const readTask = (async () => {
          let frames = 0;
          while (frames < framesToAnalyze) {
            const { done, value } = await reader.read();
            if (done) break;
            expect(value.sampleRate).toBe(params.subRateHz);
            expect(value.channels).toBe(params.subChannels);
            for (let ch = 0; ch < params.subChannels; ch++) {
              const s = channelSamples(value, ch);
              const prev = collected[ch]!;
              const next = new Int16Array(prev.length + s.length);
              next.set(prev, 0);
              next.set(s, prev.length);
              collected[ch] = next;
            }
            frames++;
          }
          expect(frames).toBe(framesToAnalyze);
        })();

        const samplesPer10ms = Math.floor(params.pubRateHz / 100);
        const amplitude = 0.8 * 32767;
        const publishTask = (async () => {
          let t = 0;
          for (let i = 0; i < framesToAnalyze + 20; i++) {
            const frame = AudioFrame.create(params.pubRateHz, params.pubChannels, samplesPer10ms);
            for (let s = 0; s < samplesPer10ms; s++) {
              const v = Math.round(
                amplitude * Math.sin((2 * Math.PI * sineHz * t) / params.pubRateHz),
              );
              t++;
              for (let ch = 0; ch < params.pubChannels; ch++) {
                frame.data[s * params.pubChannels + ch] = v;
              }
            }
            await source.captureFrame(frame);
          }
          await source.waitForPlayout();
        })();

        await withTimeout(
          Promise.all([readTask, publishTask]),
          20_000,
          'Timed out during audio test',
        );

        for (let ch = 0; ch < params.subChannels; ch++) {
          const detected = estimateFreqHz(collected[ch]!, params.subRateHz);
          expect(Math.abs(detected - sineHz)).toBeLessThan(20);
        }

        reader.releaseLock();
        await track.close();
        await Promise.all(rooms.map((r) => r.disconnect()));
      }
    },
    testTimeoutMs * 2,
  );

  it.concurrent(
    'publishes and receives reliable data packets',
    async () => {
      const { rooms } = await connectTestRooms(2);
      const [receivingRoom, sendingRoom] = rooms;
      const receiverIdentity = receivingRoom!.localParticipant!.identity;

      const iterations = 128;
      const payload = new Uint8Array(4096).fill(0xfa);
      let received = 0;

      const receiveTask = withTimeout(
        new Promise<void>((resolve) => {
          receivingRoom!.on(RoomEvent.DataReceived, (data, participant) => {
            if (participant?.identity !== sendingRoom!.localParticipant!.identity) return;
            if (data.byteLength !== payload.byteLength) return;
            received++;
            if (received === iterations) resolve();
          });
        }),
        testTimeoutMs,
        'Timed out waiting for all reliable packets',
      );

      const sendTask = (async () => {
        for (let i = 0; i < iterations; i++) {
          await sendingRoom!.localParticipant!.publishData(payload, {
            reliable: true,
            destination_identities: [receiverIdentity],
          });
          await delay(10);
        }
      })();

      await Promise.all([receiveTask, sendTask]);
      await Promise.all(rooms.map((r) => r.disconnect()));
    },
    testTimeoutMs,
  );

  it.concurrent(
    'sends and receives text and byte streams',
    async () => {
      const { rooms } = await connectTestRooms(2);
      const [receivingRoom, sendingRoom] = rooms;
      const senderIdentity = sendingRoom!.localParticipant!.identity;

      const topic = 'some-topic';

      const textToSend = 'some-text';
      const receivedText = withTimeout(
        new Promise<string>((resolve) => {
          receivingRoom!.registerTextStreamHandler(topic, async (reader, sender) => {
            expect(sender.identity).toBe(senderIdentity);
            resolve(await reader.readAll());
          });
        }),
        testTimeoutMs,
        'Timed out waiting for text stream',
      );

      const textInfo = await sendingRoom!.localParticipant!.sendText(textToSend, { topic });
      expect(textInfo.streamId).toBeTruthy();
      expect(Math.abs(textInfo.timestamp - Date.now())).toBeLessThanOrEqual(1_000);
      expect(textInfo.mimeType).toBe('text/plain');
      expect(textInfo.topic).toBe(topic);

      expect(await receivedText).toBe(textToSend);

      const bytesToSend = new Uint8Array(16).fill(0xfa);
      const receivedBytes = withTimeout(
        new Promise<Uint8Array>((resolve) => {
          receivingRoom!.registerByteStreamHandler(topic, async (reader, sender) => {
            expect(sender.identity).toBe(senderIdentity);
            const chunks = await reader.readAll();
            resolve(concatUint8(chunks));
          });
        }),
        testTimeoutMs,
        'Timed out waiting for byte stream',
      );

      const writer = await sendingRoom!.localParticipant!.streamBytes({
        topic,
        totalSize: bytesToSend.byteLength,
      });
      await writer.write(bytesToSend);
      await writer.close();

      const byteInfo = writer.info;
      expect(byteInfo.streamId).toBeTruthy();
      expect(Math.abs(byteInfo.timestamp - Date.now())).toBeLessThanOrEqual(1_000);
      expect(byteInfo.mimeType).toBe('application/octet-stream');
      expect(byteInfo.topic).toBe(topic);

      expect(await receivedBytes).toEqual(bytesToSend);

      await Promise.all(rooms.map((r) => r.disconnect()));
    },
    testTimeoutMs,
  );

  it.concurrent(
    'invokes RPC methods and returns structured errors',
    async () => {
      const { rooms } = await connectTestRooms(2);
      const [callerRoom, calleeRoom] = rooms;

      const method = 'test-method';
      const payload = 'test-payload';

      calleeRoom!.localParticipant!.registerRpcMethod(method, async (data) => data.payload);

      await expect(
        callerRoom!.localParticipant!.performRpc({
          destinationIdentity: calleeRoom!.localParticipant!.identity,
          method,
          payload,
          responseTimeout: 500,
        }),
      ).resolves.toBe(payload);

      await expect(
        callerRoom!.localParticipant!.performRpc({
          destinationIdentity: calleeRoom!.localParticipant!.identity,
          method: 'unregistered-method',
          payload,
          responseTimeout: 500,
        }),
      ).rejects.toMatchObject({ code: RpcError.ErrorCode.UNSUPPORTED_METHOD });

      await expect(
        callerRoom!.localParticipant!.performRpc({
          destinationIdentity: 'unknown-participant',
          method,
          payload,
          responseTimeout: 500,
        }),
      ).rejects.toMatchObject({ code: RpcError.ErrorCode.CONNECTION_TIMEOUT });

      await Promise.all(rooms.map((r) => r.disconnect()));
    },
    testTimeoutMs * 2,
  );
});
