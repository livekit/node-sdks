// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type * as Bindings from '@livekit/rtc-ffi-bindings';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { livekitInitialize } = vi.hoisted(() => ({ livekitInitialize: vi.fn() }));

vi.mock('@livekit/rtc-ffi-bindings', async () => ({
  ...(await vi.importActual<typeof Bindings>('@livekit/rtc-ffi-bindings')),
  livekitInitialize,
}));

describe('FfiClient', () => {
  afterEach(() => {
    globalThis._ffiClientInstance = undefined;
  });

  it('leaves native logs to the native logger instead of forwarding them as FFI events', async () => {
    const { FfiClient } = await import('./ffi_client.js');

    void FfiClient.instance;

    expect(livekitInitialize).toHaveBeenCalledWith(expect.any(Function), false, expect.any(String));
  });
});
