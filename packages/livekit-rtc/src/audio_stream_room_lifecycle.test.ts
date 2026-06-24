// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { OwnedTrack } from '@livekit/rtc-ffi-bindings';
import { describe, expect, it, vi } from 'vitest';
import type { AudioFrame } from './audio_frame.js';
import type { AudioStreamSource } from './audio_stream.js';
import { FfiClient } from './ffi_client.js';
import {
  FrameProcessor,
  type FrameProcessorCredentials,
  type FrameProcessorStreamInfo,
} from './frame_processor.js';
import { LocalParticipant } from './participant.js';
import { Room } from './room.js';
import { RemoteAudioTrack, type Track } from './track.js';
import { LocalTrackPublication } from './track_publication.js';

// These tests fabricate Tracks with synthetic (invalid) FFI handle ids to avoid
// touching the real FFI server. The native FfiHandle has a Rust-side drop that
// runs when the JS wrapper is garbage-collected; dropping an unallocated handle
// throws "trying to drop an invalid handle" as an uncaught exception at GC time
// (intermittent locally, reliably on CI). Replace FfiHandle with an inert stub
// so no native drop is ever scheduled; everything else in the bindings stays real.
vi.mock('@livekit/rtc-ffi-bindings', async (importActual) => {
  const actual = await importActual<typeof import('@livekit/rtc-ffi-bindings')>();
  class FakeFfiHandle {
    private _handle: bigint;
    constructor(handle: bigint) {
      this._handle = handle;
    }
    dispose(): void {}
    get handle(): bigint {
      return this._handle;
    }
  }
  return { ...actual, FfiHandle: FakeFfiHandle };
});

class RecordingProcessor extends FrameProcessor<AudioFrame> {
  enabled = false;
  streamInfoCalls: Array<FrameProcessorStreamInfo> = [];
  credentialsCalls: Array<FrameProcessorCredentials> = [];
  streamInfoClearedCount = 0;
  credentialsClearedCount = 0;
  closeCount = 0;
  isEnabled(): boolean {
    return this.enabled;
  }
  setEnabled(v: boolean): void {
    this.enabled = v;
  }
  onStreamInfoUpdated(info: FrameProcessorStreamInfo): void {
    this.streamInfoCalls.push(info);
  }
  onStreamInfoCleared(): void {
    this.streamInfoClearedCount += 1;
  }
  onCredentialsUpdated(c: FrameProcessorCredentials): void {
    this.credentialsCalls.push(c);
  }
  onCredentialsCleared(): void {
    this.credentialsClearedCount += 1;
  }
  process(f: AudioFrame): AudioFrame {
    return f;
  }
  close(): void {
    this.closeCount += 1;
  }
}

function makeRoom(opts: { name: string; token?: string; serverUrl?: string }): Room {
  const room = new Room();
  // The Room constructor doesn't accept name/token/url; for unit tests we set them directly
  // on the private backing fields, the same way the FFI message handler would.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = room as any;
  r.info = { name: opts.name };
  r._token = opts.token;
  r._serverUrl = opts.serverUrl;
  return room;
}

interface StubParticipant {
  identity: string;
  trackPublications: Map<string, { sid: string }>;
}

function attachRemoteParticipant(
  room: Room,
  identity: string,
  publications: Array<{ publicationSid: string; trackSid: string }>,
): void {
  const map = new Map<string, { sid: string }>();
  for (const pub of publications) {
    map.set(pub.trackSid, { sid: pub.publicationSid });
  }
  const participant: StubParticipant = { identity, trackPublications: map };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  room.remoteParticipants.set(identity, participant as any);
}

