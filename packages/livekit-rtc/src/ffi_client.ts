// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { PartialMessage } from '@bufbuild/protobuf';
import EventEmitter from 'events';
import type TypedEmitter from 'typed-emitter';
import {
  FfiHandle,
  livekitCopyBuffer,
  livekitDispose,
  livekitFfiRequest,
  livekitInitialize,
  livekitRetrievePtr,
} from './napi/native.js';
import { FfiEvent, FfiRequest, FfiResponse } from './proto/ffi_pb.js';

export { FfiHandle, FfiEvent, FfiResponse, FfiRequest, livekitDispose as dispose };

export type FfiClientCallbacks = {
  ffi_event: (event: FfiEvent) => void;
};

export enum FfiClientEvent {
  FfiEvent = 'ffi_event',
}

export class FfiClient extends (EventEmitter as new () => TypedEmitter<FfiClientCallbacks>) {
  static _client?: FfiClient;

  /** @internal */
  static get instance(): FfiClient {
    if (!FfiClient._client) FfiClient._client = new FfiClient();

    return FfiClient._client;
  }

  constructor() {
    super();
    this.setMaxListeners(0);

    livekitInitialize((event_data: Uint8Array) => {
      const event = FfiEvent.fromBinary(event_data);
      this.emit(FfiClientEvent.FfiEvent, event);
    }, true);
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
