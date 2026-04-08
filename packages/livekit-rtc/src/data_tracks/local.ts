// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import type {
  LocalDataTrackIsPublishedResponse,
  LocalDataTrackTryPushResponse,
  OwnedLocalDataTrack,
} from '@livekit/rtc-ffi-bindings';
import {
  DataTrackFrame as ProtoDataTrackFrame,
  LocalDataTrackIsPublishedRequest,
  LocalDataTrackTryPushRequest,
  LocalDataTrackUnpublishRequest,
} from '@livekit/rtc-ffi-bindings';
import { FfiClient, FfiHandle } from '../ffi_client.js';
import type { DataTrackFrame, DataTrackInfo } from './types.js';
import { DataTrackPushFrameError } from './types.js';

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

  get info(): DataTrackInfo {
    return this._info;
  }

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
