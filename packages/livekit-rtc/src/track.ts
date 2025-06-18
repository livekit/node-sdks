// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { AudioSource } from './audio_source.js';
import { FfiClient, FfiHandle } from './ffi_client.js';
import type {
  CreateAudioTrackResponse,
  CreateVideoTrackResponse,
  OwnedTrack,
  StreamState,
  TrackInfo,
  TrackKind,
} from './proto/track_pb.js';
import { CreateAudioTrackRequest, CreateVideoTrackRequest } from './proto/track_pb.js';
import type { VideoSource } from './video_source.js';

export abstract class Track {
  /** @internal */
  info?: TrackInfo;

  /** @internal */
  ffi_handle: FfiHandle;

  constructor(owned: OwnedTrack) {
    this.info = owned.info;
    this.ffi_handle = new FfiHandle(owned.handle!.id!);
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

  get stream_state(): StreamState | undefined {
    return this.info?.streamState;
  }

  get muted(): boolean | undefined {
    return this.info?.muted;
  }

  async close() {
    this.ffi_handle.dispose();
  }
}

export class LocalAudioTrack extends Track {
  private source?: AudioSource;

  constructor(owned: OwnedTrack, source?: AudioSource) {
    super(owned);
    this.source = source;
  }

  static createAudioTrack(name: string, source: AudioSource): LocalAudioTrack {
    const req = new CreateAudioTrackRequest({
      name: name,
      sourceHandle: source.ffiHandle.handle,
    });

    const res = FfiClient.instance.request<CreateAudioTrackResponse>({
      message: { case: 'createAudioTrack', value: req },
    });

    return new LocalAudioTrack(res.track!, source);
  }

  async close(closeSource = true) {
    await super.close();
    if (closeSource) {
      await this.source?.close();
    }
  }
}

export class LocalVideoTrack extends Track {
  private source?: VideoSource;

  constructor(owned: OwnedTrack, source?: VideoSource) {
    super(owned);
    this.source = source;
  }

  static createVideoTrack(name: string, source: VideoSource): LocalVideoTrack {
    const req = new CreateVideoTrackRequest({
      name: name,
      sourceHandle: source.ffiHandle.handle,
    });

    const res = FfiClient.instance.request<CreateVideoTrackResponse>({
      message: { case: 'createVideoTrack', value: req },
    });

    return new LocalVideoTrack(res.track!, source);
  }

  async close(closeSource = true) {
    await super.close();
    if (closeSource) {
      await this.source?.close();
    }
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
