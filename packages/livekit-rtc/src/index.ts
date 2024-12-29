// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

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
export type { Transcription, TranscriptionSegment } from './transcription.js';
export { E2EEManager, KeyProvider, FrameCryptor } from './e2ee.js';
export type { E2EEOptions, KeyProviderOptions } from './e2ee.js';
export {
  ConnectionQuality,
  IceServer,
  IceTransportType,
  DataPacketKind,
  ContinualGatheringPolicy,
  TrackPublishOptions,
  ConnectionState,
} from './proto/room_pb.js';
export { RpcError, type RpcInvocationData, type PerformRpcParams } from './rpc.js';
export { EncryptionType, EncryptionState } from './proto/e2ee_pb.js';
export { StreamState, TrackKind, TrackSource } from './proto/track_pb.js';
export { VideoBufferType, VideoRotation, VideoCodec } from './proto/video_frame_pb.js';
export { ParticipantKind } from './proto/participant_pb.js';
export { dispose } from './ffi_client.js';
export type { ChatMessage } from './types.js';
