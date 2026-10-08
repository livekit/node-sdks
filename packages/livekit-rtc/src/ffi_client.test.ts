// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { FfiEvent } from '@livekit/rtc-ffi-bindings';
import type { PartialMessage } from '@livekit/rtc-ffi-bindings';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FfiClient, FfiClientEvent } from './ffi_client.js';

const native = vi.hoisted(() => ({
  onEvent: undefined as ((data: Uint8Array) => void) | undefined,
}));

vi.mock('@livekit/rtc-ffi-bindings', async () => {
  const actual = await vi.importActual<typeof import('@livekit/rtc-ffi-bindings')>(
    '@livekit/rtc-ffi-bindings',
  );
  return {
    ...actual,
    livekitInitialize: (onEvent: (data: Uint8Array) => void) => {
      native.onEvent = onEvent;
    },
  };
});

function deliver(event: PartialMessage<FfiEvent>) {
  native.onEvent!(new FfiEvent(event).toBinary());
}

function audioStreamEos(streamHandle: bigint): PartialMessage<FfiEvent> {
  return {
    message: {
      case: 'audioStreamEvent',
      value: { streamHandle, message: { case: 'eos', value: {} } },
    },
  };
}

function captureAudioFrameCallback(asyncId: bigint): PartialMessage<FfiEvent> {
  return { message: { case: 'captureAudioFrame', value: { asyncId } } };
}

describe('FfiClient event routing', () => {
  let client: FfiClient;
  let emitted: FfiEvent[];

  beforeEach(() => {
    globalThis._ffiClientInstance = undefined;
    client = FfiClient.instance;
    emitted = [];
    client.on(FfiClientEvent.FfiEvent, (ev) => emitted.push(ev));
  });

  it('hands an audio stream event to its own stream only, without emitting it', () => {
    const first = vi.fn();
    const second = vi.fn();
    client.onAudioStreamEvent(1n, first);
    client.onAudioStreamEvent(2n, second);

    deliver(audioStreamEos(2n));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
    expect(second.mock.calls[0]![0].message.value.streamHandle).toBe(2n);
    expect(emitted).toEqual([]);
  });

  it('drops an audio stream event once its stream is removed', () => {
    const listener = vi.fn();
    client.onAudioStreamEvent(1n, listener);
    client.offAudioStreamEvent(1n);

    deliver(audioStreamEos(1n));

    expect(listener).not.toHaveBeenCalled();
    expect(emitted).toEqual([]);
  });

  it('resolves the waiter for a capture callback, without emitting it', async () => {
    const callback = client.waitForCaptureAudioFrame(7n);

    deliver(captureAudioFrameCallback(7n));

    await expect(callback).resolves.toMatchObject({ asyncId: 7n });
    expect(emitted).toEqual([]);
  });

  it('still emits a capture callback that nothing waits for', () => {
    deliver(captureAudioFrameCallback(8n));

    expect(emitted).toHaveLength(1);
    expect(emitted[0]!.message.case).toBe('captureAudioFrame');
  });

  it('emits every other event as before', () => {
    deliver({ message: { case: 'disconnect', value: { asyncId: 9n } } });

    expect(emitted).toHaveLength(1);
    expect(emitted[0]!.message.case).toBe('disconnect');
  });
});
