/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "livekit";

export enum EncodedFileType {
  MP4 = 0,
  /** OGG - WEBM = 2; coming soon */
  OGG = 1,
  UNRECOGNIZED = -1,
}

export function encodedFileTypeFromJSON(object: any): EncodedFileType {
  switch (object) {
    case 0:
    case "MP4":
      return EncodedFileType.MP4;
    case 1:
    case "OGG":
      return EncodedFileType.OGG;
    case -1:
    case "UNRECOGNIZED":
    default:
      return EncodedFileType.UNRECOGNIZED;
  }
}

export function encodedFileTypeToJSON(object: EncodedFileType): string {
  switch (object) {
    case EncodedFileType.MP4:
      return "MP4";
    case EncodedFileType.OGG:
      return "OGG";
    default:
      return "UNKNOWN";
  }
}

export enum StreamProtocol {
  /** RTMP - SRT  = 1; coming soon */
  RTMP = 0,
  UNRECOGNIZED = -1,
}

export function streamProtocolFromJSON(object: any): StreamProtocol {
  switch (object) {
    case 0:
    case "RTMP":
      return StreamProtocol.RTMP;
    case -1:
    case "UNRECOGNIZED":
    default:
      return StreamProtocol.UNRECOGNIZED;
  }
}

export function streamProtocolToJSON(object: StreamProtocol): string {
  switch (object) {
    case StreamProtocol.RTMP:
      return "RTMP";
    default:
      return "UNKNOWN";
  }
}

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
    default:
      return "UNKNOWN";
  }
}

export enum VideoCodec {
  DEFAULT_VC = 0,
  H264_BASELINE = 1,
  H264_MAIN = 2,
  /**
   * H264_HIGH - HEVC = 4; coming soon
   *  VP8 = 5;  coming soon
   *  VP9 = 6;  coming soon
   */
  H264_HIGH = 3,
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
    default:
      return "UNKNOWN";
  }
}

export enum EncodingOptionsPreset {
  /** H264_720P_30 - 720p, 30fps, 3000kpbs, H.264_MAIN / OPUS */
  H264_720P_30 = 0,
  /** H264_720P_60 - 720p, 60fps, 4500kbps, H.264_MAIN / OPUS */
  H264_720P_60 = 1,
  /** H264_1080P_30 - 1080p, 30fps, 4500kbps, H.264_MAIN / OPUS */
  H264_1080P_30 = 2,
  /** H264_1080P_60 - 1080p, 60fps, 6000kbps, H.264_MAIN / OPUS */
  H264_1080P_60 = 3,
  UNRECOGNIZED = -1,
}

export function encodingOptionsPresetFromJSON(
  object: any
): EncodingOptionsPreset {
  switch (object) {
    case 0:
    case "H264_720P_30":
      return EncodingOptionsPreset.H264_720P_30;
    case 1:
    case "H264_720P_60":
      return EncodingOptionsPreset.H264_720P_60;
    case 2:
    case "H264_1080P_30":
      return EncodingOptionsPreset.H264_1080P_30;
    case 3:
    case "H264_1080P_60":
      return EncodingOptionsPreset.H264_1080P_60;
    case -1:
    case "UNRECOGNIZED":
    default:
      return EncodingOptionsPreset.UNRECOGNIZED;
  }
}

export function encodingOptionsPresetToJSON(
  object: EncodingOptionsPreset
): string {
  switch (object) {
    case EncodingOptionsPreset.H264_720P_30:
      return "H264_720P_30";
    case EncodingOptionsPreset.H264_720P_60:
      return "H264_720P_60";
    case EncodingOptionsPreset.H264_1080P_30:
      return "H264_1080P_30";
    case EncodingOptionsPreset.H264_1080P_60:
      return "H264_1080P_60";
    default:
      return "UNKNOWN";
  }
}

export enum EgressStatus {
  EGRESS_STARTING = 0,
  EGRESS_ACTIVE = 1,
  EGRESS_ENDING = 2,
  EGRESS_COMPLETE = 3,
  UNRECOGNIZED = -1,
}

export function egressStatusFromJSON(object: any): EgressStatus {
  switch (object) {
    case 0:
    case "EGRESS_STARTING":
      return EgressStatus.EGRESS_STARTING;
    case 1:
    case "EGRESS_ACTIVE":
      return EgressStatus.EGRESS_ACTIVE;
    case 2:
    case "EGRESS_ENDING":
      return EgressStatus.EGRESS_ENDING;
    case 3:
    case "EGRESS_COMPLETE":
      return EgressStatus.EGRESS_COMPLETE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return EgressStatus.UNRECOGNIZED;
  }
}

export function egressStatusToJSON(object: EgressStatus): string {
  switch (object) {
    case EgressStatus.EGRESS_STARTING:
      return "EGRESS_STARTING";
    case EgressStatus.EGRESS_ACTIVE:
      return "EGRESS_ACTIVE";
    case EgressStatus.EGRESS_ENDING:
      return "EGRESS_ENDING";
    case EgressStatus.EGRESS_COMPLETE:
      return "EGRESS_COMPLETE";
    default:
      return "UNKNOWN";
  }
}

/** composite using a web browser */
export interface WebCompositeEgressRequest {
  /** required */
  roomName: string;
  /** (optional) */
  layout: string;
  /** (default false) */
  audioOnly: boolean;
  /** (default false) */
  videoOnly: boolean;
  /** (default https://recorder.livekit.io) */
  customBaseUrl: string;
  file?: EncodedFileOutput | undefined;
  stream?: StreamOutput | undefined;
  /** (default none) */
  preset: EncodingOptionsPreset | undefined;
  /** (default none) */
  advanced?: EncodingOptions | undefined;
}

/** composite a single audio and video track */
export interface TrackCompositeEgressRequest {
  /** required */
  roomName: string;
  /** required */
  audioTrackId: string;
  /** required */
  videoTrackId: string;
  file?: EncodedFileOutput | undefined;
  stream?: StreamOutput | undefined;
  /** (optional) */
  preset: EncodingOptionsPreset | undefined;
  /** (optional) */
  advanced?: EncodingOptions | undefined;
}

/** record tracks individually, without transcoding */
export interface TrackEgressRequest {
  /** required */
  roomName: string;
  /** required */
  trackId: string;
  httpUrl: string | undefined;
  websocketUrl: string | undefined;
}