function makeTrack(sid: string): RemoteAudioTrack {
  const owned = {
    info: { sid },
    handle: { id: BigInt(0) },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any as OwnedTrack;
  return new RemoteAudioTrack(owned);
}

function makeStream(processor: FrameProcessor<AudioFrame> | null): AudioStreamSource {
  // Minimal stub exercising only the surface the Track touches: the `processor`
  // getter and a no-op `cancel()`. Keeping cancel inert isolates the
  // metadata-push assertions from the real teardown path, which is covered
  // separately via simulateStreamClose.
  return { processor, cancel: () => {} } as unknown as AudioStreamSource;
}

function makeLocalParticipant(identity: string): LocalParticipant {
  // Bypass the FFI-touching constructor; set only the fields the lifecycle
  // paths read (identity getter + trackPublications map).
  const p = Object.create(LocalParticipant.prototype) as LocalParticipant;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (p as any).info = { identity };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (p as any).trackPublications = new Map();
  return p;
}

function makeLocalPublication(sid: string, track: Track | undefined): LocalTrackPublication {
  const pub = Object.create(LocalTrackPublication.prototype) as LocalTrackPublication;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pub as any).info = { sid };
  pub.track = track;
  return pub;
}

/**
 * Attach a real Room's localParticipant holding one local publication whose
 * `track` is the given Track (mirrors publish_track: track.sid == publication.sid).
 */
function attachLocalTrack(room: Room, identity: string, sid: string, track: Track): void {
  const local = makeLocalParticipant(identity);
  local.trackPublications.set(sid, makeLocalPublication(sid, track));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (room as any).localParticipant = local;
}

/**
 * Drive Room.processFfiEvent with a synthetic room event, satisfying the
 * roomHandle / connected guards via injected private fields. Mirrors the
 * Python tests dispatching through `room._on_room_event`.
 */
