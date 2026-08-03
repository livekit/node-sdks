// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { AccessToken } from 'livekit-server-sdk';
import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { describe } from 'vitest';
import { Room, type RoomEvent } from '../index.js';

export const hasE2EEnv =
  !!process.env.LIVEKIT_URL && !!process.env.LIVEKIT_API_KEY && !!process.env.LIVEKIT_API_SECRET;
// Explicitly typed so declaration emit doesn't reference vitest's
// non-exported internal suite types (TS4023).
export const describeE2E: typeof describe = hasE2EEnv
  ? describe
  : (describe.skip as typeof describe);
export const testTimeoutMs = 10_000;

export type TestEnv = {
  url: string;
  apiKey: string;
  apiSecret: string;
};

function normalizeLiveKitUrl(url: string): string {
  if (url.startsWith('http://')) return `ws://${url.slice('http://'.length)}`;
  if (url.startsWith('https://')) return `wss://${url.slice('https://'.length)}`;
  return url;
}

export function getTestEnv(): TestEnv {
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

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  return await Promise.race([
    promise,
    (async () => {
      await delay(timeoutMs);
      throw new Error(message);
    })(),
  ]);
}

export async function waitFor(
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

export async function createJoinToken(params: {
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

export async function connectTestRooms(
  count: number,
): Promise<{ roomName: string; rooms: Room[] }> {
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

export function waitForRoomEvent<R>(
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

export function concatUint8(chunks: Uint8Array[]): Uint8Array {
  const len = chunks.reduce((acc, c) => acc + c.byteLength, 0);
  const out = new Uint8Array(len);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.byteLength;
  }
  return out;
}
