// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { Mutex } from '@livekit/mutex';
import type { OwnedParticipant } from '@livekit/rtc-ffi-bindings';
import { ConnectionState, DisconnectReason, ParticipantState } from '@livekit/rtc-ffi-bindings';
import { describe, expect, it, vi } from 'vitest';
import { FfiClient } from './ffi_client.js';
import type { RemoteParticipant } from './participant.js';
import { LocalParticipant } from './participant.js';
import { Room, RoomEvent } from './room.js';

// Same rationale as audio_stream_room_lifecycle.test.ts: these tests fabricate
// participants with synthetic FFI handle ids, so replace FfiHandle with an inert
// stub to keep the native drop-on-GC path from firing on unallocated handles.
vi.mock('@livekit/rtc-ffi-bindings', async () => {
  const actual = await vi.importActual<typeof import('@livekit/rtc-ffi-bindings')>(
    '@livekit/rtc-ffi-bindings',
  );
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

function makeLocalParticipant(identity: string): LocalParticipant {
  const owned = {
    info: { identity, state: ParticipantState.ACTIVE },
    handle: { id: BigInt(0) },
  } as unknown as OwnedParticipant;
  return new LocalParticipant(owned, new Mutex(), new AbortController().signal);
}

/** A Room wired up just enough for onFfiEvent to accept roomEvent messages. */
function makeConnectedRoom(): Room {
  const room = new Room();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = room as any;
  r.info = { name: 'test-room' };
  r.ffiHandle = { handle: BigInt(1), dispose: () => {} };
  r.localParticipant = makeLocalParticipant('local');
  r._connectionState = ConnectionState.CONN_CONNECTED;
  return room;
}

/** Push a roomEvent through the private FFI handler the way FfiClient would. */
async function emitRoomEvent(room: Room, message: unknown): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = room as any;
  await r.onFfiEvent({
    message: {
      case: 'roomEvent',
      value: { roomHandle: r.ffiHandle.handle, message },
    },
  });
}

async function connectParticipant(room: Room, identity: string): Promise<void> {
  await emitRoomEvent(room, {
    case: 'participantConnected',
    value: {
      info: {
        info: { identity, state: ParticipantState.JOINED },
        handle: { id: BigInt(0) },
      },
    },
  });
}

describe('participant active', () => {
  it('reports the state carried by participantConnected', async () => {
    const room = makeConnectedRoom();
    await connectParticipant(room, 'alice');

    expect(room.remoteParticipants.get('alice')!.state).toBe(ParticipantState.JOINED);
  });

  it('emits ParticipantActive and flips state on the FFI event', async () => {
    const room = makeConnectedRoom();
    const active: RemoteParticipant[] = [];
    room.on(RoomEvent.ParticipantActive, (p) => active.push(p));

    await connectParticipant(room, 'alice');
    expect(active).toHaveLength(0);

    await emitRoomEvent(room, {
      case: 'participantActive',
      value: { participantIdentity: 'alice' },
    });

    expect(active).toHaveLength(1);
    expect(active[0]!.identity).toBe('alice');
    expect(room.remoteParticipants.get('alice')!.state).toBe(ParticipantState.ACTIVE);
  });

  it('ignores ParticipantActive for an unknown participant', async () => {
    const room = makeConnectedRoom();
    const active: RemoteParticipant[] = [];
    room.on(RoomEvent.ParticipantActive, (p) => active.push(p));

    await emitRoomEvent(room, {
      case: 'participantActive',
      value: { participantIdentity: 'nobody' },
    });

    expect(active).toHaveLength(0);
  });

  it('marks a departing participant as disconnected', async () => {
    const room = makeConnectedRoom();
    await connectParticipant(room, 'alice');

    const departed: RemoteParticipant[] = [];
    room.on(RoomEvent.ParticipantDisconnected, (p) => departed.push(p));

    await emitRoomEvent(room, {
      case: 'participantDisconnected',
      value: {
        participantIdentity: 'alice',
        disconnectReason: DisconnectReason.CLIENT_INITIATED,
      },
    });

    expect(departed).toHaveLength(1);
    expect(departed[0]!.state).toBe(ParticipantState.DISCONNECTED);
    expect(room.remoteParticipants.has('alice')).toBe(false);
  });

  it('defaults to JOINING when the FFI omits a state', async () => {
    const room = makeConnectedRoom();
    await emitRoomEvent(room, {
      case: 'participantConnected',
      value: {
        info: { info: { identity: 'bob' }, handle: { id: BigInt(0) } },
      },
    });

    expect(room.remoteParticipants.get('bob')!.state).toBe(ParticipantState.JOINING);
  });
});

describe('participant state on room disconnect', () => {
  /**
   * A room-level disconnect is not reported as each participant departing, so
   * these assertions are about references a caller still holds afterwards — the
   * participant maps are never cleared, and `Disconnected` handlers routinely
   * capture participants.
   */

  it('marks retained participants disconnected on an explicit disconnect()', async () => {
    const room = makeConnectedRoom();
    await connectParticipant(room, 'alice');
    const alice = room.remoteParticipants.get('alice')!;
    const local = room.localParticipant!;
    await emitRoomEvent(room, {
      case: 'participantActive',
      value: { participantIdentity: 'alice' },
    });
    expect(alice.state).toBe(ParticipantState.ACTIVE);
    expect(local.state).toBe(ParticipantState.ACTIVE);

    // Mock the FFI round-trip so disconnect() resolves without a real server.
    const requestSpy = vi
      .spyOn(FfiClient.instance, 'request')
      .mockReturnValue({ asyncId: BigInt(1) } as never);
    const waitForSpy = vi
      .spyOn(FfiClient.instance, 'waitFor')
      .mockResolvedValue({ error: undefined } as never);

    try {
      await room.disconnect();
    } finally {
      requestSpy.mockRestore();
      waitForSpy.mockRestore();
    }

    expect(alice.state).toBe(ParticipantState.DISCONNECTED);
    expect(local.state).toBe(ParticipantState.DISCONNECTED);
  });

  it('marks retained participants disconnected on an FFI-driven disconnect', async () => {
    const room = makeConnectedRoom();
    await connectParticipant(room, 'alice');
    await connectParticipant(room, 'bob');
    const alice = room.remoteParticipants.get('alice')!;
    const bob = room.remoteParticipants.get('bob')!;
    const local = room.localParticipant!;
    await emitRoomEvent(room, {
      case: 'participantActive',
      value: { participantIdentity: 'alice' },
    });

    await emitRoomEvent(room, {
      case: 'disconnected',
      value: { reason: DisconnectReason.SERVER_SHUTDOWN },
    });

    // alice was ACTIVE and bob only JOINED; a room-level disconnect ends both.
    expect(alice.state).toBe(ParticipantState.DISCONNECTED);
    expect(bob.state).toBe(ParticipantState.DISCONNECTED);
    expect(local.state).toBe(ParticipantState.DISCONNECTED);
  });

  it('has already transitioned participants by the time Disconnected fires', async () => {
    const room = makeConnectedRoom();
    await connectParticipant(room, 'alice');
    await emitRoomEvent(room, {
      case: 'participantActive',
      value: { participantIdentity: 'alice' },
    });

    // The states a handler actually observes — the whole point of transitioning
    // before the event rather than after it.
    const observed: Array<ParticipantState | undefined> = [];
    room.on(RoomEvent.ConnectionStateChanged, () => {
      observed.push(room.remoteParticipants.get('alice')?.state);
    });
    room.on(RoomEvent.Disconnected, () => {
      observed.push(room.remoteParticipants.get('alice')?.state);
      observed.push(room.localParticipant?.state);
    });

    await emitRoomEvent(room, {
      case: 'disconnected',
      value: { reason: DisconnectReason.SERVER_SHUTDOWN },
    });

    expect(observed).toEqual([
      ParticipantState.DISCONNECTED,
      ParticipantState.DISCONNECTED,
      ParticipantState.DISCONNECTED,
    ]);
  });

  it('leaves participants untouched while merely reconnecting', async () => {
    const room = makeConnectedRoom();
    await connectParticipant(room, 'alice');
    const alice = room.remoteParticipants.get('alice')!;
    await emitRoomEvent(room, {
      case: 'participantActive',
      value: { participantIdentity: 'alice' },
    });

    await emitRoomEvent(room, { case: 'reconnecting', value: {} });

    expect(alice.state).toBe(ParticipantState.ACTIVE);
    expect(room.localParticipant!.state).toBe(ParticipantState.ACTIVE);
  });
});

describe('participant state vs. queued FFI events', () => {
  /**
   * onFfiEvent is dispatched synchronously by FfiClient but immediately awaits
   * ffiEventLock, so events delivered before disconnect() removes the listener
   * are still pending when cleanup runs. These drive that interleaving directly:
   * the callback is invoked (entering the lock queue) but not awaited before
   * disconnect() is called.
   */

  function mockDisconnectRoundTrip() {
    const requestSpy = vi
      .spyOn(FfiClient.instance, 'request')
      .mockReturnValue({ asyncId: BigInt(1) } as never);
    const waitForSpy = vi
      .spyOn(FfiClient.instance, 'waitFor')
      .mockResolvedValue({ error: undefined } as never);
    return () => {
      requestSpy.mockRestore();
      waitForSpy.mockRestore();
    };
  }

  it('does not let a queued participantActive resurrect state after disconnect()', async () => {
    const room = makeConnectedRoom();
    await connectParticipant(room, 'alice');
    const alice = room.remoteParticipants.get('alice')!;

    // Queued but deliberately not awaited: it is now waiting on ffiEventLock.
    const queued = emitRoomEvent(room, {
      case: 'participantActive',
      value: { participantIdentity: 'alice' },
    });

    const restore = mockDisconnectRoundTrip();
    try {
      await room.disconnect();
    } finally {
      restore();
    }
    await queued;

    expect(alice.state).toBe(ParticipantState.DISCONNECTED);
    expect(room.localParticipant!.state).toBe(ParticipantState.DISCONNECTED);
  });

  it('does not let a queued participantsUpdated resurrect state after disconnect()', async () => {
    const room = makeConnectedRoom();
    await connectParticipant(room, 'alice');
    const alice = room.remoteParticipants.get('alice')!;

    // participantsUpdated replaces `info` wholesale, so it overwrites state too.
    const queued = emitRoomEvent(room, {
      case: 'participantsUpdated',
      value: {
        participants: [{ identity: 'alice', state: ParticipantState.ACTIVE }],
      },
    });

    const restore = mockDisconnectRoundTrip();
    try {
      await room.disconnect();
    } finally {
      restore();
    }
    await queued;

    expect(alice.state).toBe(ParticipantState.DISCONNECTED);
  });

  it('drains queued events before cleanup rather than dropping them', async () => {
    const room = makeConnectedRoom();
    await connectParticipant(room, 'alice');

    const seen: string[] = [];
    room.on(RoomEvent.ParticipantActive, () => seen.push('active'));
    room.on(RoomEvent.Disconnected, () => seen.push('disconnected'));

    const queued = emitRoomEvent(room, {
      case: 'participantActive',
      value: { participantIdentity: 'alice' },
    });

    const restore = mockDisconnectRoundTrip();
    try {
      await room.disconnect();
    } finally {
      restore();
    }
    await queued;

    // The queued event still ran; it simply ran first.
    expect(seen).toEqual(['active', 'disconnected']);
  });
});
