// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { PartialMessage } from '@bufbuild/protobuf';
import {
  E2eeManagerGetFrameCryptorsResponse,
  FfiRequest,
  FrameCryptor as FrameCryptorInfo,
} from '@livekit/rtc-ffi-bindings';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { E2EEManager, FrameCryptor, KeyProvider, defaultKeyProviderOptions } from './e2ee.js';
import { FfiClient } from './ffi_client.js';

const roomHandle = BigInt(1);

function captureRequests() {
  const requests: PartialMessage<FfiRequest>[] = [];
  vi.spyOn(FfiClient.instance, 'request').mockImplementation((req) => {
    requests.push(req);
    return {} as never;
  });
  return requests;
}

describe('E2EE FFI requests', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('KeyProvider.setKey sends the key so the request can be encoded', () => {
    const requests = captureRequests();
    const key = new Uint8Array([1, 2, 3]);

    new KeyProvider(roomHandle, defaultKeyProviderOptions).setKey('alice', key, 0);

    const req = new FfiRequest(requests[0]);
    expect(() => req.toBinary()).not.toThrow();
    const e2ee = req.message.value as { message: { case: string; value: { key?: Uint8Array } } };
    expect(e2ee.message.case).toBe('setKey');
    expect(e2ee.message.value.key).toEqual(key);
  });

  it('FrameCryptor requests carry the track SID so they can be encoded', () => {
    const requests = captureRequests();
    const cryptor = new FrameCryptor(roomHandle, 'alice', 'TR_audio', 0, true);

    cryptor.setEnabled(false);
    cryptor.setKeyIndex(2);

    expect(requests).toHaveLength(2);
    for (const r of requests) {
      const req = new FfiRequest(r);
      expect(() => req.toBinary()).not.toThrow();
      const e2ee = req.message.value as { message: { value: { trackSid?: string } } };
      expect(e2ee.message.value.trackSid).toBe('TR_audio');
    }
  });

  it('E2EEManager.frameCryptors keeps the track SID of each cryptor', () => {
    vi.spyOn(FfiClient.instance, 'request').mockReturnValue({
      message: {
        case: 'managerGetFrameCryptors',
        value: new E2eeManagerGetFrameCryptorsResponse({
          frameCryptors: [
            new FrameCryptorInfo({
              participantIdentity: 'alice',
              trackSid: 'TR_video',
              keyIndex: 1,
              enabled: true,
            }),
          ],
        }),
      },
    });

    const [cryptor] = new E2EEManager(roomHandle).frameCryptors();

    expect(cryptor!.participantIdentity).toBe('alice');
    expect(cryptor!.trackSid).toBe('TR_video');
    expect(cryptor!.keyIndex).toBe(1);
    expect(cryptor!.enabled).toBe(true);
  });
});