export interface EncodedFileOutput {
  /** required, must be compatible with codec selection */
  fileType: EncodedFileType;
  filepath: string;
  s3?: S3Upload | undefined;
  gcp?: GCPUpload | undefined;
  azure?: AzureBlobUpload | undefined;
}

export interface S3Upload {
  accessKey: string;
  secret: string;
  region: string;
  endpoint: string;
  bucket: string;
}

export interface GCPUpload {
  credentials: Uint8Array;
  bucket: string;
}

export interface AzureBlobUpload {
  accountName: string;
  accountKey: string;
  containerName: string;
}

export interface StreamOutput {
  /** required */
  protocol: StreamProtocol;
  /** required */
  urls: string[];
}

export interface EncodingOptions {
  /** (default 1920) */
  width: number;
  /** (default 1080) */
  height: number;
  /** (default 24) */
  depth: number;
  /** (default 30) */
  framerate: number;
  /** (default OPUS) */
  audioCodec: AudioCodec;
  /** (default 128) */
  audioBitrate: number;
  /** (default 44100) */
  audioFrequency: number;
  /** (default H264_MAIN) */
  videoCodec: VideoCodec;
  /** (default 4500) */
  videoBitrate: number;
}

export interface UpdateLayoutRequest {
  egressId: string;
  layout: string;
}

export interface UpdateStreamRequest {
  egressId: string;
  addOutputUrls: string[];
  removeOutputUrls: string[];
}

export interface ListEgressRequest {
  /** optional, when empty lists all egresses */
  roomName: string;
}

export interface ListEgressResponse {
  items: EgressInfo[];
}

export interface StopEgressRequest {
  egressId: string;
}

export interface EgressInfo {
  egressId: string;
  roomId: string;
  status: EgressStatus;
  webComposite?: WebCompositeEgressRequest | undefined;
  trackComposite?: TrackCompositeEgressRequest | undefined;
  track?: TrackEgressRequest | undefined;
  stream?: StreamInfoList | undefined;
  file?: FileInfo | undefined;
  error: string;
}

export interface StreamInfoList {
  info: StreamInfo[];
}

export interface StreamInfo {
  url: string;
  startedAt: number;
  endedAt: number;
}

export interface FileInfo {
  filename: string;
  startedAt: number;
  endedAt: number;
  size: number;
  location: string;
}

function createBaseWebCompositeEgressRequest(): WebCompositeEgressRequest {
  return {
    roomName: "",
    layout: "",
    audioOnly: false,
    videoOnly: false,
    customBaseUrl: "",
    file: undefined,
    stream: undefined,
    preset: undefined,
    advanced: undefined,
  };
}

