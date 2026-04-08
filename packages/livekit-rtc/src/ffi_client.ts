// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import {
  FfiEvent,
  FfiHandle,
  FfiRequest,
  FfiResponse,
  type PartialMessage,
  livekitCopyBuffer,
  livekitDispose,
  livekitFfiRequest,
  livekitInitialize,
  livekitRetrievePtr,
} from '@livekit/rtc-ffi-bindings';
import type { TypedEventEmitter as TypedEmitter } from '@livekit/typed-emitter';
import EventEmitter from 'events';
import { SDK_VERSION } from './version.js';

export { FfiHandle, type FfiEvent, type FfiResponse, FfiRequest, livekitDispose as dispose };

export type FfiClientCallbacks = {
  ffi_event: (event: FfiEvent) => void;
};

export enum FfiClientEvent {
  FfiEvent = 'ffi_event',
}

declare global {
  // eslint-disable-next-line no-var
  var _ffiClientInstance: FfiClient | undefined;
}

export class FfiClient extends (EventEmitter as new () => TypedEmitter<FfiClientCallbacks>) {
  /** @internal */
  static get instance(): FfiClient {
    if (!globalThis._ffiClientInstance) {
      globalThis._ffiClientInstance = new FfiClient();
    }
    return globalThis._ffiClientInstance;
  }

  constructor() {
    super();
    this.setMaxListeners(0);

    livekitInitialize(
      (event_data: Uint8Array) => {
        const event = FfiEvent.fromBinary(event_data);
        this.emit(FfiClientEvent.FfiEvent, event);
      },
      true,
      SDK_VERSION,
    );
  }

  request<T>(req: PartialMessage<FfiRequest>): T {
    const request = new FfiRequest(req);
    const req_data = request.toBinary();
    const res_data = livekitFfiRequest(req_data);
    return FfiResponse.fromBinary(res_data).message.value as T;
  }

  copyBuffer(ptr: bigint, len: number): Uint8Array {
    return livekitCopyBuffer(ptr, len);
  }

  retrievePtr(data: Uint8Array): bigint {
    return livekitRetrievePtr(data);
  }

  async waitFor<T>(
    predicate: (ev: FfiEvent) => boolean,
    options?: { signal?: AbortSignal },
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const listener = (ev: FfiEvent) => {
        if (predicate(ev)) {
          cleanup();
          resolve(ev.message.value as T);
        }
      };

      const cleanup = () => {
        this.off(FfiClientEvent.FfiEvent, listener);
        options?.signal?.removeEventListener('abort', onAbort);
      };

      // If an AbortSignal is provided, remove the listener when the signal
      // fires so that pending waitFor() calls don't leak listeners after
      // the room disconnects or the operation is cancelled.
      const onAbort = () => {
        cleanup();
        reject(options?.signal?.reason ?? new Error('waitFor aborted'));
      };

      if (options?.signal?.aborted) {
        reject(options.signal.reason ?? new Error('waitFor aborted'));
        return;
      }

      options?.signal?.addEventListener('abort', onAbort);
      this.on(FfiClientEvent.FfiEvent, listener);
    });
  }
}
