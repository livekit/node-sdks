// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type {
  CreateAudioTrackResponse,
  CreateVideoTrackResponse,
  OwnedTrack,
  StreamState,
  TrackInfo,
  TrackKind,
} from '@livekit/rtc-ffi-bindings';
import { CreateAudioTrackRequest, CreateVideoTrackRequest } from '@livekit/rtc-ffi-bindings';
import type { AudioSource } from './audio_source.js';
import type { AudioStreamSource } from './audio_stream.js';
import { FfiClient, FfiHandle } from './ffi_client.js';
import type { Room } from './room.js';
import type { VideoSource } from './video_source.js';

export abstract class Track {
  /** @internal */
  info?: TrackInfo;

  /** @internal */
  ffi_handle: FfiHandle;

  private roomRef: WeakRef<Room> | null = null;
  private audioStreams: Set<WeakRef<AudioStreamSource>> = new Set();
  private streamFinalizationRegistry: FinalizationRegistry<WeakRef<AudioStreamSource>>;
  private onRoomTokenRefreshed = () => {
    const room = this.resolveRoom();
    if (!room || !room.token || !room.serverUrl) return;
    for (const stream of this.iterateStreams()) {
      const processor = stream.processor;
      if (!processor) {
        continue;
      }
      processor.onCredentialsUpdated({ token: room.token, url: room.serverUrl });
    }
  };

  constructor(owned: OwnedTrack) {
    this.info = owned.info;
    this.ffi_handle = new FfiHandle(owned.handle!.id!);
    this.streamFinalizationRegistry = new FinalizationRegistry<WeakRef<AudioStreamSource>>(
      (ref) => {
        this.audioStreams.delete(ref);
      },
    );
  }

  /** @internal */
  resolveRoom(): Room | null {
    return this.roomRef?.deref() ?? null;
  }

  /** @internal */
  setRoom(room: Room | null): void {
    const oldRoom = this.resolveRoom();
    if (oldRoom !== room) {
      if (oldRoom) {
        oldRoom.off('tokenRefreshed', this.onRoomTokenRefreshed);
      }
      if (room) {
        room.on('tokenRefreshed', this.onRoomTokenRefreshed);
      }
    }
    this.roomRef = room ? new WeakRef(room) : null;
    for (const stream of this.iterateStreams()) {
      this.pushProcessorMetadataToStream(stream, room);
    }
  }

  /** @internal */
  registerAudioStream(stream: AudioStreamSource): void {
    const ref = new WeakRef(stream);
    this.audioStreams.add(ref);
    this.streamFinalizationRegistry.register(stream, ref);
    const room = this.resolveRoom();
    if (room) {
      this.pushProcessorMetadataToStream(stream, room);
    }
  }

  /** @internal */
  unregisterAudioStream(stream: AudioStreamSource): void {
    for (const ref of this.audioStreams) {
      if (ref.deref() === stream) {
        this.audioStreams.delete(ref);
        return;
      }
    }
  }

  private *iterateStreams(): Generator<AudioStreamSource> {
    const dead: Array<WeakRef<AudioStreamSource>> = [];
    for (const ref of this.audioStreams) {
      const stream = ref.deref();
      if (stream) {
        yield stream;
      } else {
        dead.push(ref);
      }
    }
    for (const ref of dead) {
      this.audioStreams.delete(ref);
    }
  }

  private pushProcessorMetadataToStream(stream: AudioStreamSource, room: Room | null): void {
    const processor = stream.processor;
    if (!processor) {
      return;
    }

    if (!room) {
      // Guard with optional-call: plugins built against an older @livekit/rtc-node
      // inherit a FrameProcessor base class that doesn't define these methods,
      // so they could be undefined on the prototype chain.
      processor.onStreamInfoCleared?.();
      processor.onCredentialsCleared?.();
      return;
    }

    let identity = '';
    let publicationSid = '';
    const trackSid = this.sid;
    if (trackSid) {
      let found = false;
      for (const participant of room.remoteParticipants.values()) {
        const publication = participant.trackPublications.get(trackSid);
        if (publication) {
          identity = participant.identity;
          publicationSid = publication.sid ?? '';
          found = true;
          break;
        }
      }
      if (!found) {
        const local = room.localParticipant;
        if (local) {
          for (const publication of local.trackPublications.values()) {
            if (publication.sid === trackSid) {
              identity = local.identity;
              publicationSid = publication.sid ?? '';
              break;
            }
          }
        }
      }
    }

    processor.onStreamInfoUpdated({
      roomName: room.name ?? '',
      participantIdentity: identity,
      publicationSid,
    });
    if (room.token && room.serverUrl) {
      processor.onCredentialsUpdated({ token: room.token, url: room.serverUrl });
    }
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