export const WebCompositeEgressRequest = {
  encode(
    message: WebCompositeEgressRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.roomName !== "") {
      writer.uint32(10).string(message.roomName);
    }
    if (message.layout !== "") {
      writer.uint32(18).string(message.layout);
    }
    if (message.audioOnly === true) {
      writer.uint32(24).bool(message.audioOnly);
    }
    if (message.videoOnly === true) {
      writer.uint32(32).bool(message.videoOnly);
    }
    if (message.customBaseUrl !== "") {
      writer.uint32(42).string(message.customBaseUrl);
    }
    if (message.file !== undefined) {
      EncodedFileOutput.encode(message.file, writer.uint32(50).fork()).ldelim();
    }
    if (message.stream !== undefined) {
      StreamOutput.encode(message.stream, writer.uint32(58).fork()).ldelim();
    }
    if (message.preset !== undefined) {
      writer.uint32(64).int32(message.preset);
    }
    if (message.advanced !== undefined) {
      EncodingOptions.encode(
        message.advanced,
        writer.uint32(74).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): WebCompositeEgressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWebCompositeEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomName = reader.string();
          break;
        case 2:
          message.layout = reader.string();
          break;
        case 3:
          message.audioOnly = reader.bool();
          break;
        case 4:
          message.videoOnly = reader.bool();
          break;
        case 5:
          message.customBaseUrl = reader.string();
          break;
        case 6:
          message.file = EncodedFileOutput.decode(reader, reader.uint32());
          break;
        case 7:
          message.stream = StreamOutput.decode(reader, reader.uint32());
          break;
        case 8:
          message.preset = reader.int32() as any;
          break;
        case 9:
          message.advanced = EncodingOptions.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WebCompositeEgressRequest {
    const message = createBaseWebCompositeEgressRequest();
    message.roomName =
      object.roomName !== undefined && object.roomName !== null
        ? String(object.roomName)
        : "";
    message.layout =
      object.layout !== undefined && object.layout !== null
        ? String(object.layout)
        : "";
    message.audioOnly =
      object.audioOnly !== undefined && object.audioOnly !== null
        ? Boolean(object.audioOnly)
        : false;
    message.videoOnly =
      object.videoOnly !== undefined && object.videoOnly !== null
        ? Boolean(object.videoOnly)
        : false;
    message.customBaseUrl =
      object.customBaseUrl !== undefined && object.customBaseUrl !== null
        ? String(object.customBaseUrl)
        : "";
    message.file =
      object.file !== undefined && object.file !== null
        ? EncodedFileOutput.fromJSON(object.file)
        : undefined;
    message.stream =
      object.stream !== undefined && object.stream !== null
        ? StreamOutput.fromJSON(object.stream)
        : undefined;
    message.preset =
      object.preset !== undefined && object.preset !== null
        ? encodingOptionsPresetFromJSON(object.preset)
        : undefined;
    message.advanced =
      object.advanced !== undefined && object.advanced !== null
        ? EncodingOptions.fromJSON(object.advanced)
        : undefined;
    return message;
  },

  toJSON(message: WebCompositeEgressRequest): unknown {
    const obj: any = {};
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.layout !== undefined && (obj.layout = message.layout);
    message.audioOnly !== undefined && (obj.audioOnly = message.audioOnly);
    message.videoOnly !== undefined && (obj.videoOnly = message.videoOnly);
    message.customBaseUrl !== undefined &&
      (obj.customBaseUrl = message.customBaseUrl);
    message.file !== undefined &&
      (obj.file = message.file
        ? EncodedFileOutput.toJSON(message.file)
        : undefined);
    message.stream !== undefined &&
      (obj.stream = message.stream
        ? StreamOutput.toJSON(message.stream)
        : undefined);
    message.preset !== undefined &&
      (obj.preset =
        message.preset !== undefined
          ? encodingOptionsPresetToJSON(message.preset)
          : undefined);
    message.advanced !== undefined &&
      (obj.advanced = message.advanced
        ? EncodingOptions.toJSON(message.advanced)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<WebCompositeEgressRequest>, I>>(
    object: I
  ): WebCompositeEgressRequest {
    const message = createBaseWebCompositeEgressRequest();
    message.roomName = object.roomName ?? "";
    message.layout = object.layout ?? "";
    message.audioOnly = object.audioOnly ?? false;
    message.videoOnly = object.videoOnly ?? false;
    message.customBaseUrl = object.customBaseUrl ?? "";
    message.file =
      object.file !== undefined && object.file !== null
        ? EncodedFileOutput.fromPartial(object.file)
        : undefined;
    message.stream =
      object.stream !== undefined && object.stream !== null
        ? StreamOutput.fromPartial(object.stream)
        : undefined;
    message.preset = object.preset ?? undefined;
    message.advanced =
      object.advanced !== undefined && object.advanced !== null
        ? EncodingOptions.fromPartial(object.advanced)
        : undefined;
    return message;
  },
};

function createBaseTrackCompositeEgressRequest(): TrackCompositeEgressRequest {
  return {
    roomName: "",
    audioTrackId: "",
    videoTrackId: "",
    file: undefined,
    stream: undefined,
    preset: undefined,
    advanced: undefined,
  };
}

export const TrackCompositeEgressRequest = {
  encode(
    message: TrackCompositeEgressRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.roomName !== "") {
      writer.uint32(10).string(message.roomName);
    }
    if (message.audioTrackId !== "") {
      writer.uint32(18).string(message.audioTrackId);
    }
    if (message.videoTrackId !== "") {
      writer.uint32(26).string(message.videoTrackId);
    }
    if (message.file !== undefined) {
      EncodedFileOutput.encode(message.file, writer.uint32(34).fork()).ldelim();
    }
    if (message.stream !== undefined) {
      StreamOutput.encode(message.stream, writer.uint32(42).fork()).ldelim();
    }
    if (message.preset !== undefined) {
      writer.uint32(48).int32(message.preset);
    }
    if (message.advanced !== undefined) {
      EncodingOptions.encode(
        message.advanced,
        writer.uint32(58).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): TrackCompositeEgressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrackCompositeEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomName = reader.string();
          break;
        case 2:
          message.audioTrackId = reader.string();
          break;
        case 3:
          message.videoTrackId = reader.string();
          break;
        case 4:
          message.file = EncodedFileOutput.decode(reader, reader.uint32());
          break;
        case 5:
          message.stream = StreamOutput.decode(reader, reader.uint32());
          break;
        case 6:
          message.preset = reader.int32() as any;
          break;
        case 7:
          message.advanced = EncodingOptions.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TrackCompositeEgressRequest {
    const message = createBaseTrackCompositeEgressRequest();
    message.roomName =
      object.roomName !== undefined && object.roomName !== null
        ? String(object.roomName)
        : "";
    message.audioTrackId =
      object.audioTrackId !== undefined && object.audioTrackId !== null
        ? String(object.audioTrackId)
        : "";
    message.videoTrackId =
      object.videoTrackId !== undefined && object.videoTrackId !== null
        ? String(object.videoTrackId)
        : "";
    message.file =
      object.file !== undefined && object.file !== null
        ? EncodedFileOutput.fromJSON(object.file)
        : undefined;
    message.stream =
      object.stream !== undefined && object.stream !== null
        ? StreamOutput.fromJSON(object.stream)
        : undefined;
    message.preset =
      object.preset !== undefined && object.preset !== null
        ? encodingOptionsPresetFromJSON(object.preset)
        : undefined;
    message.advanced =
      object.advanced !== undefined && object.advanced !== null
        ? EncodingOptions.fromJSON(object.advanced)
        : undefined;
    return message;
  },

  toJSON(message: TrackCompositeEgressRequest): unknown {
    const obj: any = {};
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.audioTrackId !== undefined &&
      (obj.audioTrackId = message.audioTrackId);
    message.videoTrackId !== undefined &&
      (obj.videoTrackId = message.videoTrackId);
    message.file !== undefined &&
      (obj.file = message.file
        ? EncodedFileOutput.toJSON(message.file)
        : undefined);
    message.stream !== undefined &&
      (obj.stream = message.stream
        ? StreamOutput.toJSON(message.stream)
        : undefined);
    message.preset !== undefined &&
      (obj.preset =
        message.preset !== undefined
          ? encodingOptionsPresetToJSON(message.preset)
          : undefined);
    message.advanced !== undefined &&
      (obj.advanced = message.advanced
        ? EncodingOptions.toJSON(message.advanced)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TrackCompositeEgressRequest>, I>>(
    object: I
  ): TrackCompositeEgressRequest {
    const message = createBaseTrackCompositeEgressRequest();
    message.roomName = object.roomName ?? "";
    message.audioTrackId = object.audioTrackId ?? "";
    message.videoTrackId = object.videoTrackId ?? "";
    message.file =
      object.file !== undefined && object.file !== null
        ? EncodedFileOutput.fromPartial(object.file)
        : undefined;
    message.stream =
      object.stream !== undefined && object.stream !== null
        ? StreamOutput.fromPartial(object.stream)
        : undefined;
    message.preset = object.preset ?? undefined;
    message.advanced =
      object.advanced !== undefined && object.advanced !== null
        ? EncodingOptions.fromPartial(object.advanced)
        : undefined;
    return message;
  },
};

function createBaseTrackEgressRequest(): TrackEgressRequest {
  return {
    roomName: "",
    trackId: "",
    httpUrl: undefined,
    websocketUrl: undefined,
  };
}

export const TrackEgressRequest = {
  encode(
    message: TrackEgressRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.roomName !== "") {
      writer.uint32(10).string(message.roomName);
    }
    if (message.trackId !== "") {
      writer.uint32(18).string(message.trackId);
    }
    if (message.httpUrl !== undefined) {
      writer.uint32(26).string(message.httpUrl);
    }
    if (message.websocketUrl !== undefined) {
      writer.uint32(34).string(message.websocketUrl);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TrackEgressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrackEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomName = reader.string();
          break;
        case 2:
          message.trackId = reader.string();
          break;
        case 3:
          message.httpUrl = reader.string();
          break;
        case 4:
          message.websocketUrl = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TrackEgressRequest {
    const message = createBaseTrackEgressRequest();
    message.roomName =
      object.roomName !== undefined && object.roomName !== null
        ? String(object.roomName)
        : "";
    message.trackId =
      object.trackId !== undefined && object.trackId !== null
        ? String(object.trackId)
        : "";
    message.httpUrl =
      object.httpUrl !== undefined && object.httpUrl !== null
        ? String(object.httpUrl)
        : undefined;
    message.websocketUrl =
      object.websocketUrl !== undefined && object.websocketUrl !== null
        ? String(object.websocketUrl)
        : undefined;
    return message;
  },

  toJSON(message: TrackEgressRequest): unknown {
    const obj: any = {};
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.trackId !== undefined && (obj.trackId = message.trackId);
    message.httpUrl !== undefined && (obj.httpUrl = message.httpUrl);
    message.websocketUrl !== undefined &&
      (obj.websocketUrl = message.websocketUrl);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TrackEgressRequest>, I>>(
    object: I
  ): TrackEgressRequest {
    const message = createBaseTrackEgressRequest();
    message.roomName = object.roomName ?? "";
    message.trackId = object.trackId ?? "";
    message.httpUrl = object.httpUrl ?? undefined;
    message.websocketUrl = object.websocketUrl ?? undefined;
    return message;
  },
};

function createBaseEncodedFileOutput(): EncodedFileOutput {
  return {
    fileType: 0,
    filepath: "",
    s3: undefined,
    gcp: undefined,
    azure: undefined,
  };
}

export const EncodedFileOutput = {
  encode(
    message: EncodedFileOutput,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.fileType !== 0) {
      writer.uint32(8).int32(message.fileType);
    }
    if (message.filepath !== "") {
      writer.uint32(18).string(message.filepath);
    }
    if (message.s3 !== undefined) {
      S3Upload.encode(message.s3, writer.uint32(26).fork()).ldelim();
    }
    if (message.gcp !== undefined) {
      GCPUpload.encode(message.gcp, writer.uint32(34).fork()).ldelim();
    }
    if (message.azure !== undefined) {
      AzureBlobUpload.encode(message.azure, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EncodedFileOutput {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncodedFileOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fileType = reader.int32() as any;
          break;
        case 2:
          message.filepath = reader.string();
          break;
        case 3:
          message.s3 = S3Upload.decode(reader, reader.uint32());
          break;
        case 4:
          message.gcp = GCPUpload.decode(reader, reader.uint32());
          break;
        case 5:
          message.azure = AzureBlobUpload.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EncodedFileOutput {
    const message = createBaseEncodedFileOutput();
    message.fileType =
      object.fileType !== undefined && object.fileType !== null
        ? encodedFileTypeFromJSON(object.fileType)
        : 0;
    message.filepath =
      object.filepath !== undefined && object.filepath !== null
        ? String(object.filepath)
        : "";
    message.s3 =
      object.s3 !== undefined && object.s3 !== null
        ? S3Upload.fromJSON(object.s3)
        : undefined;
    message.gcp =
      object.gcp !== undefined && object.gcp !== null
        ? GCPUpload.fromJSON(object.gcp)
        : undefined;
    message.azure =
      object.azure !== undefined && object.azure !== null
        ? AzureBlobUpload.fromJSON(object.azure)
        : undefined;
    return message;
  },

  toJSON(message: EncodedFileOutput): unknown {
    const obj: any = {};
    message.fileType !== undefined &&
      (obj.fileType = encodedFileTypeToJSON(message.fileType));
    message.filepath !== undefined && (obj.filepath = message.filepath);
    message.s3 !== undefined &&
      (obj.s3 = message.s3 ? S3Upload.toJSON(message.s3) : undefined);
    message.gcp !== undefined &&
      (obj.gcp = message.gcp ? GCPUpload.toJSON(message.gcp) : undefined);
    message.azure !== undefined &&
      (obj.azure = message.azure
        ? AzureBlobUpload.toJSON(message.azure)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EncodedFileOutput>, I>>(
    object: I
  ): EncodedFileOutput {
    const message = createBaseEncodedFileOutput();
    message.fileType = object.fileType ?? 0;
    message.filepath = object.filepath ?? "";
    message.s3 =
      object.s3 !== undefined && object.s3 !== null
        ? S3Upload.fromPartial(object.s3)
        : undefined;
    message.gcp =
      object.gcp !== undefined && object.gcp !== null
        ? GCPUpload.fromPartial(object.gcp)
        : undefined;
    message.azure =
      object.azure !== undefined && object.azure !== null
        ? AzureBlobUpload.fromPartial(object.azure)
        : undefined;
    return message;
  },
};

function createBaseS3Upload(): S3Upload {
  return { accessKey: "", secret: "", region: "", endpoint: "", bucket: "" };
}

export const S3Upload = {
  encode(
    message: S3Upload,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.accessKey !== "") {
      writer.uint32(10).string(message.accessKey);
    }
    if (message.secret !== "") {
      writer.uint32(18).string(message.secret);
    }
    if (message.region !== "") {
      writer.uint32(26).string(message.region);
    }
    if (message.endpoint !== "") {
      writer.uint32(34).string(message.endpoint);
    }
    if (message.bucket !== "") {
      writer.uint32(42).string(message.bucket);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): S3Upload {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseS3Upload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accessKey = reader.string();
          break;
        case 2:
          message.secret = reader.string();
          break;
        case 3:
          message.region = reader.string();
          break;
        case 4:
          message.endpoint = reader.string();
          break;
        case 5:
          message.bucket = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): S3Upload {
    const message = createBaseS3Upload();
    message.accessKey =
      object.accessKey !== undefined && object.accessKey !== null
        ? String(object.accessKey)
        : "";
    message.secret =
      object.secret !== undefined && object.secret !== null
        ? String(object.secret)
        : "";
    message.region =
      object.region !== undefined && object.region !== null
        ? String(object.region)
        : "";
    message.endpoint =
      object.endpoint !== undefined && object.endpoint !== null
        ? String(object.endpoint)
        : "";
    message.bucket =
      object.bucket !== undefined && object.bucket !== null
        ? String(object.bucket)
        : "";
    return message;
  },

  toJSON(message: S3Upload): unknown {
    const obj: any = {};
    message.accessKey !== undefined && (obj.accessKey = message.accessKey);
    message.secret !== undefined && (obj.secret = message.secret);
    message.region !== undefined && (obj.region = message.region);
    message.endpoint !== undefined && (obj.endpoint = message.endpoint);
    message.bucket !== undefined && (obj.bucket = message.bucket);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<S3Upload>, I>>(object: I): S3Upload {
    const message = createBaseS3Upload();
    message.accessKey = object.accessKey ?? "";
    message.secret = object.secret ?? "";
    message.region = object.region ?? "";
    message.endpoint = object.endpoint ?? "";
    message.bucket = object.bucket ?? "";
    return message;
  },
};

function createBaseGCPUpload(): GCPUpload {
  return { credentials: new Uint8Array(), bucket: "" };
}

export const GCPUpload = {
  encode(
    message: GCPUpload,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.credentials.length !== 0) {
      writer.uint32(10).bytes(message.credentials);
    }
    if (message.bucket !== "") {
      writer.uint32(18).string(message.bucket);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GCPUpload {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGCPUpload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.credentials = reader.bytes();
          break;
        case 2:
          message.bucket = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GCPUpload {
    const message = createBaseGCPUpload();
    message.credentials =
      object.credentials !== undefined && object.credentials !== null
        ? bytesFromBase64(object.credentials)
        : new Uint8Array();
    message.bucket =
      object.bucket !== undefined && object.bucket !== null
        ? String(object.bucket)
        : "";
    return message;
  },

  toJSON(message: GCPUpload): unknown {
    const obj: any = {};
    message.credentials !== undefined &&
      (obj.credentials = base64FromBytes(
        message.credentials !== undefined
          ? message.credentials
          : new Uint8Array()
      ));
    message.bucket !== undefined && (obj.bucket = message.bucket);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GCPUpload>, I>>(
    object: I
  ): GCPUpload {
    const message = createBaseGCPUpload();
    message.credentials = object.credentials ?? new Uint8Array();
    message.bucket = object.bucket ?? "";
    return message;
  },
};

function createBaseAzureBlobUpload(): AzureBlobUpload {
  return { accountName: "", accountKey: "", containerName: "" };
}

export const AzureBlobUpload = {
  encode(
    message: AzureBlobUpload,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.accountName !== "") {
      writer.uint32(10).string(message.accountName);
    }
    if (message.accountKey !== "") {
      writer.uint32(18).string(message.accountKey);
    }
    if (message.containerName !== "") {
      writer.uint32(26).string(message.containerName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AzureBlobUpload {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAzureBlobUpload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountName = reader.string();
          break;
        case 2:
          message.accountKey = reader.string();
          break;
        case 3:
          message.containerName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AzureBlobUpload {
    const message = createBaseAzureBlobUpload();
    message.accountName =
      object.accountName !== undefined && object.accountName !== null
        ? String(object.accountName)
        : "";
    message.accountKey =
      object.accountKey !== undefined && object.accountKey !== null
        ? String(object.accountKey)
        : "";
    message.containerName =
      object.containerName !== undefined && object.containerName !== null
        ? String(object.containerName)
        : "";
    return message;
  },

  toJSON(message: AzureBlobUpload): unknown {
    const obj: any = {};
    message.accountName !== undefined &&
      (obj.accountName = message.accountName);
    message.accountKey !== undefined && (obj.accountKey = message.accountKey);
    message.containerName !== undefined &&
      (obj.containerName = message.containerName);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AzureBlobUpload>, I>>(
    object: I
  ): AzureBlobUpload {
    const message = createBaseAzureBlobUpload();
    message.accountName = object.accountName ?? "";
    message.accountKey = object.accountKey ?? "";
    message.containerName = object.containerName ?? "";
    return message;
  },
};

function createBaseStreamOutput(): StreamOutput {
  return { protocol: 0, urls: [] };
}

export const StreamOutput = {
  encode(
    message: StreamOutput,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.protocol !== 0) {
      writer.uint32(8).int32(message.protocol);
    }
    for (const v of message.urls) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamOutput {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.protocol = reader.int32() as any;
          break;
        case 2:
          message.urls.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamOutput {
    const message = createBaseStreamOutput();
    message.protocol =
      object.protocol !== undefined && object.protocol !== null
        ? streamProtocolFromJSON(object.protocol)
        : 0;
    message.urls = (object.urls ?? []).map((e: any) => String(e));
    return message;
  },

  toJSON(message: StreamOutput): unknown {
    const obj: any = {};
    message.protocol !== undefined &&
      (obj.protocol = streamProtocolToJSON(message.protocol));
    if (message.urls) {
      obj.urls = message.urls.map((e) => e);
    } else {
      obj.urls = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StreamOutput>, I>>(
    object: I
  ): StreamOutput {
    const message = createBaseStreamOutput();
    message.protocol = object.protocol ?? 0;
    message.urls = object.urls?.map((e) => e) || [];
    return message;
  },
};

function createBaseEncodingOptions(): EncodingOptions {
  return {
    width: 0,
    height: 0,
    depth: 0,
    framerate: 0,
    audioCodec: 0,
    audioBitrate: 0,
    audioFrequency: 0,
    videoCodec: 0,
    videoBitrate: 0,
  };
}

export const EncodingOptions = {
  encode(
    message: EncodingOptions,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.width !== 0) {
      writer.uint32(8).int32(message.width);
    }
    if (message.height !== 0) {
      writer.uint32(16).int32(message.height);
    }
    if (message.depth !== 0) {
      writer.uint32(24).int32(message.depth);
    }
    if (message.framerate !== 0) {
      writer.uint32(32).int32(message.framerate);
    }
    if (message.audioCodec !== 0) {
      writer.uint32(40).int32(message.audioCodec);
    }
    if (message.audioBitrate !== 0) {
      writer.uint32(48).int32(message.audioBitrate);
    }
    if (message.audioFrequency !== 0) {
      writer.uint32(56).int32(message.audioFrequency);
    }
    if (message.videoCodec !== 0) {
      writer.uint32(64).int32(message.videoCodec);
    }
    if (message.videoBitrate !== 0) {
      writer.uint32(72).int32(message.videoBitrate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EncodingOptions {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncodingOptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.width = reader.int32();
          break;
        case 2:
          message.height = reader.int32();
          break;
        case 3:
          message.depth = reader.int32();
          break;
        case 4:
          message.framerate = reader.int32();
          break;
        case 5:
          message.audioCodec = reader.int32() as any;
          break;
        case 6:
          message.audioBitrate = reader.int32();
          break;
        case 7:
          message.audioFrequency = reader.int32();
          break;
        case 8:
          message.videoCodec = reader.int32() as any;
          break;
        case 9:
          message.videoBitrate = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EncodingOptions {
    const message = createBaseEncodingOptions();
    message.width =
      object.width !== undefined && object.width !== null
        ? Number(object.width)
        : 0;
    message.height =
      object.height !== undefined && object.height !== null
        ? Number(object.height)
        : 0;
    message.depth =
      object.depth !== undefined && object.depth !== null
        ? Number(object.depth)
        : 0;
    message.framerate =
      object.framerate !== undefined && object.framerate !== null
        ? Number(object.framerate)
        : 0;
    message.audioCodec =
      object.audioCodec !== undefined && object.audioCodec !== null
        ? audioCodecFromJSON(object.audioCodec)
        : 0;
    message.audioBitrate =
      object.audioBitrate !== undefined && object.audioBitrate !== null
        ? Number(object.audioBitrate)
        : 0;
    message.audioFrequency =
      object.audioFrequency !== undefined && object.audioFrequency !== null
        ? Number(object.audioFrequency)
        : 0;
    message.videoCodec =
      object.videoCodec !== undefined && object.videoCodec !== null
        ? videoCodecFromJSON(object.videoCodec)
        : 0;
    message.videoBitrate =
      object.videoBitrate !== undefined && object.videoBitrate !== null
        ? Number(object.videoBitrate)
        : 0;
    return message;
  },

  toJSON(message: EncodingOptions): unknown {
    const obj: any = {};
    message.width !== undefined && (obj.width = Math.round(message.width));
    message.height !== undefined && (obj.height = Math.round(message.height));
    message.depth !== undefined && (obj.depth = Math.round(message.depth));
    message.framerate !== undefined &&
      (obj.framerate = Math.round(message.framerate));
    message.audioCodec !== undefined &&
      (obj.audioCodec = audioCodecToJSON(message.audioCodec));
    message.audioBitrate !== undefined &&
      (obj.audioBitrate = Math.round(message.audioBitrate));
    message.audioFrequency !== undefined &&
      (obj.audioFrequency = Math.round(message.audioFrequency));
    message.videoCodec !== undefined &&
      (obj.videoCodec = videoCodecToJSON(message.videoCodec));
    message.videoBitrate !== undefined &&
      (obj.videoBitrate = Math.round(message.videoBitrate));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EncodingOptions>, I>>(
    object: I
  ): EncodingOptions {
    const message = createBaseEncodingOptions();
    message.width = object.width ?? 0;
    message.height = object.height ?? 0;
    message.depth = object.depth ?? 0;
    message.framerate = object.framerate ?? 0;
    message.audioCodec = object.audioCodec ?? 0;
    message.audioBitrate = object.audioBitrate ?? 0;
    message.audioFrequency = object.audioFrequency ?? 0;
    message.videoCodec = object.videoCodec ?? 0;
    message.videoBitrate = object.videoBitrate ?? 0;
    return message;
  },
};

function createBaseUpdateLayoutRequest(): UpdateLayoutRequest {
  return { egressId: "", layout: "" };
}

export const UpdateLayoutRequest = {
  encode(
    message: UpdateLayoutRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.egressId !== "") {
      writer.uint32(10).string(message.egressId);
    }
    if (message.layout !== "") {
      writer.uint32(18).string(message.layout);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateLayoutRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateLayoutRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.egressId = reader.string();
          break;
        case 2:
          message.layout = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateLayoutRequest {
    const message = createBaseUpdateLayoutRequest();
    message.egressId =
      object.egressId !== undefined && object.egressId !== null
        ? String(object.egressId)
        : "";
    message.layout =
      object.layout !== undefined && object.layout !== null
        ? String(object.layout)
        : "";
    return message;
  },

  toJSON(message: UpdateLayoutRequest): unknown {
    const obj: any = {};
    message.egressId !== undefined && (obj.egressId = message.egressId);
    message.layout !== undefined && (obj.layout = message.layout);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateLayoutRequest>, I>>(
    object: I
  ): UpdateLayoutRequest {
    const message = createBaseUpdateLayoutRequest();
    message.egressId = object.egressId ?? "";
    message.layout = object.layout ?? "";
    return message;
  },
};

function createBaseUpdateStreamRequest(): UpdateStreamRequest {
  return { egressId: "", addOutputUrls: [], removeOutputUrls: [] };
}

export const UpdateStreamRequest = {
  encode(
    message: UpdateStreamRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.egressId !== "") {
      writer.uint32(10).string(message.egressId);
    }
    for (const v of message.addOutputUrls) {
      writer.uint32(18).string(v!);
    }
    for (const v of message.removeOutputUrls) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateStreamRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateStreamRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.egressId = reader.string();
          break;
        case 2:
          message.addOutputUrls.push(reader.string());
          break;
        case 3:
          message.removeOutputUrls.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateStreamRequest {
    const message = createBaseUpdateStreamRequest();
    message.egressId =
      object.egressId !== undefined && object.egressId !== null
        ? String(object.egressId)
        : "";
    message.addOutputUrls = (object.addOutputUrls ?? []).map((e: any) =>
      String(e)
    );
    message.removeOutputUrls = (object.removeOutputUrls ?? []).map((e: any) =>
      String(e)
    );
    return message;
  },

  toJSON(message: UpdateStreamRequest): unknown {
    const obj: any = {};
    message.egressId !== undefined && (obj.egressId = message.egressId);
    if (message.addOutputUrls) {
      obj.addOutputUrls = message.addOutputUrls.map((e) => e);
    } else {
      obj.addOutputUrls = [];
    }
    if (message.removeOutputUrls) {
      obj.removeOutputUrls = message.removeOutputUrls.map((e) => e);
    } else {
      obj.removeOutputUrls = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateStreamRequest>, I>>(
    object: I
  ): UpdateStreamRequest {
    const message = createBaseUpdateStreamRequest();
    message.egressId = object.egressId ?? "";
    message.addOutputUrls = object.addOutputUrls?.map((e) => e) || [];
    message.removeOutputUrls = object.removeOutputUrls?.map((e) => e) || [];
    return message;
  },
};

function createBaseListEgressRequest(): ListEgressRequest {
  return { roomName: "" };
}

export const ListEgressRequest = {
  encode(
    message: ListEgressRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.roomName !== "") {
      writer.uint32(10).string(message.roomName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListEgressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListEgressRequest {
    const message = createBaseListEgressRequest();
    message.roomName =
      object.roomName !== undefined && object.roomName !== null
        ? String(object.roomName)
        : "";
    return message;
  },

  toJSON(message: ListEgressRequest): unknown {
    const obj: any = {};
    message.roomName !== undefined && (obj.roomName = message.roomName);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListEgressRequest>, I>>(
    object: I
  ): ListEgressRequest {
    const message = createBaseListEgressRequest();
    message.roomName = object.roomName ?? "";
    return message;
  },
};

function createBaseListEgressResponse(): ListEgressResponse {
  return { items: [] };
}

export const ListEgressResponse = {
  encode(
    message: ListEgressResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.items) {
      EgressInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListEgressResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListEgressResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.items.push(EgressInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListEgressResponse {
    const message = createBaseListEgressResponse();
    message.items = (object.items ?? []).map((e: any) =>
      EgressInfo.fromJSON(e)
    );
    return message;
  },

  toJSON(message: ListEgressResponse): unknown {
    const obj: any = {};
    if (message.items) {
      obj.items = message.items.map((e) =>
        e ? EgressInfo.toJSON(e) : undefined
      );
    } else {
      obj.items = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListEgressResponse>, I>>(
    object: I
  ): ListEgressResponse {
    const message = createBaseListEgressResponse();
    message.items = object.items?.map((e) => EgressInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseStopEgressRequest(): StopEgressRequest {
  return { egressId: "" };
}

export const StopEgressRequest = {
  encode(
    message: StopEgressRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.egressId !== "") {
      writer.uint32(10).string(message.egressId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StopEgressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStopEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.egressId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StopEgressRequest {
    const message = createBaseStopEgressRequest();
    message.egressId =
      object.egressId !== undefined && object.egressId !== null
        ? String(object.egressId)
        : "";
    return message;
  },

  toJSON(message: StopEgressRequest): unknown {
    const obj: any = {};
    message.egressId !== undefined && (obj.egressId = message.egressId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StopEgressRequest>, I>>(
    object: I
  ): StopEgressRequest {
    const message = createBaseStopEgressRequest();
    message.egressId = object.egressId ?? "";
    return message;
  },
};

function createBaseEgressInfo(): EgressInfo {
  return {
    egressId: "",
    roomId: "",
    status: 0,
    webComposite: undefined,
    trackComposite: undefined,
    track: undefined,
    stream: undefined,
    file: undefined,
    error: "",
  };
}

export const EgressInfo = {
  encode(
    message: EgressInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.egressId !== "") {
      writer.uint32(10).string(message.egressId);
    }
    if (message.roomId !== "") {
      writer.uint32(18).string(message.roomId);
    }
    if (message.status !== 0) {
      writer.uint32(24).int32(message.status);
    }
    if (message.webComposite !== undefined) {
      WebCompositeEgressRequest.encode(
        message.webComposite,
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.trackComposite !== undefined) {
      TrackCompositeEgressRequest.encode(
        message.trackComposite,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.track !== undefined) {
      TrackEgressRequest.encode(
        message.track,
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.stream !== undefined) {
      StreamInfoList.encode(message.stream, writer.uint32(58).fork()).ldelim();
    }
    if (message.file !== undefined) {
      FileInfo.encode(message.file, writer.uint32(66).fork()).ldelim();
    }
    if (message.error !== "") {
      writer.uint32(74).string(message.error);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EgressInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEgressInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.egressId = reader.string();
          break;
        case 2:
          message.roomId = reader.string();
          break;
        case 3:
          message.status = reader.int32() as any;
          break;
        case 4:
          message.webComposite = WebCompositeEgressRequest.decode(
            reader,
            reader.uint32()
          );
          break;
        case 5:
          message.trackComposite = TrackCompositeEgressRequest.decode(
            reader,
            reader.uint32()
          );
          break;
        case 6:
          message.track = TrackEgressRequest.decode(reader, reader.uint32());
          break;
        case 7:
          message.stream = StreamInfoList.decode(reader, reader.uint32());
          break;
        case 8:
          message.file = FileInfo.decode(reader, reader.uint32());
          break;
        case 9:
          message.error = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EgressInfo {
    const message = createBaseEgressInfo();
    message.egressId =
      object.egressId !== undefined && object.egressId !== null
        ? String(object.egressId)
        : "";
    message.roomId =
      object.roomId !== undefined && object.roomId !== null
        ? String(object.roomId)
        : "";
    message.status =
      object.status !== undefined && object.status !== null
        ? egressStatusFromJSON(object.status)
        : 0;
    message.webComposite =
      object.webComposite !== undefined && object.webComposite !== null
        ? WebCompositeEgressRequest.fromJSON(object.webComposite)
        : undefined;
    message.trackComposite =
      object.trackComposite !== undefined && object.trackComposite !== null
        ? TrackCompositeEgressRequest.fromJSON(object.trackComposite)
        : undefined;
    message.track =
      object.track !== undefined && object.track !== null
        ? TrackEgressRequest.fromJSON(object.track)
        : undefined;
    message.stream =
      object.stream !== undefined && object.stream !== null
        ? StreamInfoList.fromJSON(object.stream)
        : undefined;
    message.file =
      object.file !== undefined && object.file !== null
        ? FileInfo.fromJSON(object.file)
        : undefined;
    message.error =
      object.error !== undefined && object.error !== null
        ? String(object.error)
        : "";
    return message;
  },

  toJSON(message: EgressInfo): unknown {
    const obj: any = {};
    message.egressId !== undefined && (obj.egressId = message.egressId);
    message.roomId !== undefined && (obj.roomId = message.roomId);
    message.status !== undefined &&
      (obj.status = egressStatusToJSON(message.status));
    message.webComposite !== undefined &&
      (obj.webComposite = message.webComposite
        ? WebCompositeEgressRequest.toJSON(message.webComposite)
        : undefined);
    message.trackComposite !== undefined &&
      (obj.trackComposite = message.trackComposite
        ? TrackCompositeEgressRequest.toJSON(message.trackComposite)
        : undefined);
    message.track !== undefined &&
      (obj.track = message.track
        ? TrackEgressRequest.toJSON(message.track)
        : undefined);
    message.stream !== undefined &&
      (obj.stream = message.stream
        ? StreamInfoList.toJSON(message.stream)
        : undefined);
    message.file !== undefined &&
      (obj.file = message.file ? FileInfo.toJSON(message.file) : undefined);
    message.error !== undefined && (obj.error = message.error);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EgressInfo>, I>>(
    object: I
  ): EgressInfo {
    const message = createBaseEgressInfo();
    message.egressId = object.egressId ?? "";
    message.roomId = object.roomId ?? "";
    message.status = object.status ?? 0;
    message.webComposite =
      object.webComposite !== undefined && object.webComposite !== null
        ? WebCompositeEgressRequest.fromPartial(object.webComposite)
        : undefined;
    message.trackComposite =
      object.trackComposite !== undefined && object.trackComposite !== null
        ? TrackCompositeEgressRequest.fromPartial(object.trackComposite)
        : undefined;
    message.track =
      object.track !== undefined && object.track !== null
        ? TrackEgressRequest.fromPartial(object.track)
        : undefined;
    message.stream =
      object.stream !== undefined && object.stream !== null
        ? StreamInfoList.fromPartial(object.stream)
        : undefined;
    message.file =
      object.file !== undefined && object.file !== null
        ? FileInfo.fromPartial(object.file)
        : undefined;
    message.error = object.error ?? "";
    return message;
  },
};

function createBaseStreamInfoList(): StreamInfoList {
  return { info: [] };
}

export const StreamInfoList = {
  encode(
    message: StreamInfoList,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.info) {
      StreamInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamInfoList {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamInfoList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.info.push(StreamInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamInfoList {
    const message = createBaseStreamInfoList();
    message.info = (object.info ?? []).map((e: any) => StreamInfo.fromJSON(e));
    return message;
  },

  toJSON(message: StreamInfoList): unknown {
    const obj: any = {};
    if (message.info) {
      obj.info = message.info.map((e) =>
        e ? StreamInfo.toJSON(e) : undefined
      );
    } else {
      obj.info = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StreamInfoList>, I>>(
    object: I
  ): StreamInfoList {
    const message = createBaseStreamInfoList();
    message.info = object.info?.map((e) => StreamInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseStreamInfo(): StreamInfo {
  return { url: "", startedAt: 0, endedAt: 0 };
}

export const StreamInfo = {
  encode(
    message: StreamInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    if (message.startedAt !== 0) {
      writer.uint32(16).int64(message.startedAt);
    }
    if (message.endedAt !== 0) {
      writer.uint32(24).int64(message.endedAt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.url = reader.string();
          break;
        case 2:
          message.startedAt = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.endedAt = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamInfo {
    const message = createBaseStreamInfo();
    message.url =
      object.url !== undefined && object.url !== null ? String(object.url) : "";
    message.startedAt =
      object.startedAt !== undefined && object.startedAt !== null
        ? Number(object.startedAt)
        : 0;
    message.endedAt =
      object.endedAt !== undefined && object.endedAt !== null
        ? Number(object.endedAt)
        : 0;
    return message;
  },

  toJSON(message: StreamInfo): unknown {
    const obj: any = {};
    message.url !== undefined && (obj.url = message.url);
    message.startedAt !== undefined &&
      (obj.startedAt = Math.round(message.startedAt));
    message.endedAt !== undefined &&
      (obj.endedAt = Math.round(message.endedAt));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StreamInfo>, I>>(
    object: I
  ): StreamInfo {
    const message = createBaseStreamInfo();
    message.url = object.url ?? "";
    message.startedAt = object.startedAt ?? 0;
    message.endedAt = object.endedAt ?? 0;
    return message;
  },
};

function createBaseFileInfo(): FileInfo {
  return { filename: "", startedAt: 0, endedAt: 0, size: 0, location: "" };
}

export const FileInfo = {
  encode(
    message: FileInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.filename !== "") {
      writer.uint32(10).string(message.filename);
    }
    if (message.startedAt !== 0) {
      writer.uint32(16).int64(message.startedAt);
    }
    if (message.endedAt !== 0) {
      writer.uint32(24).int64(message.endedAt);
    }
    if (message.size !== 0) {
      writer.uint32(32).int64(message.size);
    }
    if (message.location !== "") {
      writer.uint32(42).string(message.location);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FileInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filename = reader.string();
          break;
        case 2:
          message.startedAt = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.endedAt = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.size = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.location = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FileInfo {
    const message = createBaseFileInfo();
    message.filename =
      object.filename !== undefined && object.filename !== null
        ? String(object.filename)
        : "";
    message.startedAt =
      object.startedAt !== undefined && object.startedAt !== null
        ? Number(object.startedAt)
        : 0;
    message.endedAt =
      object.endedAt !== undefined && object.endedAt !== null
        ? Number(object.endedAt)
        : 0;
    message.size =
      object.size !== undefined && object.size !== null
        ? Number(object.size)
        : 0;
    message.location =
      object.location !== undefined && object.location !== null
        ? String(object.location)
        : "";
    return message;
  },

  toJSON(message: FileInfo): unknown {
    const obj: any = {};
    message.filename !== undefined && (obj.filename = message.filename);
    message.startedAt !== undefined &&
      (obj.startedAt = Math.round(message.startedAt));
    message.endedAt !== undefined &&
      (obj.endedAt = Math.round(message.endedAt));
    message.size !== undefined && (obj.size = Math.round(message.size));
    message.location !== undefined && (obj.location = message.location);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FileInfo>, I>>(object: I): FileInfo {
    const message = createBaseFileInfo();
    message.filename = object.filename ?? "";
    message.startedAt = object.startedAt ?? 0;
    message.endedAt = object.endedAt ?? 0;
    message.size = object.size ?? 0;
    message.location = object.location ?? "";
    return message;
  },
};

export interface Egress {
  /** start recording or streaming a room, participant, or tracks */
  StartWebCompositeEgress(
    request: WebCompositeEgressRequest
  ): Promise<EgressInfo>;
  /** update web composite layout */
  UpdateLayout(request: UpdateLayoutRequest): Promise<EgressInfo>;
  /** add or remove stream endpoints */
  UpdateStream(request: UpdateStreamRequest): Promise<EgressInfo>;
  /** list available egress */
  ListEgress(request: ListEgressRequest): Promise<ListEgressResponse>;
  /** stop a recording or stream */
  StopEgress(request: StopEgressRequest): Promise<EgressInfo>;
}

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
