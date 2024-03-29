// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import { FfiClient, FfiRequest } from './ffi_client.js';
import { FfiHandle } from './napi/native.js';
import { EncryptionType } from './proto/e2ee_pb.js';
import { SetSubscribedRequest, SetSubscribedResponse } from './proto/room_pb.js';
import {
  OwnedTrackPublication,
  TrackKind,
  TrackPublicationInfo,
  TrackSource,
} from './proto/track_pb.js';
import { Track } from './track.js';

export abstract class TrackPublication {
  /** @internal */
  ffiHandle: FfiHandle;

  /** @internal */
  info: TrackPublicationInfo;
  track?: Track;

  constructor(ownedInfo: OwnedTrackPublication) {
    this.info = ownedInfo.info;
    this.ffiHandle = new FfiHandle(ownedInfo.handle.id);
  }

  get sid(): string {
    return this.info.sid;
  }

  get name(): string {
    return this.info.name;
  }

  get kind(): TrackKind {
    return this.info.kind;
  }

  get source(): TrackSource {
    return this.info.source;
  }

  get simulcasted(): boolean {
    return this.info.simulcasted;
  }

  get width(): number {
    return this.info.width;
  }

  get height(): number {
    return this.info.height;
  }

  get mimeType(): string {
    return this.info.mimeType;
  }

  get muted(): boolean {
    return this.info.muted;
  }

  get encryptionType(): EncryptionType {
    return this.info.encryptionType;
  }
}

export class LocalTrackPublication extends TrackPublication {
  constructor(ownedInfo: OwnedTrackPublication) {
    super(ownedInfo);
  }
}

export class RemoteTrackPublication extends TrackPublication {
  subscribed: boolean = false;

  constructor(ownedInfo: OwnedTrackPublication) {
    super(ownedInfo);
  }

  setSubscribed(subscribed: boolean) {
    let req = new SetSubscribedRequest({
      subscribe: subscribed,
      publicationHandle: this.ffiHandle.handle,
    });

    FfiClient.instance.request<SetSubscribedResponse>({
      message: { case: 'setSubscribed', value: req },
    });
  }
}
