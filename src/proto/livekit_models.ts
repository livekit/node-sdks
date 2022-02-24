/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "livekit";

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
    default:
      return "UNKNOWN";
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
    default:
      return "UNKNOWN";
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
    default:
      return "UNKNOWN";
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
    default:
      return "UNKNOWN";
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
  activeRecording: boolean;
}

export interface Codec {
  mime: string;
  fmtpLine: string;
}

export interface ParticipantInfo {
  sid: string;
  identity: string;
  state: ParticipantInfo_State;
  tracks: TrackInfo[];
  metadata: string;
  /** timestamp when participant joined room, in seconds */
  joinedAt: number;
  hidden: boolean;
  recorder: boolean;
  name: string;
  version: number;
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

export function participantInfo_StateFromJSON(
  object: any
): ParticipantInfo_State {
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

export function participantInfo_StateToJSON(
  object: ParticipantInfo_State
): string {
  switch (object) {
    case ParticipantInfo_State.JOINING:
      return "JOINING";
    case ParticipantInfo_State.JOINED:
      return "JOINED";
    case ParticipantInfo_State.ACTIVE:
      return "ACTIVE";
    case ParticipantInfo_State.DISCONNECTED:
      return "DISCONNECTED";
    default:
      return "UNKNOWN";
  }
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
}

/** provide information about available spatial layers */
export interface VideoLayer {
  /** for tracks with a single layer, this should be HIGH */
  quality: VideoQuality;
  width: number;
  height: number;
  /** target bitrate, server will measure actual */
  bitrate: number;
  ssrc: number;
}

/** new DataPacket API */
export interface DataPacket {
  kind: DataPacket_Kind;
  user?: UserPacket | undefined;
  speaker?: ActiveSpeakerUpdate | undefined;
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
    default:
      return "UNKNOWN";
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
  /** user defined payload */
  payload: Uint8Array;
  /** the ID of the participants who will receive the message (the message will be sent to all the people in the room if this variable is empty) */
  destinationSids: string[];
}

export interface ParticipantTracks {
  /** participant ID of participant to whom the tracks belong */
  participantSid: string;
  trackSids: string[];
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
}

export enum ClientInfo_SDK {
  UNKNOWN = 0,
  JS = 1,
  SWIFT = 2,
  ANDROID = 3,
  FLUTTER = 4,
  GO = 5,
  UNITY = 6,
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
    default:
      return "UNKNOWN";
  }
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
    if (message.activeRecording === true) {
      writer.uint32(80).bool(message.activeRecording);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Room {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRoom();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sid = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.emptyTimeout = reader.uint32();
          break;
        case 4:
          message.maxParticipants = reader.uint32();
          break;
        case 5:
          message.creationTime = longToNumber(reader.int64() as Long);
          break;
        case 6:
          message.turnPassword = reader.string();
          break;
        case 7:
          message.enabledCodecs.push(Codec.decode(reader, reader.uint32()));
          break;
        case 8:
          message.metadata = reader.string();
          break;
        case 9:
          message.numParticipants = reader.uint32();
          break;
        case 10:
          message.activeRecording = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Room {
    const message = createBaseRoom();
    message.sid =
      object.sid !== undefined && object.sid !== null ? String(object.sid) : "";
    message.name =
      object.name !== undefined && object.name !== null
        ? String(object.name)
        : "";
    message.emptyTimeout =
      object.emptyTimeout !== undefined && object.emptyTimeout !== null
        ? Number(object.emptyTimeout)
        : 0;
    message.maxParticipants =
      object.maxParticipants !== undefined && object.maxParticipants !== null
        ? Number(object.maxParticipants)
        : 0;
    message.creationTime =
      object.creationTime !== undefined && object.creationTime !== null
        ? Number(object.creationTime)
        : 0;
    message.turnPassword =
      object.turnPassword !== undefined && object.turnPassword !== null
        ? String(object.turnPassword)
        : "";
    message.enabledCodecs = (object.enabledCodecs ?? []).map((e: any) =>
      Codec.fromJSON(e)
    );
    message.metadata =
      object.metadata !== undefined && object.metadata !== null
        ? String(object.metadata)
        : "";
    message.numParticipants =
      object.numParticipants !== undefined && object.numParticipants !== null
        ? Number(object.numParticipants)
        : 0;
    message.activeRecording =
      object.activeRecording !== undefined && object.activeRecording !== null
        ? Boolean(object.activeRecording)
        : false;
    return message;
  },

  toJSON(message: Room): unknown {
    const obj: any = {};
    message.sid !== undefined && (obj.sid = message.sid);
    message.name !== undefined && (obj.name = message.name);
    message.emptyTimeout !== undefined &&
      (obj.emptyTimeout = Math.round(message.emptyTimeout));
    message.maxParticipants !== undefined &&
      (obj.maxParticipants = Math.round(message.maxParticipants));
    message.creationTime !== undefined &&
      (obj.creationTime = Math.round(message.creationTime));
    message.turnPassword !== undefined &&
      (obj.turnPassword = message.turnPassword);
    if (message.enabledCodecs) {
      obj.enabledCodecs = message.enabledCodecs.map((e) =>
        e ? Codec.toJSON(e) : undefined
      );
    } else {
      obj.enabledCodecs = [];
    }
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.numParticipants !== undefined &&
      (obj.numParticipants = Math.round(message.numParticipants));
    message.activeRecording !== undefined &&
      (obj.activeRecording = message.activeRecording);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Room>, I>>(object: I): Room {
    const message = createBaseRoom();
    message.sid = object.sid ?? "";
    message.name = object.name ?? "";
    message.emptyTimeout = object.emptyTimeout ?? 0;
    message.maxParticipants = object.maxParticipants ?? 0;
    message.creationTime = object.creationTime ?? 0;
    message.turnPassword = object.turnPassword ?? "";
    message.enabledCodecs =
      object.enabledCodecs?.map((e) => Codec.fromPartial(e)) || [];
    message.metadata = object.metadata ?? "";
    message.numParticipants = object.numParticipants ?? 0;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCodec();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mime = reader.string();
          break;
        case 2:
          message.fmtpLine = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Codec {
    const message = createBaseCodec();
    message.mime =
      object.mime !== undefined && object.mime !== null
        ? String(object.mime)
        : "";
    message.fmtpLine =
      object.fmtpLine !== undefined && object.fmtpLine !== null
        ? String(object.fmtpLine)
        : "";
    return message;
  },

  toJSON(message: Codec): unknown {
    const obj: any = {};
    message.mime !== undefined && (obj.mime = message.mime);
    message.fmtpLine !== undefined && (obj.fmtpLine = message.fmtpLine);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Codec>, I>>(object: I): Codec {
    const message = createBaseCodec();
    message.mime = object.mime ?? "";
    message.fmtpLine = object.fmtpLine ?? "";
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
    hidden: false,
    recorder: false,
    name: "",
    version: 0,
  };
}

export const ParticipantInfo = {
  encode(
    message: ParticipantInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    if (message.hidden === true) {
      writer.uint32(56).bool(message.hidden);
    }
    if (message.recorder === true) {
      writer.uint32(64).bool(message.recorder);
    }
    if (message.name !== "") {
      writer.uint32(74).string(message.name);
    }
    if (message.version !== 0) {
      writer.uint32(80).uint32(message.version);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParticipantInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParticipantInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sid = reader.string();
          break;
        case 2:
          message.identity = reader.string();
          break;
        case 3:
          message.state = reader.int32() as any;
          break;
        case 4:
          message.tracks.push(TrackInfo.decode(reader, reader.uint32()));
          break;
        case 5:
          message.metadata = reader.string();
          break;
        case 6:
          message.joinedAt = longToNumber(reader.int64() as Long);
          break;
        case 7:
          message.hidden = reader.bool();
          break;
        case 8:
          message.recorder = reader.bool();
          break;
        case 9:
          message.name = reader.string();
          break;
        case 10:
          message.version = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ParticipantInfo {
    const message = createBaseParticipantInfo();
    message.sid =
      object.sid !== undefined && object.sid !== null ? String(object.sid) : "";
    message.identity =
      object.identity !== undefined && object.identity !== null
        ? String(object.identity)
        : "";
    message.state =
      object.state !== undefined && object.state !== null
        ? participantInfo_StateFromJSON(object.state)
        : 0;
    message.tracks = (object.tracks ?? []).map((e: any) =>
      TrackInfo.fromJSON(e)
    );
    message.metadata =
      object.metadata !== undefined && object.metadata !== null
        ? String(object.metadata)
        : "";
    message.joinedAt =
      object.joinedAt !== undefined && object.joinedAt !== null
        ? Number(object.joinedAt)
        : 0;
    message.hidden =
      object.hidden !== undefined && object.hidden !== null
        ? Boolean(object.hidden)
        : false;
    message.recorder =
      object.recorder !== undefined && object.recorder !== null
        ? Boolean(object.recorder)
        : false;
    message.name =
      object.name !== undefined && object.name !== null
        ? String(object.name)
        : "";
    message.version =
      object.version !== undefined && object.version !== null
        ? Number(object.version)
        : 0;
    return message;
  },

  toJSON(message: ParticipantInfo): unknown {
    const obj: any = {};
    message.sid !== undefined && (obj.sid = message.sid);
    message.identity !== undefined && (obj.identity = message.identity);
    message.state !== undefined &&
      (obj.state = participantInfo_StateToJSON(message.state));
    if (message.tracks) {
      obj.tracks = message.tracks.map((e) =>
        e ? TrackInfo.toJSON(e) : undefined
      );
    } else {
      obj.tracks = [];
    }
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.joinedAt !== undefined &&
      (obj.joinedAt = Math.round(message.joinedAt));
    message.hidden !== undefined && (obj.hidden = message.hidden);
    message.recorder !== undefined && (obj.recorder = message.recorder);
    message.name !== undefined && (obj.name = message.name);
    message.version !== undefined &&
      (obj.version = Math.round(message.version));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ParticipantInfo>, I>>(
    object: I
  ): ParticipantInfo {
    const message = createBaseParticipantInfo();
    message.sid = object.sid ?? "";
    message.identity = object.identity ?? "";
    message.state = object.state ?? 0;
    message.tracks = object.tracks?.map((e) => TrackInfo.fromPartial(e)) || [];
    message.metadata = object.metadata ?? "";
    message.joinedAt = object.joinedAt ?? 0;
    message.hidden = object.hidden ?? false;
    message.recorder = object.recorder ?? false;
    message.name = object.name ?? "";
    message.version = object.version ?? 0;
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
  };
}

export const TrackInfo = {
  encode(
    message: TrackInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TrackInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrackInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sid = reader.string();
          break;
        case 2:
          message.type = reader.int32() as any;
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          message.muted = reader.bool();
          break;
        case 5:
          message.width = reader.uint32();
          break;
        case 6:
          message.height = reader.uint32();
          break;
        case 7:
          message.simulcast = reader.bool();
          break;
        case 8:
          message.disableDtx = reader.bool();
          break;
        case 9:
          message.source = reader.int32() as any;
          break;
        case 10:
          message.layers.push(VideoLayer.decode(reader, reader.uint32()));
          break;
        case 11:
          message.mimeType = reader.string();
          break;
        case 12:
          message.mid = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TrackInfo {
    const message = createBaseTrackInfo();
    message.sid =
      object.sid !== undefined && object.sid !== null ? String(object.sid) : "";
    message.type =
      object.type !== undefined && object.type !== null
        ? trackTypeFromJSON(object.type)
        : 0;
    message.name =
      object.name !== undefined && object.name !== null
        ? String(object.name)
        : "";
    message.muted =
      object.muted !== undefined && object.muted !== null
        ? Boolean(object.muted)
        : false;
    message.width =
      object.width !== undefined && object.width !== null
        ? Number(object.width)
        : 0;
    message.height =
      object.height !== undefined && object.height !== null
        ? Number(object.height)
        : 0;
    message.simulcast =
      object.simulcast !== undefined && object.simulcast !== null
        ? Boolean(object.simulcast)
        : false;
    message.disableDtx =
      object.disableDtx !== undefined && object.disableDtx !== null
        ? Boolean(object.disableDtx)
        : false;
    message.source =
      object.source !== undefined && object.source !== null
        ? trackSourceFromJSON(object.source)
        : 0;
    message.layers = (object.layers ?? []).map((e: any) =>
      VideoLayer.fromJSON(e)
    );
    message.mimeType =
      object.mimeType !== undefined && object.mimeType !== null
        ? String(object.mimeType)
        : "";
    message.mid =
      object.mid !== undefined && object.mid !== null ? String(object.mid) : "";
    return message;
  },

  toJSON(message: TrackInfo): unknown {
    const obj: any = {};
    message.sid !== undefined && (obj.sid = message.sid);
    message.type !== undefined && (obj.type = trackTypeToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    message.muted !== undefined && (obj.muted = message.muted);
    message.width !== undefined && (obj.width = Math.round(message.width));
    message.height !== undefined && (obj.height = Math.round(message.height));
    message.simulcast !== undefined && (obj.simulcast = message.simulcast);
    message.disableDtx !== undefined && (obj.disableDtx = message.disableDtx);
    message.source !== undefined &&
      (obj.source = trackSourceToJSON(message.source));
    if (message.layers) {
      obj.layers = message.layers.map((e) =>
        e ? VideoLayer.toJSON(e) : undefined
      );
    } else {
      obj.layers = [];
    }
    message.mimeType !== undefined && (obj.mimeType = message.mimeType);
    message.mid !== undefined && (obj.mid = message.mid);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TrackInfo>, I>>(
    object: I
  ): TrackInfo {
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
    return message;
  },
};

function createBaseVideoLayer(): VideoLayer {
  return { quality: 0, width: 0, height: 0, bitrate: 0, ssrc: 0 };
}

export const VideoLayer = {
  encode(
    message: VideoLayer,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVideoLayer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.quality = reader.int32() as any;
          break;
        case 2:
          message.width = reader.uint32();
          break;
        case 3:
          message.height = reader.uint32();
          break;
        case 4:
          message.bitrate = reader.uint32();
          break;
        case 5:
          message.ssrc = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): VideoLayer {
    const message = createBaseVideoLayer();
    message.quality =
      object.quality !== undefined && object.quality !== null
        ? videoQualityFromJSON(object.quality)
        : 0;
    message.width =
      object.width !== undefined && object.width !== null
        ? Number(object.width)
        : 0;
    message.height =
      object.height !== undefined && object.height !== null
        ? Number(object.height)
        : 0;
    message.bitrate =
      object.bitrate !== undefined && object.bitrate !== null
        ? Number(object.bitrate)
        : 0;
    message.ssrc =
      object.ssrc !== undefined && object.ssrc !== null
        ? Number(object.ssrc)
        : 0;
    return message;
  },

  toJSON(message: VideoLayer): unknown {
    const obj: any = {};
    message.quality !== undefined &&
      (obj.quality = videoQualityToJSON(message.quality));
    message.width !== undefined && (obj.width = Math.round(message.width));
    message.height !== undefined && (obj.height = Math.round(message.height));
    message.bitrate !== undefined &&
      (obj.bitrate = Math.round(message.bitrate));
    message.ssrc !== undefined && (obj.ssrc = Math.round(message.ssrc));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<VideoLayer>, I>>(
    object: I
  ): VideoLayer {
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
  return { kind: 0, user: undefined, speaker: undefined };
}

export const DataPacket = {
  encode(
    message: DataPacket,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.kind !== 0) {
      writer.uint32(8).int32(message.kind);
    }
    if (message.user !== undefined) {
      UserPacket.encode(message.user, writer.uint32(18).fork()).ldelim();
    }
    if (message.speaker !== undefined) {
      ActiveSpeakerUpdate.encode(
        message.speaker,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DataPacket {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDataPacket();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.kind = reader.int32() as any;
          break;
        case 2:
          message.user = UserPacket.decode(reader, reader.uint32());
          break;
        case 3:
          message.speaker = ActiveSpeakerUpdate.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DataPacket {
    const message = createBaseDataPacket();
    message.kind =
      object.kind !== undefined && object.kind !== null
        ? dataPacket_KindFromJSON(object.kind)
        : 0;
    message.user =
      object.user !== undefined && object.user !== null
        ? UserPacket.fromJSON(object.user)
        : undefined;
    message.speaker =
      object.speaker !== undefined && object.speaker !== null
        ? ActiveSpeakerUpdate.fromJSON(object.speaker)
        : undefined;
    return message;
  },

  toJSON(message: DataPacket): unknown {
    const obj: any = {};
    message.kind !== undefined &&
      (obj.kind = dataPacket_KindToJSON(message.kind));
    message.user !== undefined &&
      (obj.user = message.user ? UserPacket.toJSON(message.user) : undefined);
    message.speaker !== undefined &&
      (obj.speaker = message.speaker
        ? ActiveSpeakerUpdate.toJSON(message.speaker)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DataPacket>, I>>(
    object: I
  ): DataPacket {
    const message = createBaseDataPacket();
    message.kind = object.kind ?? 0;
    message.user =
      object.user !== undefined && object.user !== null
        ? UserPacket.fromPartial(object.user)
        : undefined;
    message.speaker =
      object.speaker !== undefined && object.speaker !== null
        ? ActiveSpeakerUpdate.fromPartial(object.speaker)
        : undefined;
    return message;
  },
};

function createBaseActiveSpeakerUpdate(): ActiveSpeakerUpdate {
  return { speakers: [] };
}

export const ActiveSpeakerUpdate = {
  encode(
    message: ActiveSpeakerUpdate,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.speakers) {
      SpeakerInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActiveSpeakerUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActiveSpeakerUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.speakers.push(SpeakerInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ActiveSpeakerUpdate {
    const message = createBaseActiveSpeakerUpdate();
    message.speakers = (object.speakers ?? []).map((e: any) =>
      SpeakerInfo.fromJSON(e)
    );
    return message;
  },

  toJSON(message: ActiveSpeakerUpdate): unknown {
    const obj: any = {};
    if (message.speakers) {
      obj.speakers = message.speakers.map((e) =>
        e ? SpeakerInfo.toJSON(e) : undefined
      );
    } else {
      obj.speakers = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ActiveSpeakerUpdate>, I>>(
    object: I
  ): ActiveSpeakerUpdate {
    const message = createBaseActiveSpeakerUpdate();
    message.speakers =
      object.speakers?.map((e) => SpeakerInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSpeakerInfo(): SpeakerInfo {
  return { sid: "", level: 0, active: false };
}

export const SpeakerInfo = {
  encode(
    message: SpeakerInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSpeakerInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sid = reader.string();
          break;
        case 2:
          message.level = reader.float();
          break;
        case 3:
          message.active = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SpeakerInfo {
    const message = createBaseSpeakerInfo();
    message.sid =
      object.sid !== undefined && object.sid !== null ? String(object.sid) : "";
    message.level =
      object.level !== undefined && object.level !== null
        ? Number(object.level)
        : 0;
    message.active =
      object.active !== undefined && object.active !== null
        ? Boolean(object.active)
        : false;
    return message;
  },

  toJSON(message: SpeakerInfo): unknown {
    const obj: any = {};
    message.sid !== undefined && (obj.sid = message.sid);
    message.level !== undefined && (obj.level = message.level);
    message.active !== undefined && (obj.active = message.active);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SpeakerInfo>, I>>(
    object: I
  ): SpeakerInfo {
    const message = createBaseSpeakerInfo();
    message.sid = object.sid ?? "";
    message.level = object.level ?? 0;
    message.active = object.active ?? false;
    return message;
  },
};

function createBaseUserPacket(): UserPacket {
  return { participantSid: "", payload: new Uint8Array(), destinationSids: [] };
}

export const UserPacket = {
  encode(
    message: UserPacket,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.participantSid !== "") {
      writer.uint32(10).string(message.participantSid);
    }
    if (message.payload.length !== 0) {
      writer.uint32(18).bytes(message.payload);
    }
    for (const v of message.destinationSids) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserPacket {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserPacket();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.participantSid = reader.string();
          break;
        case 2:
          message.payload = reader.bytes();
          break;
        case 3:
          message.destinationSids.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserPacket {
    const message = createBaseUserPacket();
    message.participantSid =
      object.participantSid !== undefined && object.participantSid !== null
        ? String(object.participantSid)
        : "";
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? bytesFromBase64(object.payload)
        : new Uint8Array();
    message.destinationSids = (object.destinationSids ?? []).map((e: any) =>
      String(e)
    );
    return message;
  },

  toJSON(message: UserPacket): unknown {
    const obj: any = {};
    message.participantSid !== undefined &&
      (obj.participantSid = message.participantSid);
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ));
    if (message.destinationSids) {
      obj.destinationSids = message.destinationSids.map((e) => e);
    } else {
      obj.destinationSids = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserPacket>, I>>(
    object: I
  ): UserPacket {
    const message = createBaseUserPacket();
    message.participantSid = object.participantSid ?? "";
    message.payload = object.payload ?? new Uint8Array();
    message.destinationSids = object.destinationSids?.map((e) => e) || [];
    return message;
  },
};

function createBaseParticipantTracks(): ParticipantTracks {
  return { participantSid: "", trackSids: [] };
}

export const ParticipantTracks = {
  encode(
    message: ParticipantTracks,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.participantSid !== "") {
      writer.uint32(10).string(message.participantSid);
    }
    for (const v of message.trackSids) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParticipantTracks {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParticipantTracks();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.participantSid = reader.string();
          break;
        case 2:
          message.trackSids.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ParticipantTracks {
    const message = createBaseParticipantTracks();
    message.participantSid =
      object.participantSid !== undefined && object.participantSid !== null
        ? String(object.participantSid)
        : "";
    message.trackSids = (object.trackSids ?? []).map((e: any) => String(e));
    return message;
  },

  toJSON(message: ParticipantTracks): unknown {
    const obj: any = {};
    message.participantSid !== undefined &&
      (obj.participantSid = message.participantSid);
    if (message.trackSids) {
      obj.trackSids = message.trackSids.map((e) => e);
    } else {
      obj.trackSids = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ParticipantTracks>, I>>(
    object: I
  ): ParticipantTracks {
    const message = createBaseParticipantTracks();
    message.participantSid = object.participantSid ?? "";
    message.trackSids = object.trackSids?.map((e) => e) || [];
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
  };
}

export const ClientInfo = {
  encode(
    message: ClientInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClientInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClientInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sdk = reader.int32() as any;
          break;
        case 2:
          message.version = reader.string();
          break;
        case 3:
          message.protocol = reader.int32();
          break;
        case 4:
          message.os = reader.string();
          break;
        case 5:
          message.osVersion = reader.string();
          break;
        case 6:
          message.deviceModel = reader.string();
          break;
        case 7:
          message.browser = reader.string();
          break;
        case 8:
          message.browserVersion = reader.string();
          break;
        case 9:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ClientInfo {
    const message = createBaseClientInfo();
    message.sdk =
      object.sdk !== undefined && object.sdk !== null
        ? clientInfo_SDKFromJSON(object.sdk)
        : 0;
    message.version =
      object.version !== undefined && object.version !== null
        ? String(object.version)
        : "";
    message.protocol =
      object.protocol !== undefined && object.protocol !== null
        ? Number(object.protocol)
        : 0;
    message.os =
      object.os !== undefined && object.os !== null ? String(object.os) : "";
    message.osVersion =
      object.osVersion !== undefined && object.osVersion !== null
        ? String(object.osVersion)
        : "";
    message.deviceModel =
      object.deviceModel !== undefined && object.deviceModel !== null
        ? String(object.deviceModel)
        : "";
    message.browser =
      object.browser !== undefined && object.browser !== null
        ? String(object.browser)
        : "";
    message.browserVersion =
      object.browserVersion !== undefined && object.browserVersion !== null
        ? String(object.browserVersion)
        : "";
    message.address =
      object.address !== undefined && object.address !== null
        ? String(object.address)
        : "";
    return message;
  },

  toJSON(message: ClientInfo): unknown {
    const obj: any = {};
    message.sdk !== undefined && (obj.sdk = clientInfo_SDKToJSON(message.sdk));
    message.version !== undefined && (obj.version = message.version);
    message.protocol !== undefined &&
      (obj.protocol = Math.round(message.protocol));
    message.os !== undefined && (obj.os = message.os);
    message.osVersion !== undefined && (obj.osVersion = message.osVersion);
    message.deviceModel !== undefined &&
      (obj.deviceModel = message.deviceModel);
    message.browser !== undefined && (obj.browser = message.browser);
    message.browserVersion !== undefined &&
      (obj.browserVersion = message.browserVersion);
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ClientInfo>, I>>(
    object: I
  ): ClientInfo {
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
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
