// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { create } from '@bufbuild/protobuf';
import { FfiClient } from './ffi_client.js';
import type {
  E2eeManagerGetFrameCryptorsResponse,
  E2eeResponse,
  GetKeyResponse,
  GetSharedKeyResponse,
  RatchetKeyResponse,
  RatchetSharedKeyResponse,
} from './proto/e2ee_pb.js';
import {
  E2eeManagerSetEnabledRequestSchema,
  E2eeRequestSchema,
  EncryptionType,
  FrameCryptorSetEnabledRequestSchema,
  FrameCryptorSetKeyIndexRequestSchema,
  GetKeyRequestSchema,
  GetSharedKeyRequestSchema,
  RatchetKeyRequestSchema,
  RatchetSharedKeyRequestSchema,
  SetKeyRequestSchema,
  SetSharedKeyRequestSchema,
} from './proto/e2ee_pb.js';

const DEFAULT_RATCHET_SALT = new TextEncoder().encode('LKFrameEncryptionKey');
const DEFAULT_RATCHET_WINDOW_SIZE = 16;
const DEFAULT_FAILURE_TOLERANCE = -1;

export interface KeyProviderOptions {
  sharedKey?: Uint8Array;
  ratchetSalt: Uint8Array;
  ratchetWindowSize: number;
  failureTolerance: number;
}

export const defaultKeyProviderOptions: KeyProviderOptions = {
  ratchetSalt: DEFAULT_RATCHET_SALT,
  ratchetWindowSize: DEFAULT_RATCHET_WINDOW_SIZE,
  failureTolerance: DEFAULT_FAILURE_TOLERANCE,
};

export interface E2EEOptions {
  keyProviderOptions: KeyProviderOptions;
  encryptionType: EncryptionType;
}

export const defaultE2EEOptions: E2EEOptions = {
  keyProviderOptions: defaultKeyProviderOptions,
  encryptionType: EncryptionType.GCM,
};

export class KeyProvider {
  private roomHandle: bigint;
  options: KeyProviderOptions;

  /** internal */
  constructor(roomHandle: bigint, opts: KeyProviderOptions) {
    this.roomHandle = roomHandle;
    this.options = opts;
  }

  setSharedKey(sharedKey: Uint8Array, keyIndex: number) {
    const req = create(E2eeRequestSchema, {
      roomHandle: this.roomHandle,
      message: {
        case: 'setSharedKey',
        value: create(SetSharedKeyRequestSchema, {
          keyIndex: keyIndex,
          sharedKey: sharedKey,
        }),
      },
    });

    FfiClient.instance.request({
      message: {
        case: 'e2ee',
        value: req,
      },
    });
  }

  exportSharedKey(keyIndex: number): Uint8Array {
    const req = create(E2eeRequestSchema, {
      roomHandle: this.roomHandle,
      message: {
        case: 'getSharedKey',
        value: create(GetSharedKeyRequestSchema, {
          keyIndex: keyIndex,
        }),
      },
    });

    const res = FfiClient.instance.request<E2eeResponse>({
      message: {
        case: 'e2ee',
        value: req,
      },
    });

    return (res.message.value as GetSharedKeyResponse).key;
  }

  ratchetSharedKey(keyIndex: number): Uint8Array {
    const req = create(E2eeRequestSchema, {
      roomHandle: this.roomHandle,
      message: {
        case: 'ratchetSharedKey',
        value: create(RatchetSharedKeyRequestSchema, {
          keyIndex: keyIndex,
        }),
      },
    });

    const res = FfiClient.instance.request<E2eeResponse>({
      message: {
        case: 'e2ee',
        value: req,
      },
    });

    return (res.message.value as RatchetSharedKeyResponse).newKey;
  }

  setKey(participantIdentity: string, keyIndex: number) {
    const req = create(E2eeRequestSchema, {
      roomHandle: this.roomHandle,
      message: {
        case: 'setKey',
        value: create(SetKeyRequestSchema, {
          keyIndex: keyIndex,
          participantIdentity: participantIdentity,
        }),
      },
    });

    FfiClient.instance.request({
      message: {
        case: 'e2ee',
        value: req,
      },
    });
  }

