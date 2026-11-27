// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import {
  ConnectionState,
  DisconnectReason,
  FfiEvent,
  RoomEvent as ProtoRoomEvent,
} from '@livekit/rtc-ffi-bindings';
import { afterEach, describe, expect, it, onTestFinished, vi } from 'vitest';
import { FfiClient, FfiClientEvent } from './ffi_client.js';
import { Room, RoomEvent } from './room.js';

afterEach(() => vi.restoreAllMocks());

describe('Room.disconnect', () => {
  it.each([
    [undefined, DisconnectReason.CLIENT_INITIATED],
    [DisconnectReason.AGENT_ERROR, DisconnectReason.AGENT_ERROR],
  ])(
    'sends reason %s and uses it when the FFI room event has not arrived',
    async (reason, expected) => {
      const room = new Room();
      // Inject a connected room without allocating native handles.
      Object.assign(room, {
        _connectionState: ConnectionState.CONN_CONNECTED,
        ffiHandle: { handle: BigInt(1) },
      });
      const disconnected = vi.fn();
      room.on(RoomEvent.Disconnected, disconnected);
      const request = vi
        .spyOn(FfiClient.instance, 'request')
        .mockReturnValue({ asyncId: BigInt(1) });
      vi.spyOn(FfiClient.instance, 'waitFor').mockResolvedValue({ asyncId: BigInt(1) });

      await room.disconnect(reason);

      expect(request).toHaveBeenCalledExactlyOnceWith({
        message: { case: 'disconnect', value: { roomHandle: BigInt(1), reason: expected } },
      });
      expect(disconnected).toHaveBeenCalledExactlyOnceWith(expected);
      expect(room.connectionState).toBe(ConnectionState.CONN_DISCONNECTED);
      expect(room.listenerCount(RoomEvent.Disconnected)).toBe(0);
    },
  );

  it('does not send a request when already disconnected', async () => {
    const room = new Room();
    const request = vi.spyOn(FfiClient.instance, 'request');

    await room.disconnect(DisconnectReason.AGENT_ERROR);

    expect(request).not.toHaveBeenCalled();
  });
});

describe('server-initiated disconnect', () => {
  it('stops routing FFI events to the room', async () => {
    const roomHandle = BigInt(1);
    const room = new Room();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = room as any;
    // Inject a connected room without allocating native handles.
    Object.assign(r, {
      info: { name: 'test-room', sid: 'RM_test' },
      ffiHandle: { handle: roomHandle },
      localParticipant: { disposeOpenStreamWriters: vi.fn(), trackPublications: new Map() },
      _connectionState: ConnectionState.CONN_CONNECTED,
    });
    FfiClient.instance.on(FfiClientEvent.FfiEvent, r.onFfiEvent);
    onTestFinished(() => {
      FfiClient.instance.off(FfiClientEvent.FfiEvent, r.onFfiEvent);
    });
    const disconnected = vi.fn();
    room.on(RoomEvent.Disconnected, disconnected);

    await r.onFfiEvent(
      new FfiEvent({
        message: {
          case: 'roomEvent',
          value: new ProtoRoomEvent({
            roomHandle,
            message: { case: 'disconnected', value: { reason: DisconnectReason.ROOM_DELETED } },
          }),
        },
      }),
    );

    expect(disconnected).toHaveBeenCalledExactlyOnceWith(DisconnectReason.ROOM_DELETED);
    expect(room.connectionState).toBe(ConnectionState.CONN_DISCONNECTED);
    expect(FfiClient.instance.listeners(FfiClientEvent.FfiEvent)).not.toContain(r.onFfiEvent);
  });
});
