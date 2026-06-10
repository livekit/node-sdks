// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type {
  LocalDataTrackIsPublishedResponse,
  LocalDataTrackTryPushResponse,
  OwnedLocalDataTrack,
} from '@livekit/rtc-ffi-bindings';
import {
  LocalDataTrackIsPublishedRequest,
  LocalDataTrackTryPushRequest,
  LocalDataTrackUnpublishRequest,
  DataTrackFrame as ProtoDataTrackFrame,
} from '@livekit/rtc-ffi-bindings';
import { FfiClient, FfiHandle } from '../ffi_client.js';
import type { DataTrackFrame, DataTrackInfo } from './types.js';
import { DataTrackPushFrameError } from './types.js';

/** Data track published by the local participant. */
export class LocalDataTrack {
  private _info: DataTrackInfo;
  private ffiHandle: FfiHandle;

  /** @internal */
  constructor(ownedTrack: OwnedLocalDataTrack) {
    this._info = {
      sid: ownedTrack.info!.sid!,
      name: ownedTrack.info!.name!,
      usesE2ee: ownedTrack.info!.usesE2ee!,
    };
    this.ffiHandle = new FfiHandle(ownedTrack.handle!.id!);
  }

  /** Information about the data track. */
  get info(): DataTrackInfo {
    return this._info;
  }

  /** Whether or not the track is still published. */
  isPublished(): boolean {
    const res = FfiClient.instance.request<LocalDataTrackIsPublishedResponse>({
      message: {
        case: 'localDataTrackIsPublished',
        value: new LocalDataTrackIsPublishedRequest({
          trackHandle: this.ffiHandle.handle,
        }),
      },
    });
    return res.isPublished!;
  }

  /**
   * Try pushing a frame to subscribers of the track.
   *
   * See {@link DataTrackFrame} for how to construct a frame and attach metadata.
   *
   * Pushing a frame can fail for several reasons:
   *
   * - The track has been unpublished by the local participant or SFU
   * - The room is no longer connected
   *
   * @throws {@link DataTrackPushFrameError} If the push fails.
   */
  tryPush(frame: DataTrackFrame): void {
    const protoFrame = new ProtoDataTrackFrame({
      payload: frame.payload,
      userTimestamp: frame.userTimestamp,
    });

    const res = FfiClient.instance.request<LocalDataTrackTryPushResponse>({
      message: {
        case: 'localDataTrackTryPush',
        value: new LocalDataTrackTryPushRequest({
          trackHandle: this.ffiHandle.handle,
          frame: protoFrame,
        }),
      },
    });

    if (res.error) {
      throw new DataTrackPushFrameError(res.error.message!);
    }
  }

  /**
   * Unpublish the track from the SFU. Once this is called, any further calls to
   * {@link tryPush} will fail.
   */
  async unpublish(): Promise<void> {
    FfiClient.instance.request({
      message: {
        case: 'localDataTrackUnpublish',
        value: new LocalDataTrackUnpublishRequest({
          trackHandle: this.ffiHandle.handle,
        }),
      },
    });
  }
}
