// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { ConnectionState, DisconnectReason } from '@livekit/rtc-ffi-bindings';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FfiClient } from './ffi_client.js';
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
