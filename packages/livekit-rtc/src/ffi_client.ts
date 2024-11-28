// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { MessageInitShape } from '@bufbuild/protobuf';
import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
import type { TypedEventEmitter as TypedEmitter } from '@livekit/typed-emitter';
import EventEmitter from 'events';
import {
  FfiHandle,
  livekitCopyBuffer,
  livekitDispose,
  livekitFfiRequest,
  livekitInitialize,
  livekitRetrievePtr,
} from './napi/native.js';
import {
  type FfiEvent,
  FfiEventSchema,
  type FfiRequest,
  FfiRequestSchema,
  type FfiResponse,
  FfiResponseSchema,
} from './proto/ffi_pb.js';
import { SDK_VERSION } from './version.js';

export { FfiHandle, type FfiEvent, type FfiResponse, type FfiRequest, livekitDispose as dispose };

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

    livekitInitialize(
      (event_data: Uint8Array) => {
        const event = fromBinary(FfiEventSchema, event_data);
        this.emit(FfiClientEvent.FfiEvent, event);
      },
      true,
      SDK_VERSION,
    );
  }

  request<T>(req: MessageInitShape<typeof FfiRequestSchema>): T {
    const request = create(FfiRequestSchema, req);
    const req_data = toBinary(FfiRequestSchema, request);
    const res_data = livekitFfiRequest(req_data);
    return fromBinary(FfiResponseSchema, res_data).message.value as T;
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
