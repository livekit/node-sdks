// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { FfiClient } from './ffi_client.js';
import { FfiHandle } from './napi/native.js';
import type { EncryptionType } from './proto/e2ee_pb.js';
import type { SetSubscribedResponse } from './proto/room_pb.js';
import { SetSubscribedRequest } from './proto/room_pb.js';
import type {
  OwnedTrackPublication,
  TrackKind,
  TrackPublicationInfo,
  TrackSource,
} from './proto/track_pb.js';
import type { Track } from './track.js';

export abstract class TrackPublication {
  /** @internal */
  ffiHandle: FfiHandle;

  /** @internal */
  info?: TrackPublicationInfo;
  track?: Track;

  constructor(ownedInfo: OwnedTrackPublication) {
    this.info = ownedInfo.info;
    this.ffiHandle = new FfiHandle(ownedInfo.handle!.id!);
  }

  get sid(): string | undefined {
    return this.info?.sid;
  }

  get name(): string | undefined {
    return this.info?.name;
  }

  get kind(): TrackKind | undefined {
    return this.info?.kind;
  }

  get source(): TrackSource | undefined {
    return this.info?.source;
  }

  get simulcasted(): boolean | undefined {
    return this.info?.simulcasted;
  }

  get width(): number | undefined {
    return this.info?.width;
  }

  get height(): number | undefined {
    return this.info?.height;
  }

  get mimeType(): string | undefined {
    return this.info?.mimeType;
  }

  get muted(): boolean | undefined {
    return this.info?.muted;
  }

  get encryptionType(): EncryptionType | undefined {
    return this.info?.encryptionType;
  }
}

export class LocalTrackPublication extends TrackPublication {
  private firstSubscription: Promise<void>;
  private firstSubscriptionResolver: (() => void) | null = null;

  constructor(ownedInfo: OwnedTrackPublication) {
    super(ownedInfo);
    this.firstSubscription = new Promise<void>((resolve) => {
      this.firstSubscriptionResolver = resolve;
    });
  }

  async waitForSubscription(): Promise<void> {
    await this.firstSubscription;
  }

  /** @internal */
  resolveFirstSubscription(): void {
    if (this.firstSubscriptionResolver) {
      this.firstSubscriptionResolver();
      this.firstSubscriptionResolver = null;
    }
  }
}

export class RemoteTrackPublication extends TrackPublication {
  subscribed: boolean = false;

  constructor(ownedInfo: OwnedTrackPublication) {
    super(ownedInfo);
  }

  setSubscribed(subscribed: boolean) {
    const req = new SetSubscribedRequest({
      subscribe: subscribed,
      publicationHandle: this.ffiHandle.handle,
    });

    FfiClient.instance.request<SetSubscribedResponse>({
      message: { case: 'setSubscribed', value: req },
    });
  }
}
