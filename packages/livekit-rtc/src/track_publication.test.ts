// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { SetRemoteTrackPublicationQualityRequest, VideoQuality } from '@livekit/rtc-ffi-bindings';
import { describe, expect, it, vi } from 'vitest';
import { FfiClient } from './ffi_client.js';
import { RemoteTrackPublication } from './track_publication.js';

// Synthetic FFI handles must not schedule a native drop (invalid handle) at GC.
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

describe('RemoteTrackPublication.setVideoQuality', () => {
  it('dispatches SetRemoteTrackPublicationQuality with the publication handle', () => {
    const handleId = BigInt(42);
    const publication = new RemoteTrackPublication({
      handle: { id: handleId },
      info: {},
    } as never);

    const requestSpy = vi.spyOn(FfiClient.instance, 'request').mockReturnValue({} as never);
    try {
      publication.setVideoQuality(VideoQuality.HIGH);
      expect(requestSpy).toHaveBeenCalledTimes(1);
      const arg = requestSpy.mock.calls[0]![0] as {
        message: { case: string; value: SetRemoteTrackPublicationQualityRequest };
      };
      expect(arg.message.case).toBe('setRemoteTrackPublicationQuality');
      expect(arg.message.value.trackPublicationHandle).toBe(handleId);
      expect(arg.message.value.quality).toBe(VideoQuality.HIGH);
    } finally {
      requestSpy.mockRestore();
    }
  });
});
