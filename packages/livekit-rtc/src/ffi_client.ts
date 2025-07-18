// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { PartialMessage } from '@bufbuild/protobuf';
import type { TypedEventEmitter as TypedEmitter } from '@livekit/typed-emitter';
import EventEmitter from 'events';
import { log } from './log.js';
import {
  FfiHandle,
  livekitCopyBuffer,
  livekitDispose,
  livekitFfiRequest,
  livekitInitialize,
  livekitRetrievePtr,
} from './napi/native.js';
import { FfiEvent, FfiRequest, FfiResponse } from './proto/ffi_pb.js';
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

export class FfiQueue<T> {
  private subscribers: Set<ReadableStreamDefaultController<T>> = new Set();

  constructor() {}

  put(item: T): void {
    const toRemove: Set<ReadableStreamDefaultController<T>> = new Set();

    for (const controller of this.subscribers) {
      try {
        controller.enqueue(item);
      } catch (error: unknown) {
        log.error(error, 'Error enqueuing item to stream');
        toRemove.add(controller);
      }
    }

    for (const controller of toRemove) {
      this.subscribers.delete(controller);
    }
  }

  subscribe(): ReadableStream<T> {
    let controller: ReadableStreamDefaultController<T>;

    const stream = new ReadableStream<T>({
      start: (ctrl) => {
        controller = ctrl;
        this.subscribers.add(controller);
      },
      cancel: () => {
        this.subscribers.delete(controller);
      },
    });

    return stream;
  }

  unsubscribe(stream: ReadableStream<T>): void {
    stream.cancel();
  }
}

export class FfiClient extends (EventEmitter as new () => TypedEmitter<FfiClientCallbacks>) {
  /** @internal */
  static get instance(): FfiClient {
    if (!globalThis._ffiClientInstance) {
      globalThis._ffiClientInstance = new FfiClient();
    }
    return globalThis._ffiClientInstance;
  }

  private _queue: FfiQueue<FfiEvent> = new FfiQueue<FfiEvent>();
  constructor() {
    super();
    this.setMaxListeners(0);
    this._queue = new FfiQueue<FfiEvent>();

    livekitInitialize(
      (event_data: Uint8Array) => {
        const event = FfiEvent.fromBinary(event_data);
        this.emit(FfiClientEvent.FfiEvent, event);
        this._queue.put(event);
      },
      true,
      SDK_VERSION,
    );
  }

  get queue(): FfiQueue<FfiEvent> {
    return this._queue;
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

  async waitFor<T>(predicate: (ev: FfiEvent) => boolean): Promise<T> {
    return new Promise<T>((resolve) => {
      const listener = (ev: FfiEvent) => {
        if (predicate(ev)) {
          this.off(FfiClientEvent.FfiEvent, listener);
          resolve(ev.message.value as T);
        }
      };
      this.on(FfiClientEvent.FfiEvent, listener);
    });
  }
}
