/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Timestamp } from "./google/protobuf/timestamp";

export const protobufPackage = "livekit";

export enum AudioCodec {
  DEFAULT_AC = 0,
  OPUS = 1,
  AAC = 2,
  UNRECOGNIZED = -1,
}

export function audioCodecFromJSON(object: any): AudioCodec {
  switch (object) {
    case 0:
    case "DEFAULT_AC":
      return AudioCodec.DEFAULT_AC;
    case 1:
    case "OPUS":
      return AudioCodec.OPUS;
    case 2:
    case "AAC":
      return AudioCodec.AAC;
    case -1:
    case "UNRECOGNIZED":
    default:
      return AudioCodec.UNRECOGNIZED;
  }
}

export function audioCodecToJSON(object: AudioCodec): string {
  switch (object) {
    case AudioCodec.DEFAULT_AC:
      return "DEFAULT_AC";
    case AudioCodec.OPUS:
      return "OPUS";
    case AudioCodec.AAC:
      return "AAC";
    case AudioCodec.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum VideoCodec {
  DEFAULT_VC = 0,
  H264_BASELINE = 1,
  H264_MAIN = 2,
  H264_HIGH = 3,
  VP8 = 4,
  UNRECOGNIZED = -1,
}

export function videoCodecFromJSON(object: any): VideoCodec {
  switch (object) {
    case 0:
    case "DEFAULT_VC":
      return VideoCodec.DEFAULT_VC;
    case 1:
    case "H264_BASELINE":
      return VideoCodec.H264_BASELINE;
    case 2:
    case "H264_MAIN":
      return VideoCodec.H264_MAIN;
    case 3:
    case "H264_HIGH":
      return VideoCodec.H264_HIGH;
    case 4:
    case "VP8":
      return VideoCodec.VP8;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VideoCodec.UNRECOGNIZED;
  }
}

export function videoCodecToJSON(object: VideoCodec): string {
  switch (object) {
    case VideoCodec.DEFAULT_VC:
      return "DEFAULT_VC";
    case VideoCodec.H264_BASELINE:
      return "H264_BASELINE";
    case VideoCodec.H264_MAIN:
      return "H264_MAIN";
    case VideoCodec.H264_HIGH:
      return "H264_HIGH";
    case VideoCodec.VP8:
      return "VP8";
    case VideoCodec.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum ImageCodec {
  IC_DEFAULT = 0,
  IC_JPEG = 1,
  UNRECOGNIZED = -1,
}

export function imageCodecFromJSON(object: any): ImageCodec {
  switch (object) {
    case 0:
    case "IC_DEFAULT":
      return ImageCodec.IC_DEFAULT;
    case 1:
    case "IC_JPEG":
      return ImageCodec.IC_JPEG;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ImageCodec.UNRECOGNIZED;
  }
}

export function imageCodecToJSON(object: ImageCodec): string {
  switch (object) {
    case ImageCodec.IC_DEFAULT:
      return "IC_DEFAULT";
    case ImageCodec.IC_JPEG:
      return "IC_JPEG";
    case ImageCodec.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum TrackType {
  AUDIO = 0,
  VIDEO = 1,
  DATA = 2,
  UNRECOGNIZED = -1,
}

export function trackTypeFromJSON(object: any): TrackType {
  switch (object) {
    case 0:
    case "AUDIO":
      return TrackType.AUDIO;
    case 1:
    case "VIDEO":
      return TrackType.VIDEO;
    case 2:
    case "DATA":
      return TrackType.DATA;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TrackType.UNRECOGNIZED;
  }
}

export function trackTypeToJSON(object: TrackType): string {
  switch (object) {
    case TrackType.AUDIO:
      return "AUDIO";
    case TrackType.VIDEO:
      return "VIDEO";
    case TrackType.DATA:
      return "DATA";
    case TrackType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum TrackSource {
  UNKNOWN = 0,
  CAMERA = 1,
  MICROPHONE = 2,
  SCREEN_SHARE = 3,
  SCREEN_SHARE_AUDIO = 4,
  UNRECOGNIZED = -1,
}

export function trackSourceFromJSON(object: any): TrackSource {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return TrackSource.UNKNOWN;
    case 1:
    case "CAMERA":
      return TrackSource.CAMERA;
    case 2:
    case "MICROPHONE":
      return TrackSource.MICROPHONE;
    case 3:
    case "SCREEN_SHARE":
      return TrackSource.SCREEN_SHARE;
    case 4:
    case "SCREEN_SHARE_AUDIO":
      return TrackSource.SCREEN_SHARE_AUDIO;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TrackSource.UNRECOGNIZED;
  }
}

export function trackSourceToJSON(object: TrackSource): string {
  switch (object) {
    case TrackSource.UNKNOWN:
      return "UNKNOWN";
    case TrackSource.CAMERA:
      return "CAMERA";
    case TrackSource.MICROPHONE:
      return "MICROPHONE";
    case TrackSource.SCREEN_SHARE:
      return "SCREEN_SHARE";
    case TrackSource.SCREEN_SHARE_AUDIO:
      return "SCREEN_SHARE_AUDIO";
    case TrackSource.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum VideoQuality {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  OFF = 3,
  UNRECOGNIZED = -1,
}

export function videoQualityFromJSON(object: any): VideoQuality {
  switch (object) {
    case 0:
    case "LOW":
      return VideoQuality.LOW;
    case 1:
    case "MEDIUM":
      return VideoQuality.MEDIUM;
    case 2:
    case "HIGH":
      return VideoQuality.HIGH;
    case 3:
    case "OFF":
      return VideoQuality.OFF;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VideoQuality.UNRECOGNIZED;
  }
}

export function videoQualityToJSON(object: VideoQuality): string {
  switch (object) {
    case VideoQuality.LOW:
      return "LOW";
    case VideoQuality.MEDIUM:
      return "MEDIUM";
    case VideoQuality.HIGH:
      return "HIGH";
    case VideoQuality.OFF:
      return "OFF";
    case VideoQuality.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum ConnectionQuality {
  POOR = 0,
  GOOD = 1,
  EXCELLENT = 2,
  UNRECOGNIZED = -1,
}

export function connectionQualityFromJSON(object: any): ConnectionQuality {
  switch (object) {
    case 0:
    case "POOR":
      return ConnectionQuality.POOR;
    case 1:
    case "GOOD":
      return ConnectionQuality.GOOD;
    case 2:
    case "EXCELLENT":
      return ConnectionQuality.EXCELLENT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ConnectionQuality.UNRECOGNIZED;
  }
}

export function connectionQualityToJSON(object: ConnectionQuality): string {
  switch (object) {
    case ConnectionQuality.POOR:
      return "POOR";
    case ConnectionQuality.GOOD:
      return "GOOD";
    case ConnectionQuality.EXCELLENT:
      return "EXCELLENT";
    case ConnectionQuality.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum ClientConfigSetting {
  UNSET = 0,
  DISABLED = 1,
  ENABLED = 2,
  UNRECOGNIZED = -1,
}

export function clientConfigSettingFromJSON(object: any): ClientConfigSetting {
  switch (object) {
    case 0:
    case "UNSET":
      return ClientConfigSetting.UNSET;
    case 1:
    case "DISABLED":
      return ClientConfigSetting.DISABLED;
    case 2:
    case "ENABLED":
      return ClientConfigSetting.ENABLED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ClientConfigSetting.UNRECOGNIZED;
  }
}

export function clientConfigSettingToJSON(object: ClientConfigSetting): string {
  switch (object) {
    case ClientConfigSetting.UNSET:
      return "UNSET";
    case ClientConfigSetting.DISABLED:
      return "DISABLED";
    case ClientConfigSetting.ENABLED:
      return "ENABLED";
    case ClientConfigSetting.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum DisconnectReason {
  UNKNOWN_REASON = 0,
  CLIENT_INITIATED = 1,
  DUPLICATE_IDENTITY = 2,
  SERVER_SHUTDOWN = 3,
  PARTICIPANT_REMOVED = 4,
  ROOM_DELETED = 5,
  STATE_MISMATCH = 6,
  JOIN_FAILURE = 7,
  UNRECOGNIZED = -1,
}

export function disconnectReasonFromJSON(object: any): DisconnectReason {
  switch (object) {
    case 0:
    case "UNKNOWN_REASON":
      return DisconnectReason.UNKNOWN_REASON;
    case 1:
    case "CLIENT_INITIATED":
      return DisconnectReason.CLIENT_INITIATED;
    case 2:
    case "DUPLICATE_IDENTITY":
      return DisconnectReason.DUPLICATE_IDENTITY;
    case 3:
    case "SERVER_SHUTDOWN":
      return DisconnectReason.SERVER_SHUTDOWN;
    case 4:
    case "PARTICIPANT_REMOVED":
      return DisconnectReason.PARTICIPANT_REMOVED;
    case 5:
    case "ROOM_DELETED":
      return DisconnectReason.ROOM_DELETED;
    case 6:
    case "STATE_MISMATCH":
      return DisconnectReason.STATE_MISMATCH;
    case 7:
    case "JOIN_FAILURE":
      return DisconnectReason.JOIN_FAILURE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DisconnectReason.UNRECOGNIZED;
  }
}

export function disconnectReasonToJSON(object: DisconnectReason): string {
  switch (object) {
    case DisconnectReason.UNKNOWN_REASON:
      return "UNKNOWN_REASON";
    case DisconnectReason.CLIENT_INITIATED:
      return "CLIENT_INITIATED";
    case DisconnectReason.DUPLICATE_IDENTITY:
      return "DUPLICATE_IDENTITY";
    case DisconnectReason.SERVER_SHUTDOWN:
      return "SERVER_SHUTDOWN";
    case DisconnectReason.PARTICIPANT_REMOVED:
      return "PARTICIPANT_REMOVED";
    case DisconnectReason.ROOM_DELETED:
      return "ROOM_DELETED";
    case DisconnectReason.STATE_MISMATCH:
      return "STATE_MISMATCH";
    case DisconnectReason.JOIN_FAILURE:
      return "JOIN_FAILURE";
    case DisconnectReason.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum ReconnectReason {
  RR_UNKNOWN = 0,
  RR_SIGNAL_DISCONNECTED = 1,
  RR_PUBLISHER_FAILED = 2,
  RR_SUBSCRIBER_FAILED = 3,
  RR_SWITCH_CANDIDATE = 4,
  UNRECOGNIZED = -1,
}

export function reconnectReasonFromJSON(object: any): ReconnectReason {
  switch (object) {
    case 0:
    case "RR_UNKNOWN":
      return ReconnectReason.RR_UNKNOWN;
    case 1:
    case "RR_SIGNAL_DISCONNECTED":
      return ReconnectReason.RR_SIGNAL_DISCONNECTED;
    case 2:
    case "RR_PUBLISHER_FAILED":
      return ReconnectReason.RR_PUBLISHER_FAILED;
    case 3:
    case "RR_SUBSCRIBER_FAILED":
      return ReconnectReason.RR_SUBSCRIBER_FAILED;
    case 4:
    case "RR_SWITCH_CANDIDATE":
      return ReconnectReason.RR_SWITCH_CANDIDATE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ReconnectReason.UNRECOGNIZED;
  }
}

export function reconnectReasonToJSON(object: ReconnectReason): string {
  switch (object) {
    case ReconnectReason.RR_UNKNOWN:
      return "RR_UNKNOWN";
    case ReconnectReason.RR_SIGNAL_DISCONNECTED:
      return "RR_SIGNAL_DISCONNECTED";
    case ReconnectReason.RR_PUBLISHER_FAILED:
      return "RR_PUBLISHER_FAILED";
    case ReconnectReason.RR_SUBSCRIBER_FAILED:
      return "RR_SUBSCRIBER_FAILED";
    case ReconnectReason.RR_SWITCH_CANDIDATE:
      return "RR_SWITCH_CANDIDATE";
    case ReconnectReason.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum SubscriptionError {
  SE_UNKNOWN = 0,
  SE_CODEC_UNSUPPORTED = 1,
  SE_TRACK_NOTFOUND = 2,
  UNRECOGNIZED = -1,
}

export function subscriptionErrorFromJSON(object: any): SubscriptionError {
  switch (object) {
    case 0:
    case "SE_UNKNOWN":
      return SubscriptionError.SE_UNKNOWN;
    case 1:
    case "SE_CODEC_UNSUPPORTED":
      return SubscriptionError.SE_CODEC_UNSUPPORTED;
    case 2:
    case "SE_TRACK_NOTFOUND":
      return SubscriptionError.SE_TRACK_NOTFOUND;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SubscriptionError.UNRECOGNIZED;
  }
}

export function subscriptionErrorToJSON(object: SubscriptionError): string {
  switch (object) {
    case SubscriptionError.SE_UNKNOWN:
      return "SE_UNKNOWN";
    case SubscriptionError.SE_CODEC_UNSUPPORTED:
      return "SE_CODEC_UNSUPPORTED";
    case SubscriptionError.SE_TRACK_NOTFOUND:
      return "SE_TRACK_NOTFOUND";
    case SubscriptionError.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Room {
  sid: string;
  name: string;
  emptyTimeout: number;
  maxParticipants: number;
  creationTime: number;
  turnPassword: string;
  enabledCodecs: Codec[];
  metadata: string;
  numParticipants: number;
  numPublishers: number;
  activeRecording: boolean;
}

export interface Codec {
  mime: string;
  fmtpLine: string;
}

export interface PlayoutDelay {
  enabled: boolean;
  min: number;
  max: number;
}

export interface ParticipantPermission {
  /** allow participant to subscribe to other tracks in the room */
  canSubscribe: boolean;
  /** allow participant to publish new tracks to room */
  canPublish: boolean;
  /** allow participant to publish data */
  canPublishData: boolean;
  /** sources that are allowed to be published */
  canPublishSources: TrackSource[];
  /** indicates that it's hidden to others */
  hidden: boolean;
  /** indicates it's a recorder instance */
  recorder: boolean;
  /** indicates that participant can update own metadata */
  canUpdateMetadata: boolean;
}

export interface ParticipantInfo {
  sid: string;
  identity: string;
  state: ParticipantInfo_State;
  tracks: TrackInfo[];
  metadata: string;
  /** timestamp when participant joined room, in seconds */
  joinedAt: number;
  name: string;
  version: number;
  permission?: ParticipantPermission | undefined;
  region: string;
  /**
   * indicates the participant has an active publisher connection
   * and can publish to the server
   */
  isPublisher: boolean;
}

export enum ParticipantInfo_State {
  /** JOINING - websocket' connected, but not offered yet */
  JOINING = 0,
  /** JOINED - server received client offer */
  JOINED = 1,
  /** ACTIVE - ICE connectivity established */
  ACTIVE = 2,
  /** DISCONNECTED - WS disconnected */
  DISCONNECTED = 3,
  UNRECOGNIZED = -1,
}

export function participantInfo_StateFromJSON(object: any): ParticipantInfo_State {
  switch (object) {
    case 0:
    case "JOINING":
      return ParticipantInfo_State.JOINING;
    case 1:
    case "JOINED":
      return ParticipantInfo_State.JOINED;
    case 2:
    case "ACTIVE":
      return ParticipantInfo_State.ACTIVE;
    case 3:
    case "DISCONNECTED":
      return ParticipantInfo_State.DISCONNECTED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ParticipantInfo_State.UNRECOGNIZED;
  }
}

export function participantInfo_StateToJSON(object: ParticipantInfo_State): string {
  switch (object) {
    case ParticipantInfo_State.JOINING:
      return "JOINING";
    case ParticipantInfo_State.JOINED:
      return "JOINED";
    case ParticipantInfo_State.ACTIVE:
      return "ACTIVE";
    case ParticipantInfo_State.DISCONNECTED:
      return "DISCONNECTED";
    case ParticipantInfo_State.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Encryption {
}

export enum Encryption_Type {
  NONE = 0,
  GCM = 1,
  CUSTOM = 2,
  UNRECOGNIZED = -1,
}

export function encryption_TypeFromJSON(object: any): Encryption_Type {
  switch (object) {
    case 0:
    case "NONE":
      return Encryption_Type.NONE;
    case 1:
    case "GCM":
      return Encryption_Type.GCM;
    case 2:
    case "CUSTOM":
      return Encryption_Type.CUSTOM;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Encryption_Type.UNRECOGNIZED;
  }
}

export function encryption_TypeToJSON(object: Encryption_Type): string {
  switch (object) {
    case Encryption_Type.NONE:
      return "NONE";
    case Encryption_Type.GCM:
      return "GCM";
    case Encryption_Type.CUSTOM:
      return "CUSTOM";
    case Encryption_Type.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface SimulcastCodecInfo {
  mimeType: string;
  mid: string;
  cid: string;
  layers: VideoLayer[];
}

export interface TrackInfo {
  sid: string;
  type: TrackType;
  name: string;
  muted: boolean;
  /**
   * original width of video (unset for audio)
   * clients may receive a lower resolution version with simulcast
   */
  width: number;
  /** original height of video (unset for audio) */
  height: number;
  /** true if track is simulcasted */
  simulcast: boolean;
  /** true if DTX (Discontinuous Transmission) is disabled for audio */
  disableDtx: boolean;
  /** source of media */
  source: TrackSource;
  layers: VideoLayer[];
  /** mime type of codec */
  mimeType: string;
  mid: string;
  codecs: SimulcastCodecInfo[];
  stereo: boolean;
  /** true if RED (Redundant Encoding) is disabled for audio */
  disableRed: boolean;
  encryption: Encryption_Type;
  stream: string;
}

/** provide information about available spatial layers */
export interface VideoLayer {
  /** for tracks with a single layer, this should be HIGH */
  quality: VideoQuality;
  width: number;
  height: number;
  /** target bitrate in bit per second (bps), server will measure actual */
  bitrate: number;
  ssrc: number;
}

/** new DataPacket API */
export interface DataPacket {
  kind: DataPacket_Kind;
  user?: UserPacket | undefined;
  speaker?: ActiveSpeakerUpdate | undefined;
  persistableUser?: PersistableUserPacket | undefined;
}

export enum DataPacket_Kind {
  RELIABLE = 0,
  LOSSY = 1,
  UNRECOGNIZED = -1,
}

export function dataPacket_KindFromJSON(object: any): DataPacket_Kind {
  switch (object) {
    case 0:
    case "RELIABLE":
      return DataPacket_Kind.RELIABLE;
    case 1:
    case "LOSSY":
      return DataPacket_Kind.LOSSY;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DataPacket_Kind.UNRECOGNIZED;
  }
}

export function dataPacket_KindToJSON(object: DataPacket_Kind): string {
  switch (object) {
    case DataPacket_Kind.RELIABLE:
      return "RELIABLE";
    case DataPacket_Kind.LOSSY:
      return "LOSSY";
    case DataPacket_Kind.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ActiveSpeakerUpdate {
  speakers: SpeakerInfo[];
}

export interface SpeakerInfo {
  sid: string;
  /** audio level, 0-1.0, 1 is loudest */
  level: number;
  /** true if speaker is currently active */
  active: boolean;
}

export interface UserPacket {
  /** participant ID of user that sent the message */
  participantSid: string;
  participantIdentity: string;
  /** user defined payload */
  payload: Uint8Array;
  /** the ID of the participants who will receive the message (sent to all by default) */
  destinationSids: string[];
  /** identities of participants who will receive the message (sent to all by default) */
  destinationIdentities: string[];
  /** topic under which the message was published */
  topic?: string | undefined;
}

export interface PersistableUserPacket {
  /** participant ID of user that sent the message */
  participantSid: string;
  participantIdentity: string;
  participantName: string;
  /** user defined payload */
  payload: Uint8Array;
  /** the ID of the participants who will receive the message (sent to all by default) */
  destinationSids: string[];
  /** identities of participants who will receive the message (sent to all by default) */
  destinationIdentities: string[];
  /** topic under which the message was published */
  topic?: string | undefined;
  timestamp: number;
}

export interface PersistableUserData {
  packets: PersistableUserPacket[];
}

export interface ParticipantTracks {
  /** participant ID of participant to whom the tracks belong */
  participantSid: string;
  trackSids: string[];
}

/** details about the server */
export interface ServerInfo {
  edition: ServerInfo_Edition;
  version: string;
  protocol: number;
  region: string;
  nodeId: string;
  /** additional debugging information. sent only if server is in development mode */
  debugInfo: string;
}

export enum ServerInfo_Edition {
  Standard = 0,
  Cloud = 1,
  UNRECOGNIZED = -1,
}

export function serverInfo_EditionFromJSON(object: any): ServerInfo_Edition {
  switch (object) {
    case 0:
    case "Standard":
      return ServerInfo_Edition.Standard;
    case 1:
    case "Cloud":
      return ServerInfo_Edition.Cloud;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ServerInfo_Edition.UNRECOGNIZED;
  }
}

export function serverInfo_EditionToJSON(object: ServerInfo_Edition): string {
  switch (object) {
    case ServerInfo_Edition.Standard:
      return "Standard";
    case ServerInfo_Edition.Cloud:
      return "Cloud";
    case ServerInfo_Edition.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** details about the client */
export interface ClientInfo {
  sdk: ClientInfo_SDK;
  version: string;
  protocol: number;
  os: string;
  osVersion: string;
  deviceModel: string;
  browser: string;
  browserVersion: string;
  address: string;
  /** wifi, wired, cellular, vpn, empty if not known */
  network: string;
}

export enum ClientInfo_SDK {
  UNKNOWN = 0,
  JS = 1,
  SWIFT = 2,
  ANDROID = 3,
  FLUTTER = 4,
  GO = 5,
  UNITY = 6,
  REACT_NATIVE = 7,
  RUST = 8,
  PYTHON = 9,
  CPP = 10,
  UNRECOGNIZED = -1,
}

export function clientInfo_SDKFromJSON(object: any): ClientInfo_SDK {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return ClientInfo_SDK.UNKNOWN;
    case 1:
    case "JS":
      return ClientInfo_SDK.JS;
    case 2:
    case "SWIFT":
      return ClientInfo_SDK.SWIFT;
    case 3:
    case "ANDROID":
      return ClientInfo_SDK.ANDROID;
    case 4:
    case "FLUTTER":
      return ClientInfo_SDK.FLUTTER;
    case 5:
    case "GO":
      return ClientInfo_SDK.GO;
    case 6:
    case "UNITY":
      return ClientInfo_SDK.UNITY;
    case 7:
    case "REACT_NATIVE":
      return ClientInfo_SDK.REACT_NATIVE;
    case 8:
    case "RUST":
      return ClientInfo_SDK.RUST;
    case 9:
    case "PYTHON":
      return ClientInfo_SDK.PYTHON;
    case 10:
    case "CPP":
      return ClientInfo_SDK.CPP;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ClientInfo_SDK.UNRECOGNIZED;
  }
}

export function clientInfo_SDKToJSON(object: ClientInfo_SDK): string {
  switch (object) {
    case ClientInfo_SDK.UNKNOWN:
      return "UNKNOWN";
    case ClientInfo_SDK.JS:
      return "JS";
    case ClientInfo_SDK.SWIFT:
      return "SWIFT";
    case ClientInfo_SDK.ANDROID:
      return "ANDROID";
    case ClientInfo_SDK.FLUTTER:
      return "FLUTTER";
    case ClientInfo_SDK.GO:
      return "GO";
    case ClientInfo_SDK.UNITY:
      return "UNITY";
    case ClientInfo_SDK.REACT_NATIVE:
      return "REACT_NATIVE";
    case ClientInfo_SDK.RUST:
      return "RUST";
    case ClientInfo_SDK.PYTHON:
      return "PYTHON";
    case ClientInfo_SDK.CPP:
      return "CPP";
    case ClientInfo_SDK.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** server provided client configuration */
export interface ClientConfiguration {
  video?: VideoConfiguration | undefined;
  screen?: VideoConfiguration | undefined;
  resumeConnection: ClientConfigSetting;
  disabledCodecs?: DisabledCodecs | undefined;
  forceRelay: ClientConfigSetting;
}

export interface VideoConfiguration {
  hardwareEncoder: ClientConfigSetting;
}

export interface DisabledCodecs {
  /** disabled for both publish and subscribe */
  codecs: Codec[];
  /** only disable for publish */
  publish: Codec[];
}

export interface RTPDrift {
  startTime?: Date | undefined;
  endTime?: Date | undefined;
  duration: number;
  startTimestamp: number;
  endTimestamp: number;
  rtpClockTicks: number;
  driftSamples: number;
  driftMs: number;
  clockRate: number;
}

export interface RTPStats {
  startTime?: Date | undefined;
  endTime?: Date | undefined;
  duration: number;
  packets: number;
  packetRate: number;
  bytes: number;
  headerBytes: number;
  bitrate: number;
  packetsLost: number;
  packetLossRate: number;
  packetLossPercentage: number;
  packetsDuplicate: number;
  packetDuplicateRate: number;
  bytesDuplicate: number;
  headerBytesDuplicate: number;
  bitrateDuplicate: number;
  packetsPadding: number;
  packetPaddingRate: number;
  bytesPadding: number;
  headerBytesPadding: number;
  bitratePadding: number;
  packetsOutOfOrder: number;
  frames: number;
  frameRate: number;
  jitterCurrent: number;
  jitterMax: number;
  gapHistogram: { [key: number]: number };
  nacks: number;
  nackAcks: number;
  nackMisses: number;
  nackRepeated: number;
  plis: number;
  lastPli?: Date | undefined;
  firs: number;
  lastFir?: Date | undefined;
  rttCurrent: number;
  rttMax: number;
  keyFrames: number;
  lastKeyFrame?: Date | undefined;
  layerLockPlis: number;
  lastLayerLockPli?: Date | undefined;
  packetDrift?:
    | RTPDrift
    | undefined;
  /** NEXT_ID: 46 */
  reportDrift?: RTPDrift | undefined;
}

export interface RTPStats_GapHistogramEntry {
  key: number;
  value: number;
}

export interface TimedVersion {
  unixMicro: number;
  ticks: number;
}

function createBaseRoom(): Room {
  return {
    sid: "",
    name: "",
    emptyTimeout: 0,
    maxParticipants: 0,
    creationTime: 0,
    turnPassword: "",
    enabledCodecs: [],
    metadata: "",
    numParticipants: 0,
    numPublishers: 0,
    activeRecording: false,
  };
}

export const Room = {
  encode(message: Room, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sid !== "") {
      writer.uint32(10).string(message.sid);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.emptyTimeout !== 0) {
      writer.uint32(24).uint32(message.emptyTimeout);
    }
    if (message.maxParticipants !== 0) {
      writer.uint32(32).uint32(message.maxParticipants);
    }
    if (message.creationTime !== 0) {
      writer.uint32(40).int64(message.creationTime);
    }
    if (message.turnPassword !== "") {
      writer.uint32(50).string(message.turnPassword);
    }
    for (const v of message.enabledCodecs) {
      Codec.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    if (message.metadata !== "") {
      writer.uint32(66).string(message.metadata);
    }
    if (message.numParticipants !== 0) {
      writer.uint32(72).uint32(message.numParticipants);
    }
    if (message.numPublishers !== 0) {
      writer.uint32(88).uint32(message.numPublishers);
    }
    if (message.activeRecording === true) {
      writer.uint32(80).bool(message.activeRecording);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Room {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRoom();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sid = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.emptyTimeout = reader.uint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.maxParticipants = reader.uint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.creationTime = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.turnPassword = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.enabledCodecs.push(Codec.decode(reader, reader.uint32()));
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.metadata = reader.string();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.numParticipants = reader.uint32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.numPublishers = reader.uint32();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.activeRecording = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Room {
    return {
      sid: isSet(object.sid) ? globalThis.String(object.sid) : "",
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      emptyTimeout: isSet(object.emptyTimeout) ? globalThis.Number(object.emptyTimeout) : 0,
      maxParticipants: isSet(object.maxParticipants) ? globalThis.Number(object.maxParticipants) : 0,
      creationTime: isSet(object.creationTime) ? globalThis.Number(object.creationTime) : 0,
      turnPassword: isSet(object.turnPassword) ? globalThis.String(object.turnPassword) : "",
      enabledCodecs: globalThis.Array.isArray(object?.enabledCodecs)
        ? object.enabledCodecs.map((e: any) => Codec.fromJSON(e))
        : [],
      metadata: isSet(object.metadata) ? globalThis.String(object.metadata) : "",
      numParticipants: isSet(object.numParticipants) ? globalThis.Number(object.numParticipants) : 0,
      numPublishers: isSet(object.numPublishers) ? globalThis.Number(object.numPublishers) : 0,
      activeRecording: isSet(object.activeRecording) ? globalThis.Boolean(object.activeRecording) : false,
    };
  },

  toJSON(message: Room): unknown {
    const obj: any = {};
    if (message.sid !== "") {
      obj.sid = message.sid;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.emptyTimeout !== 0) {
      obj.emptyTimeout = Math.round(message.emptyTimeout);
    }
    if (message.maxParticipants !== 0) {
      obj.maxParticipants = Math.round(message.maxParticipants);
    }
    if (message.creationTime !== 0) {
      obj.creationTime = Math.round(message.creationTime);
    }
    if (message.turnPassword !== "") {
      obj.turnPassword = message.turnPassword;
    }
    if (message.enabledCodecs?.length) {
      obj.enabledCodecs = message.enabledCodecs.map((e) => Codec.toJSON(e));
    }
    if (message.metadata !== "") {
      obj.metadata = message.metadata;
    }
    if (message.numParticipants !== 0) {
      obj.numParticipants = Math.round(message.numParticipants);
    }
    if (message.numPublishers !== 0) {
      obj.numPublishers = Math.round(message.numPublishers);
    }
    if (message.activeRecording === true) {
      obj.activeRecording = message.activeRecording;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Room>, I>>(base?: I): Room {
    return Room.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Room>, I>>(object: I): Room {
    const message = createBaseRoom();
    message.sid = object.sid ?? "";
    message.name = object.name ?? "";
    message.emptyTimeout = object.emptyTimeout ?? 0;
    message.maxParticipants = object.maxParticipants ?? 0;
    message.creationTime = object.creationTime ?? 0;
    message.turnPassword = object.turnPassword ?? "";
    message.enabledCodecs = object.enabledCodecs?.map((e) => Codec.fromPartial(e)) || [];
    message.metadata = object.metadata ?? "";
    message.numParticipants = object.numParticipants ?? 0;
    message.numPublishers = object.numPublishers ?? 0;
    message.activeRecording = object.activeRecording ?? false;
    return message;
  },
};

function createBaseCodec(): Codec {
  return { mime: "", fmtpLine: "" };
}

export const Codec = {
  encode(message: Codec, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.mime !== "") {
      writer.uint32(10).string(message.mime);
    }
    if (message.fmtpLine !== "") {
      writer.uint32(18).string(message.fmtpLine);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Codec {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCodec();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.mime = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.fmtpLine = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Codec {
    return {
      mime: isSet(object.mime) ? globalThis.String(object.mime) : "",
      fmtpLine: isSet(object.fmtpLine) ? globalThis.String(object.fmtpLine) : "",
    };
  },

  toJSON(message: Codec): unknown {
    const obj: any = {};
    if (message.mime !== "") {
      obj.mime = message.mime;
    }
    if (message.fmtpLine !== "") {
      obj.fmtpLine = message.fmtpLine;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Codec>, I>>(base?: I): Codec {
    return Codec.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Codec>, I>>(object: I): Codec {
    const message = createBaseCodec();
    message.mime = object.mime ?? "";
    message.fmtpLine = object.fmtpLine ?? "";
    return message;
  },
};

function createBasePlayoutDelay(): PlayoutDelay {
  return { enabled: false, min: 0, max: 0 };
}

export const PlayoutDelay = {
  encode(message: PlayoutDelay, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.enabled === true) {
      writer.uint32(8).bool(message.enabled);
    }
    if (message.min !== 0) {
      writer.uint32(16).uint32(message.min);
    }
    if (message.max !== 0) {
      writer.uint32(24).uint32(message.max);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PlayoutDelay {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlayoutDelay();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.enabled = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.min = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.max = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlayoutDelay {
    return {
      enabled: isSet(object.enabled) ? globalThis.Boolean(object.enabled) : false,
      min: isSet(object.min) ? globalThis.Number(object.min) : 0,
      max: isSet(object.max) ? globalThis.Number(object.max) : 0,
    };
  },

  toJSON(message: PlayoutDelay): unknown {
    const obj: any = {};
    if (message.enabled === true) {
      obj.enabled = message.enabled;
    }
    if (message.min !== 0) {
      obj.min = Math.round(message.min);
    }
    if (message.max !== 0) {
      obj.max = Math.round(message.max);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlayoutDelay>, I>>(base?: I): PlayoutDelay {
    return PlayoutDelay.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlayoutDelay>, I>>(object: I): PlayoutDelay {
    const message = createBasePlayoutDelay();
    message.enabled = object.enabled ?? false;
    message.min = object.min ?? 0;
    message.max = object.max ?? 0;
    return message;
  },
};

function createBaseParticipantPermission(): ParticipantPermission {
  return {
    canSubscribe: false,
    canPublish: false,
    canPublishData: false,
    canPublishSources: [],
    hidden: false,
    recorder: false,
    canUpdateMetadata: false,
  };
}

export const ParticipantPermission = {
  encode(message: ParticipantPermission, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.canSubscribe === true) {
      writer.uint32(8).bool(message.canSubscribe);
    }
    if (message.canPublish === true) {
      writer.uint32(16).bool(message.canPublish);
    }
    if (message.canPublishData === true) {
      writer.uint32(24).bool(message.canPublishData);
    }
    writer.uint32(74).fork();
    for (const v of message.canPublishSources) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.hidden === true) {
      writer.uint32(56).bool(message.hidden);
    }
    if (message.recorder === true) {
      writer.uint32(64).bool(message.recorder);
    }
    if (message.canUpdateMetadata === true) {
      writer.uint32(80).bool(message.canUpdateMetadata);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParticipantPermission {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParticipantPermission();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.canSubscribe = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.canPublish = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.canPublishData = reader.bool();
          continue;
        case 9:
          if (tag === 72) {
            message.canPublishSources.push(reader.int32() as any);

            continue;
          }

          if (tag === 74) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.canPublishSources.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.hidden = reader.bool();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.recorder = reader.bool();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.canUpdateMetadata = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ParticipantPermission {
    return {
      canSubscribe: isSet(object.canSubscribe) ? globalThis.Boolean(object.canSubscribe) : false,
      canPublish: isSet(object.canPublish) ? globalThis.Boolean(object.canPublish) : false,
      canPublishData: isSet(object.canPublishData) ? globalThis.Boolean(object.canPublishData) : false,
      canPublishSources: globalThis.Array.isArray(object?.canPublishSources)
        ? object.canPublishSources.map((e: any) => trackSourceFromJSON(e))
        : [],
      hidden: isSet(object.hidden) ? globalThis.Boolean(object.hidden) : false,
      recorder: isSet(object.recorder) ? globalThis.Boolean(object.recorder) : false,
      canUpdateMetadata: isSet(object.canUpdateMetadata) ? globalThis.Boolean(object.canUpdateMetadata) : false,
    };
  },

  toJSON(message: ParticipantPermission): unknown {
    const obj: any = {};
    if (message.canSubscribe === true) {
      obj.canSubscribe = message.canSubscribe;
    }
    if (message.canPublish === true) {
      obj.canPublish = message.canPublish;
    }
    if (message.canPublishData === true) {
      obj.canPublishData = message.canPublishData;
    }
    if (message.canPublishSources?.length) {
      obj.canPublishSources = message.canPublishSources.map((e) => trackSourceToJSON(e));
    }
    if (message.hidden === true) {
      obj.hidden = message.hidden;
    }
    if (message.recorder === true) {
      obj.recorder = message.recorder;
    }
    if (message.canUpdateMetadata === true) {
      obj.canUpdateMetadata = message.canUpdateMetadata;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ParticipantPermission>, I>>(base?: I): ParticipantPermission {
    return ParticipantPermission.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ParticipantPermission>, I>>(object: I): ParticipantPermission {
    const message = createBaseParticipantPermission();
    message.canSubscribe = object.canSubscribe ?? false;
    message.canPublish = object.canPublish ?? false;
    message.canPublishData = object.canPublishData ?? false;
    message.canPublishSources = object.canPublishSources?.map((e) => e) || [];
    message.hidden = object.hidden ?? false;
    message.recorder = object.recorder ?? false;
    message.canUpdateMetadata = object.canUpdateMetadata ?? false;
    return message;
  },
};

function createBaseParticipantInfo(): ParticipantInfo {
  return {
    sid: "",
    identity: "",
    state: 0,
    tracks: [],
    metadata: "",
    joinedAt: 0,
    name: "",
    version: 0,
    permission: undefined,
    region: "",
    isPublisher: false,
  };
}

export const ParticipantInfo = {
  encode(message: ParticipantInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sid !== "") {
      writer.uint32(10).string(message.sid);
    }
    if (message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    if (message.state !== 0) {
      writer.uint32(24).int32(message.state);
    }
    for (const v of message.tracks) {
      TrackInfo.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.metadata !== "") {
      writer.uint32(42).string(message.metadata);
    }
    if (message.joinedAt !== 0) {
      writer.uint32(48).int64(message.joinedAt);
    }
    if (message.name !== "") {
      writer.uint32(74).string(message.name);
    }
    if (message.version !== 0) {
      writer.uint32(80).uint32(message.version);
    }
    if (message.permission !== undefined) {
      ParticipantPermission.encode(message.permission, writer.uint32(90).fork()).ldelim();
    }
    if (message.region !== "") {
      writer.uint32(98).string(message.region);
    }
    if (message.isPublisher === true) {
      writer.uint32(104).bool(message.isPublisher);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParticipantInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParticipantInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sid = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.identity = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.tracks.push(TrackInfo.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.metadata = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.joinedAt = longToNumber(reader.int64() as Long);
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.name = reader.string();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.version = reader.uint32();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.permission = ParticipantPermission.decode(reader, reader.uint32());
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.region = reader.string();
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.isPublisher = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ParticipantInfo {
    return {
      sid: isSet(object.sid) ? globalThis.String(object.sid) : "",
      identity: isSet(object.identity) ? globalThis.String(object.identity) : "",
      state: isSet(object.state) ? participantInfo_StateFromJSON(object.state) : 0,
      tracks: globalThis.Array.isArray(object?.tracks) ? object.tracks.map((e: any) => TrackInfo.fromJSON(e)) : [],
      metadata: isSet(object.metadata) ? globalThis.String(object.metadata) : "",
      joinedAt: isSet(object.joinedAt) ? globalThis.Number(object.joinedAt) : 0,
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      version: isSet(object.version) ? globalThis.Number(object.version) : 0,
      permission: isSet(object.permission) ? ParticipantPermission.fromJSON(object.permission) : undefined,
      region: isSet(object.region) ? globalThis.String(object.region) : "",
      isPublisher: isSet(object.isPublisher) ? globalThis.Boolean(object.isPublisher) : false,
    };
  },

  toJSON(message: ParticipantInfo): unknown {
    const obj: any = {};
    if (message.sid !== "") {
      obj.sid = message.sid;
    }
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.state !== 0) {
      obj.state = participantInfo_StateToJSON(message.state);
    }
    if (message.tracks?.length) {
      obj.tracks = message.tracks.map((e) => TrackInfo.toJSON(e));
    }
    if (message.metadata !== "") {
      obj.metadata = message.metadata;
    }
    if (message.joinedAt !== 0) {
      obj.joinedAt = Math.round(message.joinedAt);
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.version !== 0) {
      obj.version = Math.round(message.version);
    }
    if (message.permission !== undefined) {
      obj.permission = ParticipantPermission.toJSON(message.permission);
    }
    if (message.region !== "") {
      obj.region = message.region;
    }
    if (message.isPublisher === true) {
      obj.isPublisher = message.isPublisher;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ParticipantInfo>, I>>(base?: I): ParticipantInfo {
    return ParticipantInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ParticipantInfo>, I>>(object: I): ParticipantInfo {
    const message = createBaseParticipantInfo();
    message.sid = object.sid ?? "";
    message.identity = object.identity ?? "";
    message.state = object.state ?? 0;
    message.tracks = object.tracks?.map((e) => TrackInfo.fromPartial(e)) || [];
    message.metadata = object.metadata ?? "";
    message.joinedAt = object.joinedAt ?? 0;
    message.name = object.name ?? "";
    message.version = object.version ?? 0;
    message.permission = (object.permission !== undefined && object.permission !== null)
      ? ParticipantPermission.fromPartial(object.permission)
      : undefined;
    message.region = object.region ?? "";
    message.isPublisher = object.isPublisher ?? false;
    return message;
  },
};

function createBaseEncryption(): Encryption {
  return {};
}

export const Encryption = {
  encode(_: Encryption, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Encryption {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncryption();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): Encryption {
    return {};
  },

  toJSON(_: Encryption): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<Encryption>, I>>(base?: I): Encryption {
    return Encryption.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Encryption>, I>>(_: I): Encryption {
    const message = createBaseEncryption();
    return message;
  },
};

function createBaseSimulcastCodecInfo(): SimulcastCodecInfo {
  return { mimeType: "", mid: "", cid: "", layers: [] };
}

export const SimulcastCodecInfo = {
  encode(message: SimulcastCodecInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.mimeType !== "") {
      writer.uint32(10).string(message.mimeType);
    }
    if (message.mid !== "") {
      writer.uint32(18).string(message.mid);
    }
    if (message.cid !== "") {
      writer.uint32(26).string(message.cid);
    }
    for (const v of message.layers) {
      VideoLayer.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SimulcastCodecInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSimulcastCodecInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.mimeType = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.mid = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.cid = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.layers.push(VideoLayer.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SimulcastCodecInfo {
    return {
      mimeType: isSet(object.mimeType) ? globalThis.String(object.mimeType) : "",
      mid: isSet(object.mid) ? globalThis.String(object.mid) : "",
      cid: isSet(object.cid) ? globalThis.String(object.cid) : "",
      layers: globalThis.Array.isArray(object?.layers) ? object.layers.map((e: any) => VideoLayer.fromJSON(e)) : [],
    };
  },

  toJSON(message: SimulcastCodecInfo): unknown {
    const obj: any = {};
    if (message.mimeType !== "") {
      obj.mimeType = message.mimeType;
    }
    if (message.mid !== "") {
      obj.mid = message.mid;
    }
    if (message.cid !== "") {
      obj.cid = message.cid;
    }
    if (message.layers?.length) {
      obj.layers = message.layers.map((e) => VideoLayer.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SimulcastCodecInfo>, I>>(base?: I): SimulcastCodecInfo {
    return SimulcastCodecInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SimulcastCodecInfo>, I>>(object: I): SimulcastCodecInfo {
    const message = createBaseSimulcastCodecInfo();
    message.mimeType = object.mimeType ?? "";
    message.mid = object.mid ?? "";
    message.cid = object.cid ?? "";
    message.layers = object.layers?.map((e) => VideoLayer.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTrackInfo(): TrackInfo {
  return {
    sid: "",
    type: 0,
    name: "",
    muted: false,
    width: 0,
    height: 0,
    simulcast: false,
    disableDtx: false,
    source: 0,
    layers: [],
    mimeType: "",
    mid: "",
    codecs: [],
    stereo: false,
    disableRed: false,
    encryption: 0,
    stream: "",
  };
}

export const TrackInfo = {
  encode(message: TrackInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sid !== "") {
      writer.uint32(10).string(message.sid);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    if (message.muted === true) {
      writer.uint32(32).bool(message.muted);
    }
    if (message.width !== 0) {
      writer.uint32(40).uint32(message.width);
    }
    if (message.height !== 0) {
      writer.uint32(48).uint32(message.height);
    }
    if (message.simulcast === true) {
      writer.uint32(56).bool(message.simulcast);
    }
    if (message.disableDtx === true) {
      writer.uint32(64).bool(message.disableDtx);
    }
    if (message.source !== 0) {
      writer.uint32(72).int32(message.source);
    }
    for (const v of message.layers) {
      VideoLayer.encode(v!, writer.uint32(82).fork()).ldelim();
    }
    if (message.mimeType !== "") {
      writer.uint32(90).string(message.mimeType);
    }
    if (message.mid !== "") {
      writer.uint32(98).string(message.mid);
    }
    for (const v of message.codecs) {
      SimulcastCodecInfo.encode(v!, writer.uint32(106).fork()).ldelim();
    }
    if (message.stereo === true) {
      writer.uint32(112).bool(message.stereo);
    }
    if (message.disableRed === true) {
      writer.uint32(120).bool(message.disableRed);
    }
    if (message.encryption !== 0) {
      writer.uint32(128).int32(message.encryption);
    }
    if (message.stream !== "") {
      writer.uint32(138).string(message.stream);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TrackInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrackInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sid = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.name = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.muted = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.width = reader.uint32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.height = reader.uint32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.simulcast = reader.bool();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.disableDtx = reader.bool();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.source = reader.int32() as any;
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.layers.push(VideoLayer.decode(reader, reader.uint32()));
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.mimeType = reader.string();
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.mid = reader.string();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.codecs.push(SimulcastCodecInfo.decode(reader, reader.uint32()));
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }

          message.stereo = reader.bool();
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }

          message.disableRed = reader.bool();
          continue;
        case 16:
          if (tag !== 128) {
            break;
          }

          message.encryption = reader.int32() as any;
          continue;
        case 17:
          if (tag !== 138) {
            break;
          }

          message.stream = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TrackInfo {
    return {
      sid: isSet(object.sid) ? globalThis.String(object.sid) : "",
      type: isSet(object.type) ? trackTypeFromJSON(object.type) : 0,
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      muted: isSet(object.muted) ? globalThis.Boolean(object.muted) : false,
      width: isSet(object.width) ? globalThis.Number(object.width) : 0,
      height: isSet(object.height) ? globalThis.Number(object.height) : 0,
      simulcast: isSet(object.simulcast) ? globalThis.Boolean(object.simulcast) : false,
      disableDtx: isSet(object.disableDtx) ? globalThis.Boolean(object.disableDtx) : false,
      source: isSet(object.source) ? trackSourceFromJSON(object.source) : 0,
      layers: globalThis.Array.isArray(object?.layers) ? object.layers.map((e: any) => VideoLayer.fromJSON(e)) : [],
      mimeType: isSet(object.mimeType) ? globalThis.String(object.mimeType) : "",
      mid: isSet(object.mid) ? globalThis.String(object.mid) : "",
      codecs: globalThis.Array.isArray(object?.codecs)
        ? object.codecs.map((e: any) => SimulcastCodecInfo.fromJSON(e))
        : [],
      stereo: isSet(object.stereo) ? globalThis.Boolean(object.stereo) : false,
      disableRed: isSet(object.disableRed) ? globalThis.Boolean(object.disableRed) : false,
      encryption: isSet(object.encryption) ? encryption_TypeFromJSON(object.encryption) : 0,
      stream: isSet(object.stream) ? globalThis.String(object.stream) : "",
    };
  },

  toJSON(message: TrackInfo): unknown {
    const obj: any = {};
    if (message.sid !== "") {
      obj.sid = message.sid;
    }
    if (message.type !== 0) {
      obj.type = trackTypeToJSON(message.type);
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.muted === true) {
      obj.muted = message.muted;
    }
    if (message.width !== 0) {
      obj.width = Math.round(message.width);
    }
    if (message.height !== 0) {
      obj.height = Math.round(message.height);
    }
    if (message.simulcast === true) {
      obj.simulcast = message.simulcast;
    }
    if (message.disableDtx === true) {
      obj.disableDtx = message.disableDtx;
    }
    if (message.source !== 0) {
      obj.source = trackSourceToJSON(message.source);
    }
    if (message.layers?.length) {
      obj.layers = message.layers.map((e) => VideoLayer.toJSON(e));
    }
    if (message.mimeType !== "") {
      obj.mimeType = message.mimeType;
    }
    if (message.mid !== "") {
      obj.mid = message.mid;
    }
    if (message.codecs?.length) {
      obj.codecs = message.codecs.map((e) => SimulcastCodecInfo.toJSON(e));
    }
    if (message.stereo === true) {
      obj.stereo = message.stereo;
    }
    if (message.disableRed === true) {
      obj.disableRed = message.disableRed;
    }
    if (message.encryption !== 0) {
      obj.encryption = encryption_TypeToJSON(message.encryption);
    }
    if (message.stream !== "") {
      obj.stream = message.stream;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TrackInfo>, I>>(base?: I): TrackInfo {
    return TrackInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TrackInfo>, I>>(object: I): TrackInfo {
    const message = createBaseTrackInfo();
    message.sid = object.sid ?? "";
    message.type = object.type ?? 0;
    message.name = object.name ?? "";
    message.muted = object.muted ?? false;
    message.width = object.width ?? 0;
    message.height = object.height ?? 0;
    message.simulcast = object.simulcast ?? false;
    message.disableDtx = object.disableDtx ?? false;
    message.source = object.source ?? 0;
    message.layers = object.layers?.map((e) => VideoLayer.fromPartial(e)) || [];
    message.mimeType = object.mimeType ?? "";
    message.mid = object.mid ?? "";
    message.codecs = object.codecs?.map((e) => SimulcastCodecInfo.fromPartial(e)) || [];
    message.stereo = object.stereo ?? false;
    message.disableRed = object.disableRed ?? false;
    message.encryption = object.encryption ?? 0;
    message.stream = object.stream ?? "";
    return message;
  },
};

function createBaseVideoLayer(): VideoLayer {
  return { quality: 0, width: 0, height: 0, bitrate: 0, ssrc: 0 };
}

export const VideoLayer = {
  encode(message: VideoLayer, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.quality !== 0) {
      writer.uint32(8).int32(message.quality);
    }
    if (message.width !== 0) {
      writer.uint32(16).uint32(message.width);
    }
    if (message.height !== 0) {
      writer.uint32(24).uint32(message.height);
    }
    if (message.bitrate !== 0) {
      writer.uint32(32).uint32(message.bitrate);
    }
    if (message.ssrc !== 0) {
      writer.uint32(40).uint32(message.ssrc);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VideoLayer {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVideoLayer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.quality = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.width = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.height = reader.uint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.bitrate = reader.uint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.ssrc = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VideoLayer {
    return {
      quality: isSet(object.quality) ? videoQualityFromJSON(object.quality) : 0,
      width: isSet(object.width) ? globalThis.Number(object.width) : 0,
      height: isSet(object.height) ? globalThis.Number(object.height) : 0,
      bitrate: isSet(object.bitrate) ? globalThis.Number(object.bitrate) : 0,
      ssrc: isSet(object.ssrc) ? globalThis.Number(object.ssrc) : 0,
    };
  },

  toJSON(message: VideoLayer): unknown {
    const obj: any = {};
    if (message.quality !== 0) {
      obj.quality = videoQualityToJSON(message.quality);
    }
    if (message.width !== 0) {
      obj.width = Math.round(message.width);
    }
    if (message.height !== 0) {
      obj.height = Math.round(message.height);
    }
    if (message.bitrate !== 0) {
      obj.bitrate = Math.round(message.bitrate);
    }
    if (message.ssrc !== 0) {
      obj.ssrc = Math.round(message.ssrc);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VideoLayer>, I>>(base?: I): VideoLayer {
    return VideoLayer.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VideoLayer>, I>>(object: I): VideoLayer {
    const message = createBaseVideoLayer();
    message.quality = object.quality ?? 0;
    message.width = object.width ?? 0;
    message.height = object.height ?? 0;
    message.bitrate = object.bitrate ?? 0;
    message.ssrc = object.ssrc ?? 0;
    return message;
  },
};

function createBaseDataPacket(): DataPacket {
  return { kind: 0, user: undefined, speaker: undefined, persistableUser: undefined };
}

export const DataPacket = {
  encode(message: DataPacket, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.kind !== 0) {
      writer.uint32(8).int32(message.kind);
    }
    if (message.user !== undefined) {
      UserPacket.encode(message.user, writer.uint32(18).fork()).ldelim();
    }
    if (message.speaker !== undefined) {
      ActiveSpeakerUpdate.encode(message.speaker, writer.uint32(26).fork()).ldelim();
    }
    if (message.persistableUser !== undefined) {
      PersistableUserPacket.encode(message.persistableUser, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DataPacket {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDataPacket();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.kind = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.user = UserPacket.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.speaker = ActiveSpeakerUpdate.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.persistableUser = PersistableUserPacket.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DataPacket {
    return {
      kind: isSet(object.kind) ? dataPacket_KindFromJSON(object.kind) : 0,
      user: isSet(object.user) ? UserPacket.fromJSON(object.user) : undefined,
      speaker: isSet(object.speaker) ? ActiveSpeakerUpdate.fromJSON(object.speaker) : undefined,
      persistableUser: isSet(object.persistableUser)
        ? PersistableUserPacket.fromJSON(object.persistableUser)
        : undefined,
    };
  },

  toJSON(message: DataPacket): unknown {
    const obj: any = {};
    if (message.kind !== 0) {
      obj.kind = dataPacket_KindToJSON(message.kind);
    }
    if (message.user !== undefined) {
      obj.user = UserPacket.toJSON(message.user);
    }
    if (message.speaker !== undefined) {
      obj.speaker = ActiveSpeakerUpdate.toJSON(message.speaker);
    }
    if (message.persistableUser !== undefined) {
      obj.persistableUser = PersistableUserPacket.toJSON(message.persistableUser);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DataPacket>, I>>(base?: I): DataPacket {
    return DataPacket.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DataPacket>, I>>(object: I): DataPacket {
    const message = createBaseDataPacket();
    message.kind = object.kind ?? 0;
    message.user = (object.user !== undefined && object.user !== null)
      ? UserPacket.fromPartial(object.user)
      : undefined;
    message.speaker = (object.speaker !== undefined && object.speaker !== null)
      ? ActiveSpeakerUpdate.fromPartial(object.speaker)
      : undefined;
    message.persistableUser = (object.persistableUser !== undefined && object.persistableUser !== null)
      ? PersistableUserPacket.fromPartial(object.persistableUser)
      : undefined;
    return message;
  },
};

function createBaseActiveSpeakerUpdate(): ActiveSpeakerUpdate {
  return { speakers: [] };
}

export const ActiveSpeakerUpdate = {
  encode(message: ActiveSpeakerUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.speakers) {
      SpeakerInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActiveSpeakerUpdate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActiveSpeakerUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.speakers.push(SpeakerInfo.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ActiveSpeakerUpdate {
    return {
      speakers: globalThis.Array.isArray(object?.speakers)
        ? object.speakers.map((e: any) => SpeakerInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ActiveSpeakerUpdate): unknown {
    const obj: any = {};
    if (message.speakers?.length) {
      obj.speakers = message.speakers.map((e) => SpeakerInfo.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActiveSpeakerUpdate>, I>>(base?: I): ActiveSpeakerUpdate {
    return ActiveSpeakerUpdate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActiveSpeakerUpdate>, I>>(object: I): ActiveSpeakerUpdate {
    const message = createBaseActiveSpeakerUpdate();
    message.speakers = object.speakers?.map((e) => SpeakerInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSpeakerInfo(): SpeakerInfo {
  return { sid: "", level: 0, active: false };
}

export const SpeakerInfo = {
  encode(message: SpeakerInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sid !== "") {
      writer.uint32(10).string(message.sid);
    }
    if (message.level !== 0) {
      writer.uint32(21).float(message.level);
    }
    if (message.active === true) {
      writer.uint32(24).bool(message.active);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SpeakerInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSpeakerInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sid = reader.string();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.level = reader.float();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.active = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SpeakerInfo {
    return {
      sid: isSet(object.sid) ? globalThis.String(object.sid) : "",
      level: isSet(object.level) ? globalThis.Number(object.level) : 0,
      active: isSet(object.active) ? globalThis.Boolean(object.active) : false,
    };
  },

  toJSON(message: SpeakerInfo): unknown {
    const obj: any = {};
    if (message.sid !== "") {
      obj.sid = message.sid;
    }
    if (message.level !== 0) {
      obj.level = message.level;
    }
    if (message.active === true) {
      obj.active = message.active;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SpeakerInfo>, I>>(base?: I): SpeakerInfo {
    return SpeakerInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SpeakerInfo>, I>>(object: I): SpeakerInfo {
    const message = createBaseSpeakerInfo();
    message.sid = object.sid ?? "";
    message.level = object.level ?? 0;
    message.active = object.active ?? false;
    return message;
  },
};

function createBaseUserPacket(): UserPacket {
  return {
    participantSid: "",
    participantIdentity: "",
    payload: new Uint8Array(0),
    destinationSids: [],
    destinationIdentities: [],
    topic: undefined,
  };
}

export const UserPacket = {
  encode(message: UserPacket, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.participantSid !== "") {
      writer.uint32(10).string(message.participantSid);
    }
    if (message.participantIdentity !== "") {
      writer.uint32(42).string(message.participantIdentity);
    }
    if (message.payload.length !== 0) {
      writer.uint32(18).bytes(message.payload);
    }
    for (const v of message.destinationSids) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.destinationIdentities) {
      writer.uint32(50).string(v!);
    }
    if (message.topic !== undefined) {
      writer.uint32(34).string(message.topic);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserPacket {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserPacket();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.participantSid = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.participantIdentity = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.payload = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.destinationSids.push(reader.string());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.destinationIdentities.push(reader.string());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.topic = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UserPacket {
    return {
      participantSid: isSet(object.participantSid) ? globalThis.String(object.participantSid) : "",
      participantIdentity: isSet(object.participantIdentity) ? globalThis.String(object.participantIdentity) : "",
      payload: isSet(object.payload) ? bytesFromBase64(object.payload) : new Uint8Array(0),
      destinationSids: globalThis.Array.isArray(object?.destinationSids)
        ? object.destinationSids.map((e: any) => globalThis.String(e))
        : [],
      destinationIdentities: globalThis.Array.isArray(object?.destinationIdentities)
        ? object.destinationIdentities.map((e: any) => globalThis.String(e))
        : [],
      topic: isSet(object.topic) ? globalThis.String(object.topic) : undefined,
    };
  },

  toJSON(message: UserPacket): unknown {
    const obj: any = {};
    if (message.participantSid !== "") {
      obj.participantSid = message.participantSid;
    }
    if (message.participantIdentity !== "") {
      obj.participantIdentity = message.participantIdentity;
    }
    if (message.payload.length !== 0) {
      obj.payload = base64FromBytes(message.payload);
    }
    if (message.destinationSids?.length) {
      obj.destinationSids = message.destinationSids;
    }
    if (message.destinationIdentities?.length) {
      obj.destinationIdentities = message.destinationIdentities;
    }
    if (message.topic !== undefined) {
      obj.topic = message.topic;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UserPacket>, I>>(base?: I): UserPacket {
    return UserPacket.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UserPacket>, I>>(object: I): UserPacket {
    const message = createBaseUserPacket();
    message.participantSid = object.participantSid ?? "";
    message.participantIdentity = object.participantIdentity ?? "";
    message.payload = object.payload ?? new Uint8Array(0);
    message.destinationSids = object.destinationSids?.map((e) => e) || [];
    message.destinationIdentities = object.destinationIdentities?.map((e) => e) || [];
    message.topic = object.topic ?? undefined;
    return message;
  },
};

function createBasePersistableUserPacket(): PersistableUserPacket {
  return {
    participantSid: "",
    participantIdentity: "",
    participantName: "",
    payload: new Uint8Array(0),
    destinationSids: [],
    destinationIdentities: [],
    topic: undefined,
    timestamp: 0,
  };
}

export const PersistableUserPacket = {
  encode(message: PersistableUserPacket, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.participantSid !== "") {
      writer.uint32(10).string(message.participantSid);
    }
    if (message.participantIdentity !== "") {
      writer.uint32(42).string(message.participantIdentity);
    }
    if (message.participantName !== "") {
      writer.uint32(66).string(message.participantName);
    }
    if (message.payload.length !== 0) {
      writer.uint32(18).bytes(message.payload);
    }
    for (const v of message.destinationSids) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.destinationIdentities) {
      writer.uint32(50).string(v!);
    }
    if (message.topic !== undefined) {
      writer.uint32(34).string(message.topic);
    }
    if (message.timestamp !== 0) {
      writer.uint32(56).int64(message.timestamp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PersistableUserPacket {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePersistableUserPacket();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.participantSid = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.participantIdentity = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.participantName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.payload = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.destinationSids.push(reader.string());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.destinationIdentities.push(reader.string());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.topic = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.timestamp = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PersistableUserPacket {
    return {
      participantSid: isSet(object.participantSid) ? globalThis.String(object.participantSid) : "",
      participantIdentity: isSet(object.participantIdentity) ? globalThis.String(object.participantIdentity) : "",
      participantName: isSet(object.participantName) ? globalThis.String(object.participantName) : "",
      payload: isSet(object.payload) ? bytesFromBase64(object.payload) : new Uint8Array(0),
      destinationSids: globalThis.Array.isArray(object?.destinationSids)
        ? object.destinationSids.map((e: any) => globalThis.String(e))
        : [],
      destinationIdentities: globalThis.Array.isArray(object?.destinationIdentities)
        ? object.destinationIdentities.map((e: any) => globalThis.String(e))
        : [],
      topic: isSet(object.topic) ? globalThis.String(object.topic) : undefined,
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
    };
  },

  toJSON(message: PersistableUserPacket): unknown {
    const obj: any = {};
    if (message.participantSid !== "") {
      obj.participantSid = message.participantSid;
    }
    if (message.participantIdentity !== "") {
      obj.participantIdentity = message.participantIdentity;
    }
    if (message.participantName !== "") {
      obj.participantName = message.participantName;
    }
    if (message.payload.length !== 0) {
      obj.payload = base64FromBytes(message.payload);
    }
    if (message.destinationSids?.length) {
      obj.destinationSids = message.destinationSids;
    }
    if (message.destinationIdentities?.length) {
      obj.destinationIdentities = message.destinationIdentities;
    }
    if (message.topic !== undefined) {
      obj.topic = message.topic;
    }
    if (message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PersistableUserPacket>, I>>(base?: I): PersistableUserPacket {
    return PersistableUserPacket.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PersistableUserPacket>, I>>(object: I): PersistableUserPacket {
    const message = createBasePersistableUserPacket();
    message.participantSid = object.participantSid ?? "";
    message.participantIdentity = object.participantIdentity ?? "";
    message.participantName = object.participantName ?? "";
    message.payload = object.payload ?? new Uint8Array(0);
    message.destinationSids = object.destinationSids?.map((e) => e) || [];
    message.destinationIdentities = object.destinationIdentities?.map((e) => e) || [];
    message.topic = object.topic ?? undefined;
    message.timestamp = object.timestamp ?? 0;
    return message;
  },
};

function createBasePersistableUserData(): PersistableUserData {
  return { packets: [] };
}

export const PersistableUserData = {
  encode(message: PersistableUserData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.packets) {
      PersistableUserPacket.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PersistableUserData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePersistableUserData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.packets.push(PersistableUserPacket.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PersistableUserData {
    return {
      packets: globalThis.Array.isArray(object?.packets)
        ? object.packets.map((e: any) => PersistableUserPacket.fromJSON(e))
        : [],
    };
  },

  toJSON(message: PersistableUserData): unknown {
    const obj: any = {};
    if (message.packets?.length) {
      obj.packets = message.packets.map((e) => PersistableUserPacket.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PersistableUserData>, I>>(base?: I): PersistableUserData {
    return PersistableUserData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PersistableUserData>, I>>(object: I): PersistableUserData {
    const message = createBasePersistableUserData();
    message.packets = object.packets?.map((e) => PersistableUserPacket.fromPartial(e)) || [];
    return message;
  },
};

function createBaseParticipantTracks(): ParticipantTracks {
  return { participantSid: "", trackSids: [] };
}

export const ParticipantTracks = {
  encode(message: ParticipantTracks, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.participantSid !== "") {
      writer.uint32(10).string(message.participantSid);
    }
    for (const v of message.trackSids) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParticipantTracks {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParticipantTracks();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.participantSid = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.trackSids.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ParticipantTracks {
    return {
      participantSid: isSet(object.participantSid) ? globalThis.String(object.participantSid) : "",
      trackSids: globalThis.Array.isArray(object?.trackSids)
        ? object.trackSids.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: ParticipantTracks): unknown {
    const obj: any = {};
    if (message.participantSid !== "") {
      obj.participantSid = message.participantSid;
    }
    if (message.trackSids?.length) {
      obj.trackSids = message.trackSids;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ParticipantTracks>, I>>(base?: I): ParticipantTracks {
    return ParticipantTracks.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ParticipantTracks>, I>>(object: I): ParticipantTracks {
    const message = createBaseParticipantTracks();
    message.participantSid = object.participantSid ?? "";
    message.trackSids = object.trackSids?.map((e) => e) || [];
    return message;
  },
};

function createBaseServerInfo(): ServerInfo {
  return { edition: 0, version: "", protocol: 0, region: "", nodeId: "", debugInfo: "" };
}

export const ServerInfo = {
  encode(message: ServerInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.edition !== 0) {
      writer.uint32(8).int32(message.edition);
    }
    if (message.version !== "") {
      writer.uint32(18).string(message.version);
    }
    if (message.protocol !== 0) {
      writer.uint32(24).int32(message.protocol);
    }
    if (message.region !== "") {
      writer.uint32(34).string(message.region);
    }
    if (message.nodeId !== "") {
      writer.uint32(42).string(message.nodeId);
    }
    if (message.debugInfo !== "") {
      writer.uint32(50).string(message.debugInfo);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.edition = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.version = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.protocol = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.region = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.nodeId = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.debugInfo = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerInfo {
    return {
      edition: isSet(object.edition) ? serverInfo_EditionFromJSON(object.edition) : 0,
      version: isSet(object.version) ? globalThis.String(object.version) : "",
      protocol: isSet(object.protocol) ? globalThis.Number(object.protocol) : 0,
      region: isSet(object.region) ? globalThis.String(object.region) : "",
      nodeId: isSet(object.nodeId) ? globalThis.String(object.nodeId) : "",
      debugInfo: isSet(object.debugInfo) ? globalThis.String(object.debugInfo) : "",
    };
  },

  toJSON(message: ServerInfo): unknown {
    const obj: any = {};
    if (message.edition !== 0) {
      obj.edition = serverInfo_EditionToJSON(message.edition);
    }
    if (message.version !== "") {
      obj.version = message.version;
    }
    if (message.protocol !== 0) {
      obj.protocol = Math.round(message.protocol);
    }
    if (message.region !== "") {
      obj.region = message.region;
    }
    if (message.nodeId !== "") {
      obj.nodeId = message.nodeId;
    }
    if (message.debugInfo !== "") {
      obj.debugInfo = message.debugInfo;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ServerInfo>, I>>(base?: I): ServerInfo {
    return ServerInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServerInfo>, I>>(object: I): ServerInfo {
    const message = createBaseServerInfo();
    message.edition = object.edition ?? 0;
    message.version = object.version ?? "";
    message.protocol = object.protocol ?? 0;
    message.region = object.region ?? "";
    message.nodeId = object.nodeId ?? "";
    message.debugInfo = object.debugInfo ?? "";
    return message;
  },
};

function createBaseClientInfo(): ClientInfo {
  return {
    sdk: 0,
    version: "",
    protocol: 0,
    os: "",
    osVersion: "",
    deviceModel: "",
    browser: "",
    browserVersion: "",
    address: "",
    network: "",
  };
}

export const ClientInfo = {
  encode(message: ClientInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sdk !== 0) {
      writer.uint32(8).int32(message.sdk);
    }
    if (message.version !== "") {
      writer.uint32(18).string(message.version);
    }
    if (message.protocol !== 0) {
      writer.uint32(24).int32(message.protocol);
    }
    if (message.os !== "") {
      writer.uint32(34).string(message.os);
    }
    if (message.osVersion !== "") {
      writer.uint32(42).string(message.osVersion);
    }
    if (message.deviceModel !== "") {
      writer.uint32(50).string(message.deviceModel);
    }
    if (message.browser !== "") {
      writer.uint32(58).string(message.browser);
    }
    if (message.browserVersion !== "") {
      writer.uint32(66).string(message.browserVersion);
    }
    if (message.address !== "") {
      writer.uint32(74).string(message.address);
    }
    if (message.network !== "") {
      writer.uint32(82).string(message.network);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClientInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClientInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.sdk = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.version = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.protocol = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.os = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.osVersion = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.deviceModel = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.browser = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.browserVersion = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.address = reader.string();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.network = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ClientInfo {
    return {
      sdk: isSet(object.sdk) ? clientInfo_SDKFromJSON(object.sdk) : 0,
      version: isSet(object.version) ? globalThis.String(object.version) : "",
      protocol: isSet(object.protocol) ? globalThis.Number(object.protocol) : 0,
      os: isSet(object.os) ? globalThis.String(object.os) : "",
      osVersion: isSet(object.osVersion) ? globalThis.String(object.osVersion) : "",
      deviceModel: isSet(object.deviceModel) ? globalThis.String(object.deviceModel) : "",
      browser: isSet(object.browser) ? globalThis.String(object.browser) : "",
      browserVersion: isSet(object.browserVersion) ? globalThis.String(object.browserVersion) : "",
      address: isSet(object.address) ? globalThis.String(object.address) : "",
      network: isSet(object.network) ? globalThis.String(object.network) : "",
    };
  },

  toJSON(message: ClientInfo): unknown {
    const obj: any = {};
    if (message.sdk !== 0) {
      obj.sdk = clientInfo_SDKToJSON(message.sdk);
    }
    if (message.version !== "") {
      obj.version = message.version;
    }
    if (message.protocol !== 0) {
      obj.protocol = Math.round(message.protocol);
    }
    if (message.os !== "") {
      obj.os = message.os;
    }
    if (message.osVersion !== "") {
      obj.osVersion = message.osVersion;
    }
    if (message.deviceModel !== "") {
      obj.deviceModel = message.deviceModel;
    }
    if (message.browser !== "") {
      obj.browser = message.browser;
    }
    if (message.browserVersion !== "") {
      obj.browserVersion = message.browserVersion;
    }
    if (message.address !== "") {
      obj.address = message.address;
    }
    if (message.network !== "") {
      obj.network = message.network;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ClientInfo>, I>>(base?: I): ClientInfo {
    return ClientInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ClientInfo>, I>>(object: I): ClientInfo {
    const message = createBaseClientInfo();
    message.sdk = object.sdk ?? 0;
    message.version = object.version ?? "";
    message.protocol = object.protocol ?? 0;
    message.os = object.os ?? "";
    message.osVersion = object.osVersion ?? "";
    message.deviceModel = object.deviceModel ?? "";
    message.browser = object.browser ?? "";
    message.browserVersion = object.browserVersion ?? "";
    message.address = object.address ?? "";
    message.network = object.network ?? "";
    return message;
  },
};

function createBaseClientConfiguration(): ClientConfiguration {
  return { video: undefined, screen: undefined, resumeConnection: 0, disabledCodecs: undefined, forceRelay: 0 };
}

export const ClientConfiguration = {
  encode(message: ClientConfiguration, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.video !== undefined) {
      VideoConfiguration.encode(message.video, writer.uint32(10).fork()).ldelim();
    }
    if (message.screen !== undefined) {
      VideoConfiguration.encode(message.screen, writer.uint32(18).fork()).ldelim();
    }
    if (message.resumeConnection !== 0) {
      writer.uint32(24).int32(message.resumeConnection);
    }
    if (message.disabledCodecs !== undefined) {
      DisabledCodecs.encode(message.disabledCodecs, writer.uint32(34).fork()).ldelim();
    }
    if (message.forceRelay !== 0) {
      writer.uint32(40).int32(message.forceRelay);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClientConfiguration {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClientConfiguration();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.video = VideoConfiguration.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.screen = VideoConfiguration.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.resumeConnection = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.disabledCodecs = DisabledCodecs.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.forceRelay = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ClientConfiguration {
    return {
      video: isSet(object.video) ? VideoConfiguration.fromJSON(object.video) : undefined,
      screen: isSet(object.screen) ? VideoConfiguration.fromJSON(object.screen) : undefined,
      resumeConnection: isSet(object.resumeConnection) ? clientConfigSettingFromJSON(object.resumeConnection) : 0,
      disabledCodecs: isSet(object.disabledCodecs) ? DisabledCodecs.fromJSON(object.disabledCodecs) : undefined,
      forceRelay: isSet(object.forceRelay) ? clientConfigSettingFromJSON(object.forceRelay) : 0,
    };
  },

  toJSON(message: ClientConfiguration): unknown {
    const obj: any = {};
    if (message.video !== undefined) {
      obj.video = VideoConfiguration.toJSON(message.video);
    }
    if (message.screen !== undefined) {
      obj.screen = VideoConfiguration.toJSON(message.screen);
    }
    if (message.resumeConnection !== 0) {
      obj.resumeConnection = clientConfigSettingToJSON(message.resumeConnection);
    }
    if (message.disabledCodecs !== undefined) {
      obj.disabledCodecs = DisabledCodecs.toJSON(message.disabledCodecs);
    }
    if (message.forceRelay !== 0) {
      obj.forceRelay = clientConfigSettingToJSON(message.forceRelay);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ClientConfiguration>, I>>(base?: I): ClientConfiguration {
    return ClientConfiguration.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ClientConfiguration>, I>>(object: I): ClientConfiguration {
    const message = createBaseClientConfiguration();
    message.video = (object.video !== undefined && object.video !== null)
      ? VideoConfiguration.fromPartial(object.video)
      : undefined;
    message.screen = (object.screen !== undefined && object.screen !== null)
      ? VideoConfiguration.fromPartial(object.screen)
      : undefined;
    message.resumeConnection = object.resumeConnection ?? 0;
    message.disabledCodecs = (object.disabledCodecs !== undefined && object.disabledCodecs !== null)
      ? DisabledCodecs.fromPartial(object.disabledCodecs)
      : undefined;
    message.forceRelay = object.forceRelay ?? 0;
    return message;
  },
};

function createBaseVideoConfiguration(): VideoConfiguration {
  return { hardwareEncoder: 0 };
}

export const VideoConfiguration = {
  encode(message: VideoConfiguration, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hardwareEncoder !== 0) {
      writer.uint32(8).int32(message.hardwareEncoder);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VideoConfiguration {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVideoConfiguration();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.hardwareEncoder = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VideoConfiguration {
    return { hardwareEncoder: isSet(object.hardwareEncoder) ? clientConfigSettingFromJSON(object.hardwareEncoder) : 0 };
  },

  toJSON(message: VideoConfiguration): unknown {
    const obj: any = {};
    if (message.hardwareEncoder !== 0) {
      obj.hardwareEncoder = clientConfigSettingToJSON(message.hardwareEncoder);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VideoConfiguration>, I>>(base?: I): VideoConfiguration {
    return VideoConfiguration.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VideoConfiguration>, I>>(object: I): VideoConfiguration {
    const message = createBaseVideoConfiguration();
    message.hardwareEncoder = object.hardwareEncoder ?? 0;
    return message;
  },
};

function createBaseDisabledCodecs(): DisabledCodecs {
  return { codecs: [], publish: [] };
}

export const DisabledCodecs = {
  encode(message: DisabledCodecs, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.codecs) {
      Codec.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.publish) {
      Codec.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DisabledCodecs {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDisabledCodecs();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.codecs.push(Codec.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.publish.push(Codec.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DisabledCodecs {
    return {
      codecs: globalThis.Array.isArray(object?.codecs) ? object.codecs.map((e: any) => Codec.fromJSON(e)) : [],
      publish: globalThis.Array.isArray(object?.publish) ? object.publish.map((e: any) => Codec.fromJSON(e)) : [],
    };
  },

  toJSON(message: DisabledCodecs): unknown {
    const obj: any = {};
    if (message.codecs?.length) {
      obj.codecs = message.codecs.map((e) => Codec.toJSON(e));
    }
    if (message.publish?.length) {
      obj.publish = message.publish.map((e) => Codec.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DisabledCodecs>, I>>(base?: I): DisabledCodecs {
    return DisabledCodecs.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DisabledCodecs>, I>>(object: I): DisabledCodecs {
    const message = createBaseDisabledCodecs();
    message.codecs = object.codecs?.map((e) => Codec.fromPartial(e)) || [];
    message.publish = object.publish?.map((e) => Codec.fromPartial(e)) || [];
    return message;
  },
};

function createBaseRTPDrift(): RTPDrift {
  return {
    startTime: undefined,
    endTime: undefined,
    duration: 0,
    startTimestamp: 0,
    endTimestamp: 0,
    rtpClockTicks: 0,
    driftSamples: 0,
    driftMs: 0,
    clockRate: 0,
  };
}

export const RTPDrift = {
  encode(message: RTPDrift, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.startTime !== undefined) {
      Timestamp.encode(toTimestamp(message.startTime), writer.uint32(10).fork()).ldelim();
    }
    if (message.endTime !== undefined) {
      Timestamp.encode(toTimestamp(message.endTime), writer.uint32(18).fork()).ldelim();
    }
    if (message.duration !== 0) {
      writer.uint32(25).double(message.duration);
    }
    if (message.startTimestamp !== 0) {
      writer.uint32(32).uint64(message.startTimestamp);
    }
    if (message.endTimestamp !== 0) {
      writer.uint32(40).uint64(message.endTimestamp);
    }
    if (message.rtpClockTicks !== 0) {
      writer.uint32(48).uint64(message.rtpClockTicks);
    }
    if (message.driftSamples !== 0) {
      writer.uint32(56).int64(message.driftSamples);
    }
    if (message.driftMs !== 0) {
      writer.uint32(65).double(message.driftMs);
    }
    if (message.clockRate !== 0) {
      writer.uint32(73).double(message.clockRate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RTPDrift {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRTPDrift();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.startTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.endTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }

          message.duration = reader.double();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.startTimestamp = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.endTimestamp = longToNumber(reader.uint64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.rtpClockTicks = longToNumber(reader.uint64() as Long);
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.driftSamples = longToNumber(reader.int64() as Long);
          continue;
        case 8:
          if (tag !== 65) {
            break;
          }

          message.driftMs = reader.double();
          continue;
        case 9:
          if (tag !== 73) {
            break;
          }

          message.clockRate = reader.double();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RTPDrift {
    return {
      startTime: isSet(object.startTime) ? fromJsonTimestamp(object.startTime) : undefined,
      endTime: isSet(object.endTime) ? fromJsonTimestamp(object.endTime) : undefined,
      duration: isSet(object.duration) ? globalThis.Number(object.duration) : 0,
      startTimestamp: isSet(object.startTimestamp) ? globalThis.Number(object.startTimestamp) : 0,
      endTimestamp: isSet(object.endTimestamp) ? globalThis.Number(object.endTimestamp) : 0,
      rtpClockTicks: isSet(object.rtpClockTicks) ? globalThis.Number(object.rtpClockTicks) : 0,
      driftSamples: isSet(object.driftSamples) ? globalThis.Number(object.driftSamples) : 0,
      driftMs: isSet(object.driftMs) ? globalThis.Number(object.driftMs) : 0,
      clockRate: isSet(object.clockRate) ? globalThis.Number(object.clockRate) : 0,
    };
  },

  toJSON(message: RTPDrift): unknown {
    const obj: any = {};
    if (message.startTime !== undefined) {
      obj.startTime = message.startTime.toISOString();
    }
    if (message.endTime !== undefined) {
      obj.endTime = message.endTime.toISOString();
    }
    if (message.duration !== 0) {
      obj.duration = message.duration;
    }
    if (message.startTimestamp !== 0) {
      obj.startTimestamp = Math.round(message.startTimestamp);
    }
    if (message.endTimestamp !== 0) {
      obj.endTimestamp = Math.round(message.endTimestamp);
    }
    if (message.rtpClockTicks !== 0) {
      obj.rtpClockTicks = Math.round(message.rtpClockTicks);
    }
    if (message.driftSamples !== 0) {
      obj.driftSamples = Math.round(message.driftSamples);
    }
    if (message.driftMs !== 0) {
      obj.driftMs = message.driftMs;
    }
    if (message.clockRate !== 0) {
      obj.clockRate = message.clockRate;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RTPDrift>, I>>(base?: I): RTPDrift {
    return RTPDrift.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RTPDrift>, I>>(object: I): RTPDrift {
    const message = createBaseRTPDrift();
    message.startTime = object.startTime ?? undefined;
    message.endTime = object.endTime ?? undefined;
    message.duration = object.duration ?? 0;
    message.startTimestamp = object.startTimestamp ?? 0;
    message.endTimestamp = object.endTimestamp ?? 0;
    message.rtpClockTicks = object.rtpClockTicks ?? 0;
    message.driftSamples = object.driftSamples ?? 0;
    message.driftMs = object.driftMs ?? 0;
    message.clockRate = object.clockRate ?? 0;
    return message;
  },
};

function createBaseRTPStats(): RTPStats {
  return {
    startTime: undefined,
    endTime: undefined,
    duration: 0,
    packets: 0,
    packetRate: 0,
    bytes: 0,
    headerBytes: 0,
    bitrate: 0,
    packetsLost: 0,
    packetLossRate: 0,
    packetLossPercentage: 0,
    packetsDuplicate: 0,
    packetDuplicateRate: 0,
    bytesDuplicate: 0,
    headerBytesDuplicate: 0,
    bitrateDuplicate: 0,
    packetsPadding: 0,
    packetPaddingRate: 0,
    bytesPadding: 0,
    headerBytesPadding: 0,
    bitratePadding: 0,
    packetsOutOfOrder: 0,
    frames: 0,
    frameRate: 0,
    jitterCurrent: 0,
    jitterMax: 0,
    gapHistogram: {},
    nacks: 0,
    nackAcks: 0,
    nackMisses: 0,
    nackRepeated: 0,
    plis: 0,
    lastPli: undefined,
    firs: 0,
    lastFir: undefined,
    rttCurrent: 0,
    rttMax: 0,
    keyFrames: 0,
    lastKeyFrame: undefined,
    layerLockPlis: 0,
    lastLayerLockPli: undefined,
    packetDrift: undefined,
    reportDrift: undefined,
  };
}

export const RTPStats = {
  encode(message: RTPStats, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.startTime !== undefined) {
      Timestamp.encode(toTimestamp(message.startTime), writer.uint32(10).fork()).ldelim();
    }
    if (message.endTime !== undefined) {
      Timestamp.encode(toTimestamp(message.endTime), writer.uint32(18).fork()).ldelim();
    }
    if (message.duration !== 0) {
      writer.uint32(25).double(message.duration);
    }
    if (message.packets !== 0) {
      writer.uint32(32).uint32(message.packets);
    }
    if (message.packetRate !== 0) {
      writer.uint32(41).double(message.packetRate);
    }
    if (message.bytes !== 0) {
      writer.uint32(48).uint64(message.bytes);
    }
    if (message.headerBytes !== 0) {
      writer.uint32(312).uint64(message.headerBytes);
    }
    if (message.bitrate !== 0) {
      writer.uint32(57).double(message.bitrate);
    }
    if (message.packetsLost !== 0) {
      writer.uint32(64).uint32(message.packetsLost);
    }
    if (message.packetLossRate !== 0) {
      writer.uint32(73).double(message.packetLossRate);
    }
    if (message.packetLossPercentage !== 0) {
      writer.uint32(85).float(message.packetLossPercentage);
    }
    if (message.packetsDuplicate !== 0) {
      writer.uint32(88).uint32(message.packetsDuplicate);
    }
    if (message.packetDuplicateRate !== 0) {
      writer.uint32(97).double(message.packetDuplicateRate);
    }
    if (message.bytesDuplicate !== 0) {
      writer.uint32(104).uint64(message.bytesDuplicate);
    }
    if (message.headerBytesDuplicate !== 0) {
      writer.uint32(320).uint64(message.headerBytesDuplicate);
    }
    if (message.bitrateDuplicate !== 0) {
      writer.uint32(113).double(message.bitrateDuplicate);
    }
    if (message.packetsPadding !== 0) {
      writer.uint32(120).uint32(message.packetsPadding);
    }
    if (message.packetPaddingRate !== 0) {
      writer.uint32(129).double(message.packetPaddingRate);
    }
    if (message.bytesPadding !== 0) {
      writer.uint32(136).uint64(message.bytesPadding);
    }
    if (message.headerBytesPadding !== 0) {
      writer.uint32(328).uint64(message.headerBytesPadding);
    }
    if (message.bitratePadding !== 0) {
      writer.uint32(145).double(message.bitratePadding);
    }
    if (message.packetsOutOfOrder !== 0) {
      writer.uint32(152).uint32(message.packetsOutOfOrder);
    }
    if (message.frames !== 0) {
      writer.uint32(160).uint32(message.frames);
    }
    if (message.frameRate !== 0) {
      writer.uint32(169).double(message.frameRate);
    }
    if (message.jitterCurrent !== 0) {
      writer.uint32(177).double(message.jitterCurrent);
    }
    if (message.jitterMax !== 0) {
      writer.uint32(185).double(message.jitterMax);
    }
    Object.entries(message.gapHistogram).forEach(([key, value]) => {
      RTPStats_GapHistogramEntry.encode({ key: key as any, value }, writer.uint32(194).fork()).ldelim();
    });
    if (message.nacks !== 0) {
      writer.uint32(200).uint32(message.nacks);
    }
    if (message.nackAcks !== 0) {
      writer.uint32(296).uint32(message.nackAcks);
    }
    if (message.nackMisses !== 0) {
      writer.uint32(208).uint32(message.nackMisses);
    }
    if (message.nackRepeated !== 0) {
      writer.uint32(304).uint32(message.nackRepeated);
    }
    if (message.plis !== 0) {
      writer.uint32(216).uint32(message.plis);
    }
    if (message.lastPli !== undefined) {
      Timestamp.encode(toTimestamp(message.lastPli), writer.uint32(226).fork()).ldelim();
    }
    if (message.firs !== 0) {
      writer.uint32(232).uint32(message.firs);
    }
    if (message.lastFir !== undefined) {
      Timestamp.encode(toTimestamp(message.lastFir), writer.uint32(242).fork()).ldelim();
    }
    if (message.rttCurrent !== 0) {
      writer.uint32(248).uint32(message.rttCurrent);
    }
    if (message.rttMax !== 0) {
      writer.uint32(256).uint32(message.rttMax);
    }
    if (message.keyFrames !== 0) {
      writer.uint32(264).uint32(message.keyFrames);
    }
    if (message.lastKeyFrame !== undefined) {
      Timestamp.encode(toTimestamp(message.lastKeyFrame), writer.uint32(274).fork()).ldelim();
    }
    if (message.layerLockPlis !== 0) {
      writer.uint32(280).uint32(message.layerLockPlis);
    }
    if (message.lastLayerLockPli !== undefined) {
      Timestamp.encode(toTimestamp(message.lastLayerLockPli), writer.uint32(290).fork()).ldelim();
    }
    if (message.packetDrift !== undefined) {
      RTPDrift.encode(message.packetDrift, writer.uint32(354).fork()).ldelim();
    }
    if (message.reportDrift !== undefined) {
      RTPDrift.encode(message.reportDrift, writer.uint32(362).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RTPStats {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRTPStats();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.startTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.endTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }

          message.duration = reader.double();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.packets = reader.uint32();
          continue;
        case 5:
          if (tag !== 41) {
            break;
          }

          message.packetRate = reader.double();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.bytes = longToNumber(reader.uint64() as Long);
          continue;
        case 39:
          if (tag !== 312) {
            break;
          }

          message.headerBytes = longToNumber(reader.uint64() as Long);
          continue;
        case 7:
          if (tag !== 57) {
            break;
          }

          message.bitrate = reader.double();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.packetsLost = reader.uint32();
          continue;
        case 9:
          if (tag !== 73) {
            break;
          }

          message.packetLossRate = reader.double();
          continue;
        case 10:
          if (tag !== 85) {
            break;
          }

          message.packetLossPercentage = reader.float();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.packetsDuplicate = reader.uint32();
          continue;
        case 12:
          if (tag !== 97) {
            break;
          }

          message.packetDuplicateRate = reader.double();
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.bytesDuplicate = longToNumber(reader.uint64() as Long);
          continue;
        case 40:
          if (tag !== 320) {
            break;
          }

          message.headerBytesDuplicate = longToNumber(reader.uint64() as Long);
          continue;
        case 14:
          if (tag !== 113) {
            break;
          }

          message.bitrateDuplicate = reader.double();
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }

          message.packetsPadding = reader.uint32();
          continue;
        case 16:
          if (tag !== 129) {
            break;
          }

          message.packetPaddingRate = reader.double();
          continue;
        case 17:
          if (tag !== 136) {
            break;
          }

          message.bytesPadding = longToNumber(reader.uint64() as Long);
          continue;
        case 41:
          if (tag !== 328) {
            break;
          }

          message.headerBytesPadding = longToNumber(reader.uint64() as Long);
          continue;
        case 18:
          if (tag !== 145) {
            break;
          }

          message.bitratePadding = reader.double();
          continue;
        case 19:
          if (tag !== 152) {
            break;
          }

          message.packetsOutOfOrder = reader.uint32();
          continue;
        case 20:
          if (tag !== 160) {
            break;
          }

          message.frames = reader.uint32();
          continue;
        case 21:
          if (tag !== 169) {
            break;
          }

          message.frameRate = reader.double();
          continue;
        case 22:
          if (tag !== 177) {
            break;
          }

          message.jitterCurrent = reader.double();
          continue;
        case 23:
          if (tag !== 185) {
            break;
          }

          message.jitterMax = reader.double();
          continue;
        case 24:
          if (tag !== 194) {
            break;
          }

          const entry24 = RTPStats_GapHistogramEntry.decode(reader, reader.uint32());
          if (entry24.value !== undefined) {
            message.gapHistogram[entry24.key] = entry24.value;
          }
          continue;
        case 25:
          if (tag !== 200) {
            break;
          }

          message.nacks = reader.uint32();
          continue;
        case 37:
          if (tag !== 296) {
            break;
          }

          message.nackAcks = reader.uint32();
          continue;
        case 26:
          if (tag !== 208) {
            break;
          }

          message.nackMisses = reader.uint32();
          continue;
        case 38:
          if (tag !== 304) {
            break;
          }

          message.nackRepeated = reader.uint32();
          continue;
        case 27:
          if (tag !== 216) {
            break;
          }

          message.plis = reader.uint32();
          continue;
        case 28:
          if (tag !== 226) {
            break;
          }

          message.lastPli = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 29:
          if (tag !== 232) {
            break;
          }

          message.firs = reader.uint32();
          continue;
        case 30:
          if (tag !== 242) {
            break;
          }

          message.lastFir = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 31:
          if (tag !== 248) {
            break;
          }

          message.rttCurrent = reader.uint32();
          continue;
        case 32:
          if (tag !== 256) {
            break;
          }

          message.rttMax = reader.uint32();
          continue;
        case 33:
          if (tag !== 264) {
            break;
          }

          message.keyFrames = reader.uint32();
          continue;
        case 34:
          if (tag !== 274) {
            break;
          }

          message.lastKeyFrame = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 35:
          if (tag !== 280) {
            break;
          }

          message.layerLockPlis = reader.uint32();
          continue;
        case 36:
          if (tag !== 290) {
            break;
          }

          message.lastLayerLockPli = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 44:
          if (tag !== 354) {
            break;
          }

          message.packetDrift = RTPDrift.decode(reader, reader.uint32());
          continue;
        case 45:
          if (tag !== 362) {
            break;
          }

          message.reportDrift = RTPDrift.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RTPStats {
    return {
      startTime: isSet(object.startTime) ? fromJsonTimestamp(object.startTime) : undefined,
      endTime: isSet(object.endTime) ? fromJsonTimestamp(object.endTime) : undefined,
      duration: isSet(object.duration) ? globalThis.Number(object.duration) : 0,
      packets: isSet(object.packets) ? globalThis.Number(object.packets) : 0,
      packetRate: isSet(object.packetRate) ? globalThis.Number(object.packetRate) : 0,
      bytes: isSet(object.bytes) ? globalThis.Number(object.bytes) : 0,
      headerBytes: isSet(object.headerBytes) ? globalThis.Number(object.headerBytes) : 0,
      bitrate: isSet(object.bitrate) ? globalThis.Number(object.bitrate) : 0,
      packetsLost: isSet(object.packetsLost) ? globalThis.Number(object.packetsLost) : 0,
      packetLossRate: isSet(object.packetLossRate) ? globalThis.Number(object.packetLossRate) : 0,
      packetLossPercentage: isSet(object.packetLossPercentage) ? globalThis.Number(object.packetLossPercentage) : 0,
      packetsDuplicate: isSet(object.packetsDuplicate) ? globalThis.Number(object.packetsDuplicate) : 0,
      packetDuplicateRate: isSet(object.packetDuplicateRate) ? globalThis.Number(object.packetDuplicateRate) : 0,
      bytesDuplicate: isSet(object.bytesDuplicate) ? globalThis.Number(object.bytesDuplicate) : 0,
      headerBytesDuplicate: isSet(object.headerBytesDuplicate) ? globalThis.Number(object.headerBytesDuplicate) : 0,
      bitrateDuplicate: isSet(object.bitrateDuplicate) ? globalThis.Number(object.bitrateDuplicate) : 0,
      packetsPadding: isSet(object.packetsPadding) ? globalThis.Number(object.packetsPadding) : 0,
      packetPaddingRate: isSet(object.packetPaddingRate) ? globalThis.Number(object.packetPaddingRate) : 0,
      bytesPadding: isSet(object.bytesPadding) ? globalThis.Number(object.bytesPadding) : 0,
      headerBytesPadding: isSet(object.headerBytesPadding) ? globalThis.Number(object.headerBytesPadding) : 0,
      bitratePadding: isSet(object.bitratePadding) ? globalThis.Number(object.bitratePadding) : 0,
      packetsOutOfOrder: isSet(object.packetsOutOfOrder) ? globalThis.Number(object.packetsOutOfOrder) : 0,
      frames: isSet(object.frames) ? globalThis.Number(object.frames) : 0,
      frameRate: isSet(object.frameRate) ? globalThis.Number(object.frameRate) : 0,
      jitterCurrent: isSet(object.jitterCurrent) ? globalThis.Number(object.jitterCurrent) : 0,
      jitterMax: isSet(object.jitterMax) ? globalThis.Number(object.jitterMax) : 0,
      gapHistogram: isObject(object.gapHistogram)
        ? Object.entries(object.gapHistogram).reduce<{ [key: number]: number }>((acc, [key, value]) => {
          acc[globalThis.Number(key)] = Number(value);
          return acc;
        }, {})
        : {},
      nacks: isSet(object.nacks) ? globalThis.Number(object.nacks) : 0,
      nackAcks: isSet(object.nackAcks) ? globalThis.Number(object.nackAcks) : 0,
      nackMisses: isSet(object.nackMisses) ? globalThis.Number(object.nackMisses) : 0,
      nackRepeated: isSet(object.nackRepeated) ? globalThis.Number(object.nackRepeated) : 0,
      plis: isSet(object.plis) ? globalThis.Number(object.plis) : 0,
      lastPli: isSet(object.lastPli) ? fromJsonTimestamp(object.lastPli) : undefined,
      firs: isSet(object.firs) ? globalThis.Number(object.firs) : 0,
      lastFir: isSet(object.lastFir) ? fromJsonTimestamp(object.lastFir) : undefined,
      rttCurrent: isSet(object.rttCurrent) ? globalThis.Number(object.rttCurrent) : 0,
      rttMax: isSet(object.rttMax) ? globalThis.Number(object.rttMax) : 0,
      keyFrames: isSet(object.keyFrames) ? globalThis.Number(object.keyFrames) : 0,
      lastKeyFrame: isSet(object.lastKeyFrame) ? fromJsonTimestamp(object.lastKeyFrame) : undefined,
      layerLockPlis: isSet(object.layerLockPlis) ? globalThis.Number(object.layerLockPlis) : 0,
      lastLayerLockPli: isSet(object.lastLayerLockPli) ? fromJsonTimestamp(object.lastLayerLockPli) : undefined,
      packetDrift: isSet(object.packetDrift) ? RTPDrift.fromJSON(object.packetDrift) : undefined,
      reportDrift: isSet(object.reportDrift) ? RTPDrift.fromJSON(object.reportDrift) : undefined,
    };
  },

  toJSON(message: RTPStats): unknown {
    const obj: any = {};
    if (message.startTime !== undefined) {
      obj.startTime = message.startTime.toISOString();
    }
    if (message.endTime !== undefined) {
      obj.endTime = message.endTime.toISOString();
    }
    if (message.duration !== 0) {
      obj.duration = message.duration;
    }
    if (message.packets !== 0) {
      obj.packets = Math.round(message.packets);
    }
    if (message.packetRate !== 0) {
      obj.packetRate = message.packetRate;
    }
    if (message.bytes !== 0) {
      obj.bytes = Math.round(message.bytes);
    }
    if (message.headerBytes !== 0) {
      obj.headerBytes = Math.round(message.headerBytes);
    }
    if (message.bitrate !== 0) {
      obj.bitrate = message.bitrate;
    }
    if (message.packetsLost !== 0) {
      obj.packetsLost = Math.round(message.packetsLost);
    }
    if (message.packetLossRate !== 0) {
      obj.packetLossRate = message.packetLossRate;
    }
    if (message.packetLossPercentage !== 0) {
      obj.packetLossPercentage = message.packetLossPercentage;
    }
    if (message.packetsDuplicate !== 0) {
      obj.packetsDuplicate = Math.round(message.packetsDuplicate);
    }
    if (message.packetDuplicateRate !== 0) {
      obj.packetDuplicateRate = message.packetDuplicateRate;
    }
    if (message.bytesDuplicate !== 0) {
      obj.bytesDuplicate = Math.round(message.bytesDuplicate);
    }
    if (message.headerBytesDuplicate !== 0) {
      obj.headerBytesDuplicate = Math.round(message.headerBytesDuplicate);
    }
    if (message.bitrateDuplicate !== 0) {
      obj.bitrateDuplicate = message.bitrateDuplicate;
    }
    if (message.packetsPadding !== 0) {
      obj.packetsPadding = Math.round(message.packetsPadding);
    }
    if (message.packetPaddingRate !== 0) {
      obj.packetPaddingRate = message.packetPaddingRate;
    }
    if (message.bytesPadding !== 0) {
      obj.bytesPadding = Math.round(message.bytesPadding);
    }
    if (message.headerBytesPadding !== 0) {
      obj.headerBytesPadding = Math.round(message.headerBytesPadding);
    }
    if (message.bitratePadding !== 0) {
      obj.bitratePadding = message.bitratePadding;
    }
    if (message.packetsOutOfOrder !== 0) {
      obj.packetsOutOfOrder = Math.round(message.packetsOutOfOrder);
    }
    if (message.frames !== 0) {
      obj.frames = Math.round(message.frames);
    }
    if (message.frameRate !== 0) {
      obj.frameRate = message.frameRate;
    }
    if (message.jitterCurrent !== 0) {
      obj.jitterCurrent = message.jitterCurrent;
    }
    if (message.jitterMax !== 0) {
      obj.jitterMax = message.jitterMax;
    }
    if (message.gapHistogram) {
      const entries = Object.entries(message.gapHistogram);
      if (entries.length > 0) {
        obj.gapHistogram = {};
        entries.forEach(([k, v]) => {
          obj.gapHistogram[k] = Math.round(v);
        });
      }
    }
    if (message.nacks !== 0) {
      obj.nacks = Math.round(message.nacks);
    }
    if (message.nackAcks !== 0) {
      obj.nackAcks = Math.round(message.nackAcks);
    }
    if (message.nackMisses !== 0) {
      obj.nackMisses = Math.round(message.nackMisses);
    }
    if (message.nackRepeated !== 0) {
      obj.nackRepeated = Math.round(message.nackRepeated);
    }
    if (message.plis !== 0) {
      obj.plis = Math.round(message.plis);
    }
    if (message.lastPli !== undefined) {
      obj.lastPli = message.lastPli.toISOString();
    }
    if (message.firs !== 0) {
      obj.firs = Math.round(message.firs);
    }
    if (message.lastFir !== undefined) {
      obj.lastFir = message.lastFir.toISOString();
    }
    if (message.rttCurrent !== 0) {
      obj.rttCurrent = Math.round(message.rttCurrent);
    }
    if (message.rttMax !== 0) {
      obj.rttMax = Math.round(message.rttMax);
    }
    if (message.keyFrames !== 0) {
      obj.keyFrames = Math.round(message.keyFrames);
    }
    if (message.lastKeyFrame !== undefined) {
      obj.lastKeyFrame = message.lastKeyFrame.toISOString();
    }
    if (message.layerLockPlis !== 0) {
      obj.layerLockPlis = Math.round(message.layerLockPlis);
    }
    if (message.lastLayerLockPli !== undefined) {
      obj.lastLayerLockPli = message.lastLayerLockPli.toISOString();
    }
    if (message.packetDrift !== undefined) {
      obj.packetDrift = RTPDrift.toJSON(message.packetDrift);
    }
    if (message.reportDrift !== undefined) {
      obj.reportDrift = RTPDrift.toJSON(message.reportDrift);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RTPStats>, I>>(base?: I): RTPStats {
    return RTPStats.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RTPStats>, I>>(object: I): RTPStats {
    const message = createBaseRTPStats();
    message.startTime = object.startTime ?? undefined;
    message.endTime = object.endTime ?? undefined;
    message.duration = object.duration ?? 0;
    message.packets = object.packets ?? 0;
    message.packetRate = object.packetRate ?? 0;
    message.bytes = object.bytes ?? 0;
    message.headerBytes = object.headerBytes ?? 0;
    message.bitrate = object.bitrate ?? 0;
    message.packetsLost = object.packetsLost ?? 0;
    message.packetLossRate = object.packetLossRate ?? 0;
    message.packetLossPercentage = object.packetLossPercentage ?? 0;
    message.packetsDuplicate = object.packetsDuplicate ?? 0;
    message.packetDuplicateRate = object.packetDuplicateRate ?? 0;
    message.bytesDuplicate = object.bytesDuplicate ?? 0;
    message.headerBytesDuplicate = object.headerBytesDuplicate ?? 0;
    message.bitrateDuplicate = object.bitrateDuplicate ?? 0;
    message.packetsPadding = object.packetsPadding ?? 0;
    message.packetPaddingRate = object.packetPaddingRate ?? 0;
    message.bytesPadding = object.bytesPadding ?? 0;
    message.headerBytesPadding = object.headerBytesPadding ?? 0;
    message.bitratePadding = object.bitratePadding ?? 0;
    message.packetsOutOfOrder = object.packetsOutOfOrder ?? 0;
    message.frames = object.frames ?? 0;
    message.frameRate = object.frameRate ?? 0;
    message.jitterCurrent = object.jitterCurrent ?? 0;
    message.jitterMax = object.jitterMax ?? 0;
    message.gapHistogram = Object.entries(object.gapHistogram ?? {}).reduce<{ [key: number]: number }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[globalThis.Number(key)] = globalThis.Number(value);
        }
        return acc;
      },
      {},
    );
    message.nacks = object.nacks ?? 0;
    message.nackAcks = object.nackAcks ?? 0;
    message.nackMisses = object.nackMisses ?? 0;
    message.nackRepeated = object.nackRepeated ?? 0;
    message.plis = object.plis ?? 0;
    message.lastPli = object.lastPli ?? undefined;
    message.firs = object.firs ?? 0;
    message.lastFir = object.lastFir ?? undefined;
    message.rttCurrent = object.rttCurrent ?? 0;
    message.rttMax = object.rttMax ?? 0;
    message.keyFrames = object.keyFrames ?? 0;
    message.lastKeyFrame = object.lastKeyFrame ?? undefined;
    message.layerLockPlis = object.layerLockPlis ?? 0;
    message.lastLayerLockPli = object.lastLayerLockPli ?? undefined;
    message.packetDrift = (object.packetDrift !== undefined && object.packetDrift !== null)
      ? RTPDrift.fromPartial(object.packetDrift)
      : undefined;
    message.reportDrift = (object.reportDrift !== undefined && object.reportDrift !== null)
      ? RTPDrift.fromPartial(object.reportDrift)
      : undefined;
    return message;
  },
};

function createBaseRTPStats_GapHistogramEntry(): RTPStats_GapHistogramEntry {
  return { key: 0, value: 0 };
}

export const RTPStats_GapHistogramEntry = {
  encode(message: RTPStats_GapHistogramEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== 0) {
      writer.uint32(8).int32(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).uint32(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RTPStats_GapHistogramEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRTPStats_GapHistogramEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.key = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.value = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RTPStats_GapHistogramEntry {
    return {
      key: isSet(object.key) ? globalThis.Number(object.key) : 0,
      value: isSet(object.value) ? globalThis.Number(object.value) : 0,
    };
  },

  toJSON(message: RTPStats_GapHistogramEntry): unknown {
    const obj: any = {};
    if (message.key !== 0) {
      obj.key = Math.round(message.key);
    }
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RTPStats_GapHistogramEntry>, I>>(base?: I): RTPStats_GapHistogramEntry {
    return RTPStats_GapHistogramEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RTPStats_GapHistogramEntry>, I>>(object: I): RTPStats_GapHistogramEntry {
    const message = createBaseRTPStats_GapHistogramEntry();
    message.key = object.key ?? 0;
    message.value = object.value ?? 0;
    return message;
  },
};

function createBaseTimedVersion(): TimedVersion {
  return { unixMicro: 0, ticks: 0 };
}

export const TimedVersion = {
  encode(message: TimedVersion, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.unixMicro !== 0) {
      writer.uint32(8).int64(message.unixMicro);
    }
    if (message.ticks !== 0) {
      writer.uint32(16).int32(message.ticks);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TimedVersion {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimedVersion();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.unixMicro = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.ticks = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TimedVersion {
    return {
      unixMicro: isSet(object.unixMicro) ? globalThis.Number(object.unixMicro) : 0,
      ticks: isSet(object.ticks) ? globalThis.Number(object.ticks) : 0,
    };
  },

  toJSON(message: TimedVersion): unknown {
    const obj: any = {};
    if (message.unixMicro !== 0) {
      obj.unixMicro = Math.round(message.unixMicro);
    }
    if (message.ticks !== 0) {
      obj.ticks = Math.round(message.ticks);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TimedVersion>, I>>(base?: I): TimedVersion {
    return TimedVersion.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TimedVersion>, I>>(object: I): TimedVersion {
    const message = createBaseTimedVersion();
    message.unixMicro = object.unixMicro ?? 0;
    message.ticks = object.ticks ?? 0;
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof globalThis.Date) {
    return o;
  } else if (typeof o === "string") {
    return new globalThis.Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