  exportKey(participantIdentity: string, keyIndex: number): Uint8Array {
    const req = create(E2eeRequestSchema, {
      roomHandle: this.roomHandle,
      message: {
        case: 'getKey',
        value: create(GetKeyRequestSchema, {
          keyIndex: keyIndex,
          participantIdentity: participantIdentity,
        }),
      },
    });

    const res = FfiClient.instance.request<E2eeResponse>({
      message: {
        case: 'e2ee',
        value: req,
      },
    });

    return (res.message.value as GetKeyResponse).key;
  }

  ratchetKey(participantIdentity: string, keyIndex: number): Uint8Array {
    const req = create(E2eeRequestSchema, {
      roomHandle: this.roomHandle,
      message: {
        case: 'ratchetKey',
        value: create(RatchetKeyRequestSchema, {
          keyIndex: keyIndex,
          participantIdentity: participantIdentity,
        }),
      },
    });

    const res = FfiClient.instance.request<E2eeResponse>({
      message: {
        case: 'e2ee',
        value: req,
      },
    });

    return (res.message.value as RatchetKeyResponse).newKey;
  }
}

export class FrameCryptor {
  private roomHandle = BigInt(0);
  participantIdentity: string;
  keyIndex: number;
  enabled: boolean;

  constructor(roomHandle: bigint, participantIdentity: string, keyIndex: number, enabled: boolean) {
    this.roomHandle = roomHandle;
    this.participantIdentity = participantIdentity;
    this.keyIndex = keyIndex;
    this.enabled = enabled;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    const req = create(E2eeRequestSchema, {
      roomHandle: this.roomHandle,
      message: {
        case: 'cryptorSetEnabled',
        value: create(FrameCryptorSetEnabledRequestSchema, {
          participantIdentity: this.participantIdentity,
          enabled: this.enabled,
        }),
      },
    });

    FfiClient.instance.request({
      message: {
        case: 'e2ee',
        value: req,
      },
    });
  }

  setKeyIndex(keyIndex: number) {
    this.keyIndex = keyIndex;
    const req = create(E2eeRequestSchema, {
      roomHandle: this.roomHandle,
      message: {
        case: 'cryptorSetKeyIndex',
        value: create(FrameCryptorSetKeyIndexRequestSchema, {
          participantIdentity: this.participantIdentity,
          keyIndex: this.keyIndex,
        }),
      },
    });

    FfiClient.instance.request({
      message: {
        case: 'e2ee',
        value: req,
      },
    });
  }
}

export class E2EEManager {
  private roomHandle = BigInt(0);
  private options: E2EEOptions;
  private keyProvider?: KeyProvider;

  enabled: boolean;

  constructor(roomHandle: bigint, opts?: E2EEOptions) {
    this.roomHandle = roomHandle;
    this.enabled = opts !== undefined;

    opts ??= defaultE2EEOptions;
    const options = { ...defaultE2EEOptions, ...opts };

    this.options = options;
    this.keyProvider = new KeyProvider(roomHandle, options.keyProviderOptions);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    const req = create(E2eeRequestSchema, {
      roomHandle: this.roomHandle,
      message: {
        case: 'managerSetEnabled',
        value: create(E2eeManagerSetEnabledRequestSchema, {
          enabled: this.enabled,
        }),
      },
    });

    FfiClient.instance.request({
      message: {
        case: 'e2ee',
        value: req,
      },
    });
  }

  frameCryptors(): FrameCryptor[] {
    const req = create(E2eeRequestSchema, {
      roomHandle: this.roomHandle,
      message: {
        case: 'managerGetFrameCryptors',
        value: {},
      },
    });

    const res = FfiClient.instance.request<E2eeResponse>({
      message: {
        case: 'e2ee',
        value: req,
      },
    });

    const frameCryptors = (
      res.message.value as E2eeManagerGetFrameCryptorsResponse
    ).frameCryptors.map(
      (cryptor) =>
        new FrameCryptor(
          this.roomHandle,
          cryptor.participantIdentity,
          cryptor.keyIndex,
          cryptor.enabled,
        ),
    );

    return frameCryptors;
  }
}
