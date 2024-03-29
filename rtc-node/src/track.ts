// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import { AudioSource } from './audio_source.js';
import { FfiClient, FfiHandle, FfiRequest } from './ffi_client.js';
import {
  CreateAudioTrackRequest,
  CreateAudioTrackResponse,
  CreateVideoTrackRequest,
  CreateVideoTrackResponse,
  OwnedTrack,
  StreamState,
  TrackInfo,
  TrackKind,
} from './proto/track_pb.js';
import { VideoSource } from './video_source.js';

export abstract class Track {
  /** @internal */
  info: TrackInfo;

  /** @internal */
  ffi_handle: FfiHandle;

  constructor(owned: OwnedTrack) {
    this.info = owned.info;
    this.ffi_handle = new FfiHandle(owned.handle.id);
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

  get stream_state(): StreamState {
    return this.info.streamState;
  }

  get muted(): boolean {
    return this.info.muted;
  }
}

export class LocalAudioTrack extends Track {
  constructor(owned: OwnedTrack) {
    super(owned);
  }

  static createAudioTrack(name: string, source: AudioSource): LocalAudioTrack {
    let req = new CreateAudioTrackRequest({
      name: name,
      sourceHandle: source.ffiHandle.handle,
    });

    let res = FfiClient.instance.request<CreateAudioTrackResponse>({
      message: { case: 'createAudioTrack', value: req },
    });

    return new LocalAudioTrack(res.track);
  }
}

export class LocalVideoTrack extends Track {
  constructor(owned: OwnedTrack) {
    super(owned);
  }

  static createVideoTrack(name: string, source: VideoSource): LocalVideoTrack {
    let req = new CreateVideoTrackRequest({
      name: name,
      sourceHandle: source.ffiHandle.handle,
    });

    let res = FfiClient.instance.request<CreateVideoTrackResponse>({
      message: { case: 'createVideoTrack', value: req },
    });

    return new LocalVideoTrack(res.track);
  }
}

export class RemoteVideoTrack extends Track {
  constructor(owned: OwnedTrack) {
    super(owned);
  }
}

export class RemoteAudioTrack extends Track {
  constructor(owned: OwnedTrack) {
    super(owned);
  }
}

export type LocalTrack = LocalVideoTrack | LocalAudioTrack;
export type RemoteTrack = RemoteVideoTrack | RemoteAudioTrack;
export type AudioTrack = LocalAudioTrack | RemoteAudioTrack;
export type VideoTrack = LocalVideoTrack | RemoteVideoTrack;
