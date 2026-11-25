// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { ConnectionState, FfiEvent, RoomEvent as ProtoRoomEvent } from '@livekit/rtc-ffi-bindings';
import { describe, expect, it } from 'vitest';
import { Room, RoomEvent } from './room.js';

const ROOM_HANDLE = BigInt(1);

/**
 * A Room wired up as if connect() had succeeded, but with an empty SID in the
 * join response. The server does this when the media node has not resolved the
 * room yet (TEL-1317); the SID then arrives later as a RoomSidChanged event.
 */
function makeConnectedRoomWithoutSid(): Room {
  const room = new Room();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = room as any;
  r.info = { name: 'test-room', sid: '' };
  r.ffiHandle = { handle: ROOM_HANDLE };
  r.localParticipant = { ffi_handle: { handle: BigInt(2) } };
  r._connectionState = ConnectionState.CONN_CONNECTED;
  return room;
}

function sidChangedEvent(sid: string): FfiEvent {
  return new FfiEvent({
    message: {
      case: 'roomEvent',
      value: new ProtoRoomEvent({
        roomHandle: ROOM_HANDLE,
        message: { case: 'roomSidChanged', value: { sid } },
      }),
    },
  });
}

function roomUpdatedEvent(sid: string): FfiEvent {
  return new FfiEvent({
    message: {
      case: 'roomEvent',
      value: new ProtoRoomEvent({
        roomHandle: ROOM_HANDLE,
        message: { case: 'roomUpdated', value: { name: 'test-room', sid } },
      }),
    },
  });
}

async function deliver(room: Room, event: FfiEvent): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (room as any).onFfiEvent(event);
}

/** Resolves to 'timeout' instead of hanging the suite if getSid() never settles. */
function withTimeout(promise: Promise<string>, ms = 200): Promise<string> {
  return Promise.race([
    promise,
    new Promise<string>((resolve) => setTimeout(() => resolve('timeout'), ms)),
  ]);
}

describe('Room.getSid', () => {
  it('resolves when the SID arrives after getSid() is called', async () => {
    const room = makeConnectedRoomWithoutSid();
    const pending = room.getSid();
    await deliver(room, sidChangedEvent('RM_abc'));
    await expect(withTimeout(pending)).resolves.toBe('RM_abc');
  });

  // Regression: the FFI sends RoomSidChanged exactly once per connection. When
  // the event landed before user code called getSid(), the SID was emitted but
  // never stored, so getSid() waited on an event that would never fire again
  // and the promise stayed pending forever.
  it('resolves when the SID arrived before getSid() is called', async () => {
    const room = makeConnectedRoomWithoutSid();
    await deliver(room, sidChangedEvent('RM_abc'));
    await expect(withTimeout(room.getSid())).resolves.toBe('RM_abc');
  });

  it('resolves a pending getSid() when the SID arrives via a room update', async () => {
    const room = makeConnectedRoomWithoutSid();
    const pending = room.getSid();
    await deliver(room, roomUpdatedEvent('RM_abc'));
    await expect(withTimeout(pending)).resolves.toBe('RM_abc');
  });

  it('resolves when the SID arrived via a room update before getSid() is called', async () => {
    const room = makeConnectedRoomWithoutSid();
    await deliver(room, roomUpdatedEvent('RM_abc'));
    await expect(withTimeout(room.getSid())).resolves.toBe('RM_abc');
  });

  it('does not re-emit RoomSidChanged for a room update that repeats the same SID', async () => {
    const room = makeConnectedRoomWithoutSid();
    const seen: string[] = [];
    room.on(RoomEvent.RoomSidChanged, (sid) => seen.push(sid));
    await deliver(room, sidChangedEvent('RM_abc'));
    await deliver(room, roomUpdatedEvent('RM_abc'));
    expect(seen).toEqual(['RM_abc']);
  });

  it('ignores an empty SID in a room update and keeps waiting', async () => {
    const room = makeConnectedRoomWithoutSid();
    const pending = room.getSid();
    await deliver(room, roomUpdatedEvent(''));
    await expect(withTimeout(pending, 100)).resolves.toBe('timeout');
    await deliver(room, sidChangedEvent('RM_abc'));
    await expect(withTimeout(pending)).resolves.toBe('RM_abc');
  });
});
