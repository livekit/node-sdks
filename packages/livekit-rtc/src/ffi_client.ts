// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import {
  type CaptureAudioFrameCallback,
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

  private _nextRequestAsyncId = BigInt(0);

  // Audio frames are most of the events and each has exactly one reader, its stream; emitting them
  // would make every stream and room in the process check every other call's frames.
  private audioStreamListeners = new Map<bigint, (event: FfiEvent) => void>();

  // Every audio frame an agent speaks gets its own callback. Waiting on the emitter would add and
  // remove a listener per frame and make every other waiter test it.
  private captureAudioFrameWaiters = new Map<
    bigint,
    (callback: CaptureAudioFrameCallback) => void
  >();

  constructor() {
    super();
    this.setMaxListeners(0);

    livekitInitialize(
      (event_data: Uint8Array) => {
        const event = FfiEvent.fromBinary(event_data);
        if (event.message.case === 'audioStreamEvent') {
          this.audioStreamListeners.get(event.message.value.streamHandle!)?.(event);
          return;
        }
        if (event.message.case === 'captureAudioFrame') {
          const asyncId = event.message.value.asyncId!;
          const waiter = this.captureAudioFrameWaiters.get(asyncId);
          if (waiter) {
            this.captureAudioFrameWaiters.delete(asyncId);
            waiter(event.message.value);
            return;
          }
        }
        this.emit(FfiClientEvent.FfiEvent, event);
      },
      true,
      SDK_VERSION,
    );
  }

  /** @internal */
  onAudioStreamEvent(streamHandle: bigint, listener: (event: FfiEvent) => void) {
    this.audioStreamListeners.set(streamHandle, listener);
  }

  /** @internal */
  offAudioStreamEvent(streamHandle: bigint) {
    this.audioStreamListeners.delete(streamHandle);
  }

  /** @internal Call in the same tick as the request, so its callback cannot arrive first. */
  waitForCaptureAudioFrame(asyncId: bigint): Promise<CaptureAudioFrameCallback> {
    return new Promise((resolve) => {
      this.captureAudioFrameWaiters.set(asyncId, resolve);
    });
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

  getNextRequestAsyncId() {
    return ++this._nextRequestAsyncId;
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
