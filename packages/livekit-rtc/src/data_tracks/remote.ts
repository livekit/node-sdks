// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import type {
  DataTrackStreamEvent,
  OwnedDataTrackStream,
  OwnedRemoteDataTrack,
  SubscribeDataTrackResponse,
} from '@livekit/rtc-ffi-bindings';
import {
  DataTrackStreamReadRequest,
  DataTrackSubscribeOptions as ProtoDataTrackSubscribeOptions,
  SubscribeDataTrackRequest,
} from '@livekit/rtc-ffi-bindings';
import type { UnderlyingSource } from 'node:stream/web';
import { FfiClient, FfiHandle } from '../ffi_client.js';
import type { DataTrackFrame, DataTrackInfo, DataTrackSubscribeOptions } from './types.js';

/** Data track published by a remote participant. */
export class RemoteDataTrack {
  /** Information about the data track. */
  info: DataTrackInfo;
  /** Identity of the participant who published the track. */
  publisherIdentity: string;
  private ffiHandle: FfiHandle;

  /** @internal */
  constructor(ownedTrack: OwnedRemoteDataTrack) {
    this.info = {
      sid: ownedTrack.info!.sid!,
      name: ownedTrack.info!.name!,
      usesE2ee: ownedTrack.info!.usesE2ee!,
    };
    this.publisherIdentity = ownedTrack.publisherIdentity!;
    this.ffiHandle = new FfiHandle(ownedTrack.handle!.id!);
  }

  /**
   * Subscribes to the data track to receive frames.
   *
   * Returns a `ReadableStream` that yields {@link DataTrackFrame}s as they arrive.
   *
   * An application may call `subscribe` more than once to process frames in multiple places.
   * Internally, only the first call communicates with the SFU and allocates the resources
   * required to receive frames. Additional subscriptions reuse the same underlying pipeline
   * and do not trigger additional signaling.
   *
   * Note that newly created subscriptions only receive frames published after the initial
   * subscription is established.
   */
  subscribe(options?: DataTrackSubscribeOptions): ReadableStream<DataTrackFrame> {
    const opts = new ProtoDataTrackSubscribeOptions({
      bufferSize: options?.bufferSize,
    });

    const res = FfiClient.instance.request<SubscribeDataTrackResponse>({
      message: {
        case: 'subscribeDataTrack',
        value: new SubscribeDataTrackRequest({
          trackHandle: this.ffiHandle.handle,
          options: opts,
        }),
      },
    });

    return new ReadableStream<DataTrackFrame>(
      new DataTrackStreamSource(res.stream!),
      options?.bufferSize != null
        ? new CountQueuingStrategy({ highWaterMark: options.bufferSize })
        : undefined,
    );
  }
}

class DataTrackStreamSource implements UnderlyingSource<DataTrackFrame> {
  private ffiHandle: FfiHandle;
  private streamHandle: bigint;
  private disposed = false;

  constructor(ownedStream: OwnedDataTrackStream) {
    this.ffiHandle = new FfiHandle(ownedStream.handle!.id!);
    this.streamHandle = ownedStream.handle!.id!;
  }

  async pull(controller: ReadableStreamDefaultController<DataTrackFrame>): Promise<void> {
    FfiClient.instance.request({
      message: {
        case: 'dataTrackStreamRead',
        value: new DataTrackStreamReadRequest({
          streamHandle: this.streamHandle,
        }),
      },
    });

    const event = await FfiClient.instance.waitFor<DataTrackStreamEvent>((ev) => {
      return (
        ev.message.case === 'dataTrackStreamEvent' &&
        ev.message.value.streamHandle === this.streamHandle
      );
    });

    switch (event.detail.case) {
      case 'frameReceived': {
        const protoFrame = event.detail.value.frame!;
        controller.enqueue({
          payload: protoFrame.payload!,
          userTimestamp: protoFrame.userTimestamp,
        });
        break;
      }
      case 'eos': {
        this.dispose();
        if (event.detail.value.error) {
          controller.error(new Error(event.detail.value.error));
        } else {
          controller.close();
        }
        break;
      }
    }
  }

  cancel(): void {
    this.dispose();
  }

  private dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
      this.ffiHandle.dispose();
    }
  }
}
