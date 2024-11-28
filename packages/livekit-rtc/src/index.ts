// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { MessageInitShape } from '@bufbuild/protobuf';
import { create } from '@bufbuild/protobuf';
import type { AudioEncoding, TrackPublishOptionsSchema, VideoEncoding } from './proto/room_pb.js';
import {
  AudioEncodingSchema,
  IceServerSchema,
  type IceServer as IceServerType,
  type TrackPublishOptions as TrackPublishOptionsType,
  VideoEncodingSchema,
} from './proto/room_pb.js';
import { TrackSource } from './proto/track_pb.js';
import { VideoCodec } from './proto/video_frame_pb.js';

export { Room, RoomEvent, ConnectError, type RoomOptions, type RtcConfiguration } from './room.js';
export { Participant, RemoteParticipant, LocalParticipant } from './participant.js';
export {
  Track,
  type LocalTrack,
  type RemoteTrack,
  type VideoTrack,
  LocalAudioTrack,
  LocalVideoTrack,
  RemoteAudioTrack,
  RemoteVideoTrack,
  type AudioTrack,
} from './track.js';
export { VideoFrame } from './video_frame.js';
export { AudioFrame, combineAudioFrames } from './audio_frame.js';
export { AudioStream } from './audio_stream.js';
export { AudioResampler, AudioResamplerQuality } from './audio_resampler.js';
export { VideoStream, type VideoFrameEvent } from './video_stream.js';
export { AudioSource } from './audio_source.js';
export { VideoSource } from './video_source.js';
export {
  TrackPublication,
  RemoteTrackPublication,
  LocalTrackPublication,
} from './track_publication.js';
export { type Transcription, type TranscriptionSegment } from './transcription.js';
export {
  E2EEManager,
  type E2EEOptions,
  type KeyProviderOptions,
  KeyProvider,
  FrameCryptor,
} from './e2ee.js';

export {
  ConnectionQuality,
  IceTransportType,
  DataPacketKind,
  ContinualGatheringPolicy,
  ConnectionState,
} from './proto/room_pb.js';
export { RpcError, type RpcInvocationData, type PerformRpcParams } from './rpc.js';
export { EncryptionType, EncryptionState } from './proto/e2ee_pb.js';
export { StreamState, TrackKind, TrackSource } from './proto/track_pb.js';
export { VideoBufferType, VideoRotation, VideoCodec } from './proto/video_frame_pb.js';
export { ParticipantKind } from './proto/participant_pb.js';
export { dispose } from './ffi_client.js';
export type { ChatMessage } from './types.js';

// exposing helpers for API compatibility with 1.x version of protobuf-es where these were class instances

type IceServerInit = MessageInitShape<typeof IceServerSchema> & {
  urls: string[];
};
export class IceServer implements IceServerType {
  $typeName = 'livekit.proto.IceServer' as const;
  urls: string[];
  username: string;
  password: string;
  constructor(init: IceServerInit) {
    const { urls, username, password } = init;
    this.urls = urls;
    this.username = username ?? '';
    this.password = password ?? '';
    create(IceServerSchema, init);
  }
}

export class TrackPublishOptions implements TrackPublishOptionsType {
  $typeName = 'livekit.proto.TrackPublishOptions' as const;
  videoCodec: VideoCodec;
  videoEncoding?: VideoEncoding | undefined;
  audioEncoding?: AudioEncoding | undefined;
  dtx: boolean;
  simulcast: boolean;
  source: TrackSource;
  stream: string;
  red: boolean;

  constructor(init: MessageInitShape<typeof TrackPublishOptionsSchema> = {}) {
    const { videoCodec, videoEncoding, audioEncoding, dtx, simulcast, source, stream, red } = init;
    this.videoCodec = videoCodec ?? VideoCodec.VP8;
    if (videoEncoding) {
      this.videoEncoding = create(VideoEncodingSchema, videoEncoding);
    }
    if (audioEncoding) {
      this.audioEncoding = create(AudioEncodingSchema, audioEncoding);
    }
    this.dtx = dtx ?? false;
    this.simulcast = simulcast ?? false;
    this.source = source ?? TrackSource.SOURCE_UNKNOWN;
    this.stream = stream ?? '';
    this.red = red ?? false;
  }
}