async function dispatchRoomEvent(
  room: Room,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: { case: string; value: any },
): Promise<void> {
  const handle = BigInt(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = room as any;
  r.ffiHandle = { handle };
  if (!r.localParticipant) {
    r.localParticipant = makeLocalParticipant('agent');
  }
  await r.processFfiEvent({
    message: { case: 'roomEvent', value: { roomHandle: handle, message } },
  });
}

/**
 * Simulates the cleanup path that AudioStreamSource runs on `cancel()` / `eos`:
 * unregister from track, then close the processor when `autoClose` is set.
 * Mirrors the Python tests' `_make_closeable_stream` helper.
 */
function simulateStreamClose(
  track: RemoteAudioTrack,
  stream: AudioStreamSource,
  autoClose: boolean,
): void {
  track.unregisterAudioStream(stream);
  if (stream.processor && autoClose) {
    stream.processor.close();
  }
}

const TRACK_SID = 'TR_1';

describe('AudioStream room lifecycle', () => {
  it('processor receives lifecycle callbacks on room attach', () => {
    const room = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    attachRemoteParticipant(room, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    const track = makeTrack(TRACK_SID);
    const proc = new RecordingProcessor();
    const stream = makeStream(proc);

    track.registerAudioStream(stream);
    track.setRoom(room);

    expect(proc.streamInfoCalls).toEqual([
      { roomName: 'room-a', participantIdentity: 'alice', publicationSid: 'PUB_1' },
    ]);
    expect(proc.credentialsCalls).toEqual([{ token: 'tok-a', url: 'wss://a' }]);
    expect(proc.streamInfoClearedCount).toBe(0);
    expect(proc.credentialsClearedCount).toBe(0);
  });

  it('processor callbacks refire on track room change', () => {
    const roomA = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    attachRemoteParticipant(roomA, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    const roomB = makeRoom({ name: 'room-b', token: 'tok-b', serverUrl: 'wss://b' });
    attachRemoteParticipant(roomB, 'bob', [{ publicationSid: 'PUB_2', trackSid: TRACK_SID }]);

    const track = makeTrack(TRACK_SID);
    const proc = new RecordingProcessor();
    track.registerAudioStream(makeStream(proc));

    track.setRoom(roomA);
    track.setRoom(roomB);

    expect(proc.streamInfoCalls.length).toBe(2);
    expect(proc.streamInfoCalls[1]).toEqual({
      roomName: 'room-b',
      participantIdentity: 'bob',
      publicationSid: 'PUB_2',
    });
    expect(proc.credentialsCalls.length).toBe(2);
    expect(proc.credentialsCalls[1]).toEqual({ token: 'tok-b', url: 'wss://b' });
  });

  it('token refresh propagates to processor', () => {
    const room = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    attachRemoteParticipant(room, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    const track = makeTrack(TRACK_SID);
    const proc = new RecordingProcessor();
    track.registerAudioStream(makeStream(proc));
    track.setRoom(room);

    expect(proc.credentialsCalls.length).toBe(1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (room as any)._token = 'tok-a-refreshed';
    room.emit('tokenRefreshed');

    expect(proc.credentialsCalls.length).toBe(2);
    expect(proc.credentialsCalls[1]).toEqual({ token: 'tok-a-refreshed', url: 'wss://a' });
  });

  it('repeated setRoom with same room does not double-register listener', () => {
    const room = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    const track = makeTrack(TRACK_SID);

    track.setRoom(room);
    track.setRoom(room);
    track.setRoom(room);

    expect(room.listenerCount('tokenRefreshed')).toBe(1);
  });

  it('setRoom re-registers listener after Room.disconnect strips it', () => {
    // Room.disconnect() calls removeAllListeners(), which silently drops the
    // tokenRefreshed listener. If the same Room object is reused (e.g. on
    // reconnect), setRoom(room) needs to re-register the listener rather than
    // short-circuit on the oldRoom === room identity check.
    const room = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    const track = makeTrack(TRACK_SID);

    track.setRoom(room);
    expect(room.listenerCount('tokenRefreshed')).toBe(1);

    // Simulate Room.disconnect() side-effect.
    room.removeAllListeners();
    expect(room.listenerCount('tokenRefreshed')).toBe(0);

    track.setRoom(room);
    expect(room.listenerCount('tokenRefreshed')).toBe(1);
  });

  it('setRoom swaps listener to new room', () => {
    const roomA = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    const roomB = makeRoom({ name: 'room-b', token: 'tok-b', serverUrl: 'wss://b' });
    const track = makeTrack(TRACK_SID);
    const proc = new RecordingProcessor();
    track.registerAudioStream(makeStream(proc));

    track.setRoom(roomA);
    track.setRoom(roomB);

    expect(roomA.listenerCount('tokenRefreshed')).toBe(0);
    expect(roomB.listenerCount('tokenRefreshed')).toBe(1);

    const beforeCredCount = proc.credentialsCalls.length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (roomA as any)._token = 'tok-a-refreshed';
    roomA.emit('tokenRefreshed');
    expect(proc.credentialsCalls.length).toBe(beforeCredCount);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (roomB as any)._token = 'tok-b-refreshed';
    roomB.emit('tokenRefreshed');
    expect(proc.credentialsCalls.length).toBe(beforeCredCount + 1);
    expect(proc.credentialsCalls[proc.credentialsCalls.length - 1]).toEqual({
      token: 'tok-b-refreshed',
      url: 'wss://b',
    });
  });

  it('unregisterAudioStream stops metadata pushes', () => {
    const roomA = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    const roomB = makeRoom({ name: 'room-b', token: 'tok-b', serverUrl: 'wss://b' });
    attachRemoteParticipant(roomA, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    attachRemoteParticipant(roomB, 'bob', [{ publicationSid: 'PUB_2', trackSid: TRACK_SID }]);
    const track = makeTrack(TRACK_SID);
    const proc = new RecordingProcessor();
    const stream = makeStream(proc);

    track.registerAudioStream(stream);
    track.setRoom(roomA);
    expect(proc.streamInfoCalls.length).toBe(1);

    track.unregisterAudioStream(stream);
    track.setRoom(roomB);

    expect(proc.streamInfoCalls.length).toBe(1);
    expect(proc.credentialsCalls.length).toBe(1);
  });

  it('track leaving room clears processor metadata', () => {
    const room = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    attachRemoteParticipant(room, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    const track = makeTrack(TRACK_SID);
    const proc = new RecordingProcessor();
    track.registerAudioStream(makeStream(proc));

    track.setRoom(room);
    expect(proc.streamInfoCalls.length).toBe(1);
    expect(proc.credentialsCalls.length).toBe(1);

    track.setRoom(null);

    expect(proc.streamInfoClearedCount).toBe(1);
    expect(proc.credentialsClearedCount).toBe(1);
    expect(proc.streamInfoCalls.length).toBe(1);
    expect(proc.credentialsCalls.length).toBe(1);
  });

  it('fanout to multiple registered streams', () => {
    const room = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    attachRemoteParticipant(room, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    const track = makeTrack(TRACK_SID);
    const proc1 = new RecordingProcessor();
    const proc2 = new RecordingProcessor();
    track.registerAudioStream(makeStream(proc1));
    track.registerAudioStream(makeStream(proc2));

    track.setRoom(room);

    for (const proc of [proc1, proc2]) {
      expect(proc.streamInfoCalls).toEqual([
        { roomName: 'room-a', participantIdentity: 'alice', publicationSid: 'PUB_1' },
      ]);
      expect(proc.credentialsCalls).toEqual([{ token: 'tok-a', url: 'wss://a' }]);
    }
  });

  it('registerAudioStream before track enters room', () => {
    const track = makeTrack(TRACK_SID);
    const proc = new RecordingProcessor();
    track.registerAudioStream(makeStream(proc));

    expect(proc.streamInfoCalls.length).toBe(0);
    expect(proc.credentialsCalls.length).toBe(0);

    const room = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    attachRemoteParticipant(room, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    track.setRoom(room);

    expect(proc.streamInfoCalls).toEqual([
      { roomName: 'room-a', participantIdentity: 'alice', publicationSid: 'PUB_1' },
    ]);
    expect(proc.credentialsCalls).toEqual([{ token: 'tok-a', url: 'wss://a' }]);
  });

  it('track room cycle attach detach reattach', () => {
    const roomA = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    attachRemoteParticipant(roomA, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    const roomB = makeRoom({ name: 'room-b', token: 'tok-b', serverUrl: 'wss://b' });
    attachRemoteParticipant(roomB, 'bob', [{ publicationSid: 'PUB_2', trackSid: TRACK_SID }]);
    const track = makeTrack(TRACK_SID);
    const proc = new RecordingProcessor();
    track.registerAudioStream(makeStream(proc));

    track.setRoom(roomA);
    track.setRoom(null);
    track.setRoom(roomB);

    expect(proc.streamInfoCalls.length).toBe(2);
    expect(proc.streamInfoCalls[0]).toEqual({
      roomName: 'room-a',
      participantIdentity: 'alice',
      publicationSid: 'PUB_1',
    });
    expect(proc.streamInfoCalls[1]).toEqual({
      roomName: 'room-b',
      participantIdentity: 'bob',
      publicationSid: 'PUB_2',
    });
    expect(proc.streamInfoClearedCount).toBe(1);
    expect(proc.credentialsClearedCount).toBe(1);
    expect(roomA.listenerCount('tokenRefreshed')).toBe(0);
    expect(roomB.listenerCount('tokenRefreshed')).toBe(1);
  });

  it('setRoom with no registered streams is safe', () => {
    const room = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    attachRemoteParticipant(room, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    const track = makeTrack(TRACK_SID);

    expect(() => track.setRoom(room)).not.toThrow();

    const proc = new RecordingProcessor();
    track.registerAudioStream(makeStream(proc));

    expect(proc.streamInfoCalls).toEqual([
      { roomName: 'room-a', participantIdentity: 'alice', publicationSid: 'PUB_1' },
    ]);
    expect(proc.credentialsCalls).toEqual([{ token: 'tok-a', url: 'wss://a' }]);
  });

  it('unregister one of many streams only fans out to remaining', () => {
    const roomA = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    attachRemoteParticipant(roomA, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    const roomB = makeRoom({ name: 'room-b', token: 'tok-b', serverUrl: 'wss://b' });
    attachRemoteParticipant(roomB, 'bob', [{ publicationSid: 'PUB_2', trackSid: TRACK_SID }]);
    const track = makeTrack(TRACK_SID);
    const proc1 = new RecordingProcessor();
    const proc2 = new RecordingProcessor();
    const stream1 = makeStream(proc1);
    const stream2 = makeStream(proc2);
    track.registerAudioStream(stream1);
    track.registerAudioStream(stream2);

    track.setRoom(roomA);
    track.unregisterAudioStream(stream1);
    track.setRoom(roomB);

    expect(proc1.streamInfoCalls.length).toBe(1);
    expect(proc1.credentialsCalls.length).toBe(1);
    expect(proc2.streamInfoCalls.length).toBe(2);
    expect(proc2.streamInfoCalls[1]).toEqual({
      roomName: 'room-b',
      participantIdentity: 'bob',
      publicationSid: 'PUB_2',
    });
    expect(proc2.credentialsCalls.length).toBe(2);
  });

  it('close path closes processor when autoClose true', () => {
    const track = makeTrack(TRACK_SID);
    const proc = new RecordingProcessor();
    const stream = makeStream(proc);
    track.registerAudioStream(stream);

    simulateStreamClose(track, stream, true);

    expect(proc.closeCount).toBe(1);

    // Stream is unregistered: further room attaches don't reach the processor.
    const room = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    attachRemoteParticipant(room, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    track.setRoom(room);
    expect(proc.streamInfoCalls.length).toBe(0);
  });

  it('close path leaves processor open when autoClose false', () => {
    const track = makeTrack(TRACK_SID);
    const proc = new RecordingProcessor();
    const stream = makeStream(proc);
    track.registerAudioStream(stream);

    simulateStreamClose(track, stream, false);

    expect(proc.closeCount).toBe(0);

    // Still unregistered, even though we kept the processor open for reuse.
    const room = makeRoom({ name: 'room-a', token: 'tok-a', serverUrl: 'wss://a' });
    attachRemoteParticipant(room, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    track.setRoom(room);
    expect(proc.streamInfoCalls.length).toBe(0);
  });

  it('setRoom(null) is idempotent for cleared callbacks', () => {
    const room = makeRoom({ name: 'room-1', token: 'tok-1', serverUrl: 'wss://r' });
    attachRemoteParticipant(room, 'alice', [{ publicationSid: 'PUB_1', trackSid: TRACK_SID }]);
    const track = makeTrack(TRACK_SID);
    track.setRoom(room);
    const proc = new RecordingProcessor();
    track.registerAudioStream(makeStream(proc));

    track.setRoom(null); // first clear (e.g. room event handler)
    track.setRoom(null); // second clear (e.g. unpublishTrack on the same track)

    expect(proc.streamInfoClearedCount).toBe(1);
    expect(proc.credentialsClearedCount).toBe(1);
  });

  it('tokenRefreshed listener only removed by setRoom(null)', () => {
    const room = makeRoom({ name: 'room-1', token: 'tok-1', serverUrl: 'wss://r' });
    const track = makeTrack(TRACK_SID);

    track.setRoom(room);
    expect(room.listenerCount('tokenRefreshed')).toBe(1);

    // Only setRoom(null) detaches it.
    track.setRoom(null);
    expect(room.listenerCount('tokenRefreshed')).toBe(0);
  });

  it('localTrackRepublished updates track sid and repushes metadata', async () => {
    // A full-reconnect republish re-issues the publication SID. The handler must
    // keep the local-track invariant (track.sid == publication.sid) intact and
    // re-push metadata so attached processors learn the new SID — otherwise the
    // SID-based local lookup yields empty participant_identity / publication_sid.
    const room = makeRoom({ name: 'room-1', token: 'tok-1', serverUrl: 'wss://r' });
    const track = makeTrack('OLD');
    attachLocalTrack(room, 'agent', 'OLD', track);
    track.setRoom(room);

    const proc = new RecordingProcessor();
    track.registerAudioStream(makeStream(proc));
    expect(proc.streamInfoCalls.at(-1)).toEqual({
      roomName: 'room-1',
      participantIdentity: 'agent',
      publicationSid: 'OLD',
    });

    await dispatchRoomEvent(room, {
      case: 'localTrackRepublished',
      value: { previousSid: 'OLD', info: { sid: 'NEW' } },
    });

    // Invariant restored + map rekeyed.
    expect(track.sid).toBe('NEW');
    expect(room.localParticipant!.trackPublications.has('NEW')).toBe(true);
    expect(room.localParticipant!.trackPublications.has('OLD')).toBe(false);

    // Existing attached processor re-pushed with the NEW sid.
    expect(proc.streamInfoCalls.at(-1)).toEqual({
      roomName: 'room-1',
      participantIdentity: 'agent',
      publicationSid: 'NEW',
    });

    // Regression guard: a stream created AFTER republish also resolves NEW
    // (stale track.sid would yield "").
    const proc2 = new RecordingProcessor();
    track.registerAudioStream(makeStream(proc2));
    expect(proc2.streamInfoCalls.at(-1)).toEqual({
      roomName: 'room-1',
      participantIdentity: 'agent',
      publicationSid: 'NEW',
    });
  });

  it('localTrackUnpublished event nulls publication track', async () => {
    const room = makeRoom({ name: 'room-1', token: 'tok-1', serverUrl: 'wss://r' });
    const track = makeTrack(TRACK_SID);
    attachLocalTrack(room, 'agent', TRACK_SID, track);
    const publication = room.localParticipant!.trackPublications.get(TRACK_SID)!;
    track.setRoom(room);

    await dispatchRoomEvent(room, {
      case: 'localTrackUnpublished',
      value: { publicationSid: TRACK_SID },
    });

    expect(room.localParticipant!.trackPublications.has(TRACK_SID)).toBe(false);
    // The publication's track reference was dropped, and the track left the room.
    expect(publication.track).toBeUndefined();
    expect(track.resolveRoom()).toBe(null);
  });

  it('localTrackUnpublished callback still sees track', async () => {
    // Backwards-compat: publication.track is nulled AFTER the event is emitted,
    // so a callback reading publication.track during the event still sees it.
    const room = makeRoom({ name: 'room-1', token: 'tok-1', serverUrl: 'wss://r' });
    const track = makeTrack(TRACK_SID);
    attachLocalTrack(room, 'agent', TRACK_SID, track);
    const publication = room.localParticipant!.trackPublications.get(TRACK_SID)!;
    track.setRoom(room);

    const seenTrack: Array<Track | undefined> = [];
    room.on('localTrackUnpublished', (pub) => {
      seenTrack.push(pub.track);
    });

    await dispatchRoomEvent(room, {
      case: 'localTrackUnpublished',
      value: { publicationSid: TRACK_SID },
    });

    // The callback saw the track (backwards-compatible payload) ...
    expect(seenTrack).toEqual([track]);
    // ... and the reference is dropped once the handler returns.
    expect(publication.track).toBeUndefined();
  });

  it('unpublishTrack clears processor when it wins the event race', async () => {
    // unpublishTrack races the localTrackUnpublished room event. When unpublish
    // wins, the room-event handler later finds the publication gone and skips its
    // setRoom(null). The unpublish path must therefore clear the processor itself.
    const room = makeRoom({ name: 'room-1', token: 'tok-1', serverUrl: 'wss://r' });
    const track = makeTrack(TRACK_SID);
    const local = makeLocalParticipant('agent');
    const publication = makeLocalPublication(TRACK_SID, track);
    local.trackPublications.set(TRACK_SID, publication);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (room as any).localParticipant = local;
    // Fields unpublishTrack reads beyond the FFI round-trip.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (local as any).ffiEventLock = { lock: async () => () => {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (local as any).ffi_handle = { handle: BigInt(1) };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (local as any).disconnectSignal = undefined;
    track.setRoom(room);

    const proc = new RecordingProcessor();
    track.registerAudioStream(makeStream(proc));
    const clearedInfoBefore = proc.streamInfoClearedCount;
    const clearedCredsBefore = proc.credentialsClearedCount;

    // Mock the FFI round-trip so unpublishTrack resolves without a real server.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestSpy = vi.spyOn(FfiClient.instance, 'request').mockReturnValue({
      asyncId: BigInt(1),
    } as never);
    const waitForSpy = vi
      .spyOn(FfiClient.instance, 'waitFor')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValue({ error: undefined } as never);

    try {
      await local.unpublishTrack(TRACK_SID);
    } finally {
      requestSpy.mockRestore();
      waitForSpy.mockRestore();
    }

    expect(local.trackPublications.has(TRACK_SID)).toBe(false);
    expect(publication.track).toBeUndefined();
    // The unpublish path cleared the processor's room context even though the
    // room-event handler never ran.
    expect(proc.streamInfoClearedCount).toBe(clearedInfoBefore + 1);
    expect(proc.credentialsClearedCount).toBe(clearedCredsBefore + 1);
  });
});
