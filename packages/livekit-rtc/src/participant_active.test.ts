// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { DisconnectReason, ParticipantState } from '@livekit/rtc-ffi-bindings';
import { describe, expect, it, vi } from 'vitest';
import type { RemoteParticipant } from './participant.js';
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

/** A Room wired up just enough for onFfiEvent to accept roomEvent messages. */
function makeConnectedRoom(): Room {
  const room = new Room();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = room as any;
  r.info = { name: 'test-room' };
  r.ffiHandle = { handle: BigInt(1), dispose: () => {} };
  r.localParticipant = {};
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
