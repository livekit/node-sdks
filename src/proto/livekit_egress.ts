/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  AudioCodec,
  audioCodecFromJSON,
  audioCodecToJSON,
  VideoCodec,
  videoCodecFromJSON,
  videoCodecToJSON,
} from "./livekit_models";

export const protobufPackage = "livekit";

export enum EncodedFileType {
  /** DEFAULT_FILETYPE - file type chosen based on codecs */
  DEFAULT_FILETYPE = 0,
  MP4 = 1,
  OGG = 2,
  UNRECOGNIZED = -1,
}

export function encodedFileTypeFromJSON(object: any): EncodedFileType {
  switch (object) {
    case 0:
    case "DEFAULT_FILETYPE":
      return EncodedFileType.DEFAULT_FILETYPE;
    case 1:
    case "MP4":
      return EncodedFileType.MP4;
    case 2:
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
    case EncodedFileType.DEFAULT_FILETYPE:
      return "DEFAULT_FILETYPE";
    case EncodedFileType.MP4:
      return "MP4";
    case EncodedFileType.OGG:
      return "OGG";
    case EncodedFileType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum SegmentedFileProtocol {
  DEFAULT_SEGMENTED_FILE_PROTOCOL = 0,
  HLS_PROTOCOL = 1,
  UNRECOGNIZED = -1,
}

export function segmentedFileProtocolFromJSON(object: any): SegmentedFileProtocol {
  switch (object) {
    case 0:
    case "DEFAULT_SEGMENTED_FILE_PROTOCOL":
      return SegmentedFileProtocol.DEFAULT_SEGMENTED_FILE_PROTOCOL;
    case 1:
    case "HLS_PROTOCOL":
      return SegmentedFileProtocol.HLS_PROTOCOL;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SegmentedFileProtocol.UNRECOGNIZED;
  }
}

export function segmentedFileProtocolToJSON(object: SegmentedFileProtocol): string {
  switch (object) {
    case SegmentedFileProtocol.DEFAULT_SEGMENTED_FILE_PROTOCOL:
      return "DEFAULT_SEGMENTED_FILE_PROTOCOL";
    case SegmentedFileProtocol.HLS_PROTOCOL:
      return "HLS_PROTOCOL";
    case SegmentedFileProtocol.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum SegmentedFileSuffix {
  INDEX = 0,
  TIMESTAMP = 1,
  UNRECOGNIZED = -1,
}

export function segmentedFileSuffixFromJSON(object: any): SegmentedFileSuffix {
  switch (object) {
    case 0:
    case "INDEX":
      return SegmentedFileSuffix.INDEX;
    case 1:
    case "TIMESTAMP":
      return SegmentedFileSuffix.TIMESTAMP;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SegmentedFileSuffix.UNRECOGNIZED;
  }
}

export function segmentedFileSuffixToJSON(object: SegmentedFileSuffix): string {
  switch (object) {
    case SegmentedFileSuffix.INDEX:
      return "INDEX";
    case SegmentedFileSuffix.TIMESTAMP:
      return "TIMESTAMP";
    case SegmentedFileSuffix.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum StreamProtocol {
  /** DEFAULT_PROTOCOL - protocol chosen based on urls */
  DEFAULT_PROTOCOL = 0,
  RTMP = 1,
  UNRECOGNIZED = -1,
}

export function streamProtocolFromJSON(object: any): StreamProtocol {
  switch (object) {
    case 0:
    case "DEFAULT_PROTOCOL":
      return StreamProtocol.DEFAULT_PROTOCOL;
    case 1:
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
    case StreamProtocol.DEFAULT_PROTOCOL:
      return "DEFAULT_PROTOCOL";
    case StreamProtocol.RTMP:
      return "RTMP";
    case StreamProtocol.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum EncodingOptionsPreset {
  /** H264_720P_30 - 1280x720, 30fps, 3000kpbs, H.264_MAIN / OPUS */
  H264_720P_30 = 0,
  /** H264_720P_60 - 1280x720, 60fps, 4500kbps, H.264_MAIN / OPUS */
  H264_720P_60 = 1,
  /** H264_1080P_30 - 1920x1080, 30fps, 4500kbps, H.264_MAIN / OPUS */
  H264_1080P_30 = 2,
  /** H264_1080P_60 - 1920x1080, 60fps, 6000kbps, H.264_MAIN / OPUS */
  H264_1080P_60 = 3,
  /** PORTRAIT_H264_720P_30 - 720x1280, 30fps, 3000kpbs, H.264_MAIN / OPUS */
  PORTRAIT_H264_720P_30 = 4,
  /** PORTRAIT_H264_720P_60 - 720x1280, 60fps, 4500kbps, H.264_MAIN / OPUS */
  PORTRAIT_H264_720P_60 = 5,
  /** PORTRAIT_H264_1080P_30 - 1080x1920, 30fps, 4500kbps, H.264_MAIN / OPUS */
  PORTRAIT_H264_1080P_30 = 6,
  /** PORTRAIT_H264_1080P_60 - 1080x1920, 60fps, 6000kbps, H.264_MAIN / OPUS */
  PORTRAIT_H264_1080P_60 = 7,
  UNRECOGNIZED = -1,
}

export function encodingOptionsPresetFromJSON(object: any): EncodingOptionsPreset {
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
    case 4:
    case "PORTRAIT_H264_720P_30":
      return EncodingOptionsPreset.PORTRAIT_H264_720P_30;
    case 5:
    case "PORTRAIT_H264_720P_60":
      return EncodingOptionsPreset.PORTRAIT_H264_720P_60;
    case 6:
    case "PORTRAIT_H264_1080P_30":
      return EncodingOptionsPreset.PORTRAIT_H264_1080P_30;
    case 7:
    case "PORTRAIT_H264_1080P_60":
      return EncodingOptionsPreset.PORTRAIT_H264_1080P_60;
    case -1:
    case "UNRECOGNIZED":
    default:
      return EncodingOptionsPreset.UNRECOGNIZED;
  }
}

export function encodingOptionsPresetToJSON(object: EncodingOptionsPreset): string {
  switch (object) {
    case EncodingOptionsPreset.H264_720P_30:
      return "H264_720P_30";
    case EncodingOptionsPreset.H264_720P_60:
      return "H264_720P_60";
    case EncodingOptionsPreset.H264_1080P_30:
      return "H264_1080P_30";
    case EncodingOptionsPreset.H264_1080P_60:
      return "H264_1080P_60";
    case EncodingOptionsPreset.PORTRAIT_H264_720P_30:
      return "PORTRAIT_H264_720P_30";
    case EncodingOptionsPreset.PORTRAIT_H264_720P_60:
      return "PORTRAIT_H264_720P_60";
    case EncodingOptionsPreset.PORTRAIT_H264_1080P_30:
      return "PORTRAIT_H264_1080P_30";
    case EncodingOptionsPreset.PORTRAIT_H264_1080P_60:
      return "PORTRAIT_H264_1080P_60";
    case EncodingOptionsPreset.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum EgressStatus {
  EGRESS_STARTING = 0,
  EGRESS_ACTIVE = 1,
  EGRESS_ENDING = 2,
  EGRESS_COMPLETE = 3,
  EGRESS_FAILED = 4,
  EGRESS_ABORTED = 5,
  EGRESS_LIMIT_REACHED = 6,
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
    case 4:
    case "EGRESS_FAILED":
      return EgressStatus.EGRESS_FAILED;
    case 5:
    case "EGRESS_ABORTED":
      return EgressStatus.EGRESS_ABORTED;
    case 6:
    case "EGRESS_LIMIT_REACHED":
      return EgressStatus.EGRESS_LIMIT_REACHED;
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
    case EgressStatus.EGRESS_FAILED:
      return "EGRESS_FAILED";
    case EgressStatus.EGRESS_ABORTED:
      return "EGRESS_ABORTED";
    case EgressStatus.EGRESS_LIMIT_REACHED:
      return "EGRESS_LIMIT_REACHED";
    case EgressStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** composite using a web browser */
export interface RoomCompositeEgressRequest {
  /** required */
  roomName?: string;
  /** (optional) */
  layout?: string;
  /** (default false) */
  audioOnly?: boolean;
  /** (default false) */
  videoOnly?: boolean;
  /** template base url (default https://recorder.livekit.io) */
  customBaseUrl?: string;
  /** @deprecated */
  file?:
    | EncodedFileOutput
    | undefined;
  /** @deprecated */
  stream?:
    | StreamOutput
    | undefined;
  /** @deprecated */
  segments?:
    | SegmentedFileOutput
    | undefined;
  /** (default H264_720P_30) */
  preset?:
    | EncodingOptionsPreset
    | undefined;
  /** (optional) */
  advanced?: EncodingOptions | undefined;
  fileOutputs?: EncodedFileOutput[];
  streamOutputs?: StreamOutput[];
  segmentOutputs?: SegmentedFileOutput[];
}

/** record any website */
export interface WebEgressRequest {
  url?: string;
  audioOnly?: boolean;
  videoOnly?: boolean;
  awaitStartSignal?: boolean;
  /** @deprecated */
  file?:
    | EncodedFileOutput
    | undefined;
  /** @deprecated */
  stream?:
    | StreamOutput
    | undefined;
  /** @deprecated */
  segments?: SegmentedFileOutput | undefined;
  preset?: EncodingOptionsPreset | undefined;
  advanced?: EncodingOptions | undefined;
  fileOutputs?: EncodedFileOutput[];
  streamOutputs?: StreamOutput[];
  segmentOutputs?: SegmentedFileOutput[];
}

/** containerize up to one audio and one video track */
export interface TrackCompositeEgressRequest {
  /** required */
  roomName?: string;
  /** (optional) */
  audioTrackId?: string;
  /** (optional) */
  videoTrackId?: string;
  /** @deprecated */
  file?:
    | EncodedFileOutput
    | undefined;
  /** @deprecated */
  stream?:
    | StreamOutput
    | undefined;
  /** @deprecated */
  segments?:
    | SegmentedFileOutput
    | undefined;
  /** (default H264_720P_30) */
  preset?:
    | EncodingOptionsPreset
    | undefined;
  /** (optional) */
  advanced?: EncodingOptions | undefined;
  fileOutputs?: EncodedFileOutput[];
  streamOutputs?: StreamOutput[];
  segmentOutputs?: SegmentedFileOutput[];
}

/** record tracks individually, without transcoding */
export interface TrackEgressRequest {
  /** required */
  roomName?: string;
  /** required */
  trackId?: string;
  file?: DirectFileOutput | undefined;
  websocketUrl?: string | undefined;
}

export interface EncodedFileOutput {
  /** (optional) */
  fileType?: EncodedFileType;
  /** see egress docs for templating (default {room_name}-{time}) */
  filepath?: string;
  /** disable upload of manifest file (default false) */
  disableManifest?: boolean;
  s3?: S3Upload | undefined;
  gcp?: GCPUpload | undefined;
  azure?: AzureBlobUpload | undefined;
  aliOSS?: AliOSSUpload | undefined;
}

/** Used to generate HLS segments or other kind of segmented output */
export interface SegmentedFileOutput {
  /** (optional) */
  protocol?: SegmentedFileProtocol;
  /** (optional) */
  filenamePrefix?: string;
  /** (optional) */
  playlistName?: string;
  /** in seconds (optional) */
  segmentDuration?: number;
  /** (optional, default INDEX) */
  filenameSuffix?: SegmentedFileSuffix;
  /** disable upload of manifest file (default false) */
  disableManifest?: boolean;
  s3?: S3Upload | undefined;
  gcp?: GCPUpload | undefined;
  azure?: AzureBlobUpload | undefined;
  aliOSS?: AliOSSUpload | undefined;
}

export interface DirectFileOutput {
  /** see egress docs for templating (default {track_id}-{time}) */
  filepath?: string;
  /** disable upload of manifest file (default false) */
  disableManifest?: boolean;
  s3?: S3Upload | undefined;
  gcp?: GCPUpload | undefined;
  azure?: AzureBlobUpload | undefined;
  aliOSS?: AliOSSUpload | undefined;
}

export interface S3Upload {
  accessKey?: string;
  secret?: string;
  region?: string;
  endpoint?: string;
  bucket?: string;
  forcePathStyle?: boolean;
  metadata?: { [key: string]: string };
  tagging?: string;
}

export interface S3Upload_MetadataEntry {
  key: string;
  value: string;
}

export interface GCPUpload {
  credentials?: string;
  bucket?: string;
}

export interface AzureBlobUpload {
  accountName?: string;
  accountKey?: string;
  containerName?: string;
}

export interface AliOSSUpload {
  accessKey?: string;
  secret?: string;
  region?: string;
  endpoint?: string;
  bucket?: string;
}

export interface StreamOutput {
  /** required */
  protocol?: StreamProtocol;
  /** required */
  urls?: string[];
}

export interface EncodingOptions {
  /** (default 1920) */
  width?: number;
  /** (default 1080) */
  height?: number;
  /** (default 24) */
  depth?: number;
  /** (default 30) */
  framerate?: number;
  /** (default OPUS) */
  audioCodec?: AudioCodec;
  /** (default 128) */
  audioBitrate?: number;
  /** (default 44100) */
  audioFrequency?: number;
  /** (default H264_MAIN) */
  videoCodec?: VideoCodec;
  /** (default 4500) */
  videoBitrate?: number;
  /** in seconds (default 4s for streaming, segment duration for segmented output, encoder default for files) */
  keyFrameInterval?: number;
}

export interface UpdateLayoutRequest {
  egressId?: string;
  layout?: string;
}

export interface UpdateStreamRequest {
  egressId?: string;
  addOutputUrls?: string[];
  removeOutputUrls?: string[];
}

export interface ListEgressRequest {
  /** (optional, filter by room name) */
  roomName?: string;
  /** (optional, filter by egress ID) */
  egressId?: string;
  /** (optional, list active egress only) */
  active?: boolean;
}

export interface ListEgressResponse {
  items?: EgressInfo[];
}

export interface StopEgressRequest {
  egressId?: string;
}

export interface EgressInfo {
  egressId?: string;
  roomId?: string;
  roomName?: string;
  status?: EgressStatus;
  startedAt?: number;
  endedAt?: number;
  updatedAt?: number;
  error?: string;
  roomComposite?: RoomCompositeEgressRequest | undefined;
  trackComposite?: TrackCompositeEgressRequest | undefined;
  track?: TrackEgressRequest | undefined;
  web?:
    | WebEgressRequest
    | undefined;
  /** @deprecated */
  stream?:
    | StreamInfoList
    | undefined;
  /** @deprecated */
  file?:
    | FileInfo
    | undefined;
  /** @deprecated */
  segments?: SegmentsInfo | undefined;
  streamResults?: StreamInfo[];
  fileResults?: FileInfo[];
  segmentResults?: SegmentsInfo[];
}

/** @deprecated */
export interface StreamInfoList {
  info?: StreamInfo[];
}

export interface StreamInfo {
  url?: string;
  startedAt?: number;
  endedAt?: number;
  duration?: number;
  status?: StreamInfo_Status;
  error?: string;
}

export enum StreamInfo_Status {
  ACTIVE = 0,
  FINISHED = 1,
  FAILED = 2,
  UNRECOGNIZED = -1,
}

export function streamInfo_StatusFromJSON(object: any): StreamInfo_Status {
  switch (object) {
    case 0:
    case "ACTIVE":
      return StreamInfo_Status.ACTIVE;
    case 1:
    case "FINISHED":
      return StreamInfo_Status.FINISHED;
    case 2:
    case "FAILED":
      return StreamInfo_Status.FAILED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return StreamInfo_Status.UNRECOGNIZED;
  }
}

export function streamInfo_StatusToJSON(object: StreamInfo_Status): string {
  switch (object) {
    case StreamInfo_Status.ACTIVE:
      return "ACTIVE";
    case StreamInfo_Status.FINISHED:
      return "FINISHED";
    case StreamInfo_Status.FAILED:
      return "FAILED";
    case StreamInfo_Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface FileInfo {
  filename?: string;
  startedAt?: number;
  endedAt?: number;
  duration?: number;
  size?: number;
  location?: string;
}

export interface SegmentsInfo {
  playlistName?: string;
  duration?: number;
  size?: number;
  playlistLocation?: string;
  segmentCount?: number;
  startedAt?: number;
  endedAt?: number;
}

export interface AutoTrackEgress {
  /** see docs for templating (default {track_id}-{time}) */
  filepath?: string;
  /** disables upload of json manifest file (default false) */
  disableManifest?: boolean;
  s3?: S3Upload | undefined;
  gcp?: GCPUpload | undefined;
  azure?: AzureBlobUpload | undefined;
}

function createBaseRoomCompositeEgressRequest(): RoomCompositeEgressRequest {
  return {
    roomName: "",
    layout: "",
    audioOnly: false,
    videoOnly: false,
    customBaseUrl: "",
    file: undefined,
    stream: undefined,
    segments: undefined,
    preset: undefined,
    advanced: undefined,
    fileOutputs: [],
    streamOutputs: [],
    segmentOutputs: [],
  };
}

export const RoomCompositeEgressRequest = {
  encode(message: RoomCompositeEgressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomName !== undefined && message.roomName !== "") {
      writer.uint32(10).string(message.roomName);
    }
    if (message.layout !== undefined && message.layout !== "") {
      writer.uint32(18).string(message.layout);
    }
    if (message.audioOnly === true) {
      writer.uint32(24).bool(message.audioOnly);
    }
    if (message.videoOnly === true) {
      writer.uint32(32).bool(message.videoOnly);
    }
    if (message.customBaseUrl !== undefined && message.customBaseUrl !== "") {
      writer.uint32(42).string(message.customBaseUrl);
    }
    if (message.file !== undefined) {
      EncodedFileOutput.encode(message.file, writer.uint32(50).fork()).ldelim();
    }
    if (message.stream !== undefined) {
      StreamOutput.encode(message.stream, writer.uint32(58).fork()).ldelim();
    }
    if (message.segments !== undefined) {
      SegmentedFileOutput.encode(message.segments, writer.uint32(82).fork()).ldelim();
    }
    if (message.preset !== undefined) {
      writer.uint32(64).int32(message.preset);
    }
    if (message.advanced !== undefined) {
      EncodingOptions.encode(message.advanced, writer.uint32(74).fork()).ldelim();
    }
    if (message.fileOutputs !== undefined && message.fileOutputs.length !== 0) {
      for (const v of message.fileOutputs) {
        EncodedFileOutput.encode(v!, writer.uint32(90).fork()).ldelim();
      }
    }
    if (message.streamOutputs !== undefined && message.streamOutputs.length !== 0) {
      for (const v of message.streamOutputs) {
        StreamOutput.encode(v!, writer.uint32(98).fork()).ldelim();
      }
    }
    if (message.segmentOutputs !== undefined && message.segmentOutputs.length !== 0) {
      for (const v of message.segmentOutputs) {
        SegmentedFileOutput.encode(v!, writer.uint32(106).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RoomCompositeEgressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRoomCompositeEgressRequest();
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
        case 10:
          message.segments = SegmentedFileOutput.decode(reader, reader.uint32());
          break;
        case 8:
          message.preset = reader.int32() as any;
          break;
        case 9:
          message.advanced = EncodingOptions.decode(reader, reader.uint32());
          break;
        case 11:
          message.fileOutputs!.push(EncodedFileOutput.decode(reader, reader.uint32()));
          break;
        case 12:
          message.streamOutputs!.push(StreamOutput.decode(reader, reader.uint32()));
          break;
        case 13:
          message.segmentOutputs!.push(SegmentedFileOutput.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RoomCompositeEgressRequest {
    return {
      roomName: isSet(object.roomName) ? String(object.roomName) : "",
      layout: isSet(object.layout) ? String(object.layout) : "",
      audioOnly: isSet(object.audioOnly) ? Boolean(object.audioOnly) : false,
      videoOnly: isSet(object.videoOnly) ? Boolean(object.videoOnly) : false,
      customBaseUrl: isSet(object.customBaseUrl) ? String(object.customBaseUrl) : "",
      file: isSet(object.file) ? EncodedFileOutput.fromJSON(object.file) : undefined,
      stream: isSet(object.stream) ? StreamOutput.fromJSON(object.stream) : undefined,
      segments: isSet(object.segments) ? SegmentedFileOutput.fromJSON(object.segments) : undefined,
      preset: isSet(object.preset) ? encodingOptionsPresetFromJSON(object.preset) : undefined,
      advanced: isSet(object.advanced) ? EncodingOptions.fromJSON(object.advanced) : undefined,
      fileOutputs: Array.isArray(object?.fileOutputs)
        ? object.fileOutputs.map((e: any) => EncodedFileOutput.fromJSON(e))
        : [],
      streamOutputs: Array.isArray(object?.streamOutputs)
        ? object.streamOutputs.map((e: any) => StreamOutput.fromJSON(e))
        : [],
      segmentOutputs: Array.isArray(object?.segmentOutputs)
        ? object.segmentOutputs.map((e: any) => SegmentedFileOutput.fromJSON(e))
        : [],
    };
  },

  toJSON(message: RoomCompositeEgressRequest): unknown {
    const obj: any = {};
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.layout !== undefined && (obj.layout = message.layout);
    message.audioOnly !== undefined && (obj.audioOnly = message.audioOnly);
    message.videoOnly !== undefined && (obj.videoOnly = message.videoOnly);
    message.customBaseUrl !== undefined && (obj.customBaseUrl = message.customBaseUrl);
    message.file !== undefined && (obj.file = message.file ? EncodedFileOutput.toJSON(message.file) : undefined);
    message.stream !== undefined && (obj.stream = message.stream ? StreamOutput.toJSON(message.stream) : undefined);
    message.segments !== undefined &&
      (obj.segments = message.segments ? SegmentedFileOutput.toJSON(message.segments) : undefined);
    message.preset !== undefined &&
      (obj.preset = message.preset !== undefined ? encodingOptionsPresetToJSON(message.preset) : undefined);
    message.advanced !== undefined &&
      (obj.advanced = message.advanced ? EncodingOptions.toJSON(message.advanced) : undefined);
    if (message.fileOutputs) {
      obj.fileOutputs = message.fileOutputs.map((e) => e ? EncodedFileOutput.toJSON(e) : undefined);
    } else {
      obj.fileOutputs = [];
    }
    if (message.streamOutputs) {
      obj.streamOutputs = message.streamOutputs.map((e) => e ? StreamOutput.toJSON(e) : undefined);
    } else {
      obj.streamOutputs = [];
    }
    if (message.segmentOutputs) {
      obj.segmentOutputs = message.segmentOutputs.map((e) => e ? SegmentedFileOutput.toJSON(e) : undefined);
    } else {
      obj.segmentOutputs = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RoomCompositeEgressRequest>, I>>(object: I): RoomCompositeEgressRequest {
    const message = createBaseRoomCompositeEgressRequest();
    message.roomName = object.roomName ?? "";
    message.layout = object.layout ?? "";
    message.audioOnly = object.audioOnly ?? false;
    message.videoOnly = object.videoOnly ?? false;
    message.customBaseUrl = object.customBaseUrl ?? "";
    message.file = (object.file !== undefined && object.file !== null)
      ? EncodedFileOutput.fromPartial(object.file)
      : undefined;
    message.stream = (object.stream !== undefined && object.stream !== null)
      ? StreamOutput.fromPartial(object.stream)
      : undefined;
    message.segments = (object.segments !== undefined && object.segments !== null)
      ? SegmentedFileOutput.fromPartial(object.segments)
      : undefined;
    message.preset = object.preset ?? undefined;
    message.advanced = (object.advanced !== undefined && object.advanced !== null)
      ? EncodingOptions.fromPartial(object.advanced)
      : undefined;
    message.fileOutputs = object.fileOutputs?.map((e) => EncodedFileOutput.fromPartial(e)) || [];
    message.streamOutputs = object.streamOutputs?.map((e) => StreamOutput.fromPartial(e)) || [];
    message.segmentOutputs = object.segmentOutputs?.map((e) => SegmentedFileOutput.fromPartial(e)) || [];
    return message;
  },
};

function createBaseWebEgressRequest(): WebEgressRequest {
  return {
    url: "",
    audioOnly: false,
    videoOnly: false,
    awaitStartSignal: false,
    file: undefined,
    stream: undefined,
    segments: undefined,
    preset: undefined,
    advanced: undefined,
    fileOutputs: [],
    streamOutputs: [],
    segmentOutputs: [],
  };
}

export const WebEgressRequest = {
  encode(message: WebEgressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.url !== undefined && message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    if (message.audioOnly === true) {
      writer.uint32(16).bool(message.audioOnly);
    }
    if (message.videoOnly === true) {
      writer.uint32(24).bool(message.videoOnly);
    }
    if (message.awaitStartSignal === true) {
      writer.uint32(96).bool(message.awaitStartSignal);
    }
    if (message.file !== undefined) {
      EncodedFileOutput.encode(message.file, writer.uint32(34).fork()).ldelim();
    }
    if (message.stream !== undefined) {
      StreamOutput.encode(message.stream, writer.uint32(42).fork()).ldelim();
    }
    if (message.segments !== undefined) {
      SegmentedFileOutput.encode(message.segments, writer.uint32(50).fork()).ldelim();
    }
    if (message.preset !== undefined) {
      writer.uint32(56).int32(message.preset);
    }
    if (message.advanced !== undefined) {
      EncodingOptions.encode(message.advanced, writer.uint32(66).fork()).ldelim();
    }
    if (message.fileOutputs !== undefined && message.fileOutputs.length !== 0) {
      for (const v of message.fileOutputs) {
        EncodedFileOutput.encode(v!, writer.uint32(74).fork()).ldelim();
      }
    }
    if (message.streamOutputs !== undefined && message.streamOutputs.length !== 0) {
      for (const v of message.streamOutputs) {
        StreamOutput.encode(v!, writer.uint32(82).fork()).ldelim();
      }
    }
    if (message.segmentOutputs !== undefined && message.segmentOutputs.length !== 0) {
      for (const v of message.segmentOutputs) {
        SegmentedFileOutput.encode(v!, writer.uint32(90).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WebEgressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWebEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.url = reader.string();
          break;
        case 2:
          message.audioOnly = reader.bool();
          break;
        case 3:
          message.videoOnly = reader.bool();
          break;
        case 12:
          message.awaitStartSignal = reader.bool();
          break;
        case 4:
          message.file = EncodedFileOutput.decode(reader, reader.uint32());
          break;
        case 5:
          message.stream = StreamOutput.decode(reader, reader.uint32());
          break;
        case 6:
          message.segments = SegmentedFileOutput.decode(reader, reader.uint32());
          break;
        case 7:
          message.preset = reader.int32() as any;
          break;
        case 8:
          message.advanced = EncodingOptions.decode(reader, reader.uint32());
          break;
        case 9:
          message.fileOutputs!.push(EncodedFileOutput.decode(reader, reader.uint32()));
          break;
        case 10:
          message.streamOutputs!.push(StreamOutput.decode(reader, reader.uint32()));
          break;
        case 11:
          message.segmentOutputs!.push(SegmentedFileOutput.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WebEgressRequest {
    return {
      url: isSet(object.url) ? String(object.url) : "",
      audioOnly: isSet(object.audioOnly) ? Boolean(object.audioOnly) : false,
      videoOnly: isSet(object.videoOnly) ? Boolean(object.videoOnly) : false,
      awaitStartSignal: isSet(object.awaitStartSignal) ? Boolean(object.awaitStartSignal) : false,
      file: isSet(object.file) ? EncodedFileOutput.fromJSON(object.file) : undefined,
      stream: isSet(object.stream) ? StreamOutput.fromJSON(object.stream) : undefined,
      segments: isSet(object.segments) ? SegmentedFileOutput.fromJSON(object.segments) : undefined,
      preset: isSet(object.preset) ? encodingOptionsPresetFromJSON(object.preset) : undefined,
      advanced: isSet(object.advanced) ? EncodingOptions.fromJSON(object.advanced) : undefined,
      fileOutputs: Array.isArray(object?.fileOutputs)
        ? object.fileOutputs.map((e: any) => EncodedFileOutput.fromJSON(e))
        : [],
      streamOutputs: Array.isArray(object?.streamOutputs)
        ? object.streamOutputs.map((e: any) => StreamOutput.fromJSON(e))
        : [],
      segmentOutputs: Array.isArray(object?.segmentOutputs)
        ? object.segmentOutputs.map((e: any) => SegmentedFileOutput.fromJSON(e))
        : [],
    };
  },

  toJSON(message: WebEgressRequest): unknown {
    const obj: any = {};
    message.url !== undefined && (obj.url = message.url);
    message.audioOnly !== undefined && (obj.audioOnly = message.audioOnly);
    message.videoOnly !== undefined && (obj.videoOnly = message.videoOnly);
    message.awaitStartSignal !== undefined && (obj.awaitStartSignal = message.awaitStartSignal);
    message.file !== undefined && (obj.file = message.file ? EncodedFileOutput.toJSON(message.file) : undefined);
    message.stream !== undefined && (obj.stream = message.stream ? StreamOutput.toJSON(message.stream) : undefined);
    message.segments !== undefined &&
      (obj.segments = message.segments ? SegmentedFileOutput.toJSON(message.segments) : undefined);
    message.preset !== undefined &&
      (obj.preset = message.preset !== undefined ? encodingOptionsPresetToJSON(message.preset) : undefined);
    message.advanced !== undefined &&
      (obj.advanced = message.advanced ? EncodingOptions.toJSON(message.advanced) : undefined);
    if (message.fileOutputs) {
      obj.fileOutputs = message.fileOutputs.map((e) => e ? EncodedFileOutput.toJSON(e) : undefined);
    } else {
      obj.fileOutputs = [];
    }
    if (message.streamOutputs) {
      obj.streamOutputs = message.streamOutputs.map((e) => e ? StreamOutput.toJSON(e) : undefined);
    } else {
      obj.streamOutputs = [];
    }
    if (message.segmentOutputs) {
      obj.segmentOutputs = message.segmentOutputs.map((e) => e ? SegmentedFileOutput.toJSON(e) : undefined);
    } else {
      obj.segmentOutputs = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<WebEgressRequest>, I>>(object: I): WebEgressRequest {
    const message = createBaseWebEgressRequest();
    message.url = object.url ?? "";
    message.audioOnly = object.audioOnly ?? false;
    message.videoOnly = object.videoOnly ?? false;
    message.awaitStartSignal = object.awaitStartSignal ?? false;
    message.file = (object.file !== undefined && object.file !== null)
      ? EncodedFileOutput.fromPartial(object.file)
      : undefined;
    message.stream = (object.stream !== undefined && object.stream !== null)
      ? StreamOutput.fromPartial(object.stream)
      : undefined;
    message.segments = (object.segments !== undefined && object.segments !== null)
      ? SegmentedFileOutput.fromPartial(object.segments)
      : undefined;
    message.preset = object.preset ?? undefined;
    message.advanced = (object.advanced !== undefined && object.advanced !== null)
      ? EncodingOptions.fromPartial(object.advanced)
      : undefined;
    message.fileOutputs = object.fileOutputs?.map((e) => EncodedFileOutput.fromPartial(e)) || [];
    message.streamOutputs = object.streamOutputs?.map((e) => StreamOutput.fromPartial(e)) || [];
    message.segmentOutputs = object.segmentOutputs?.map((e) => SegmentedFileOutput.fromPartial(e)) || [];
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
    segments: undefined,
    preset: undefined,
    advanced: undefined,
    fileOutputs: [],
    streamOutputs: [],
    segmentOutputs: [],
  };
}

export const TrackCompositeEgressRequest = {
  encode(message: TrackCompositeEgressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomName !== undefined && message.roomName !== "") {
      writer.uint32(10).string(message.roomName);
    }
    if (message.audioTrackId !== undefined && message.audioTrackId !== "") {
      writer.uint32(18).string(message.audioTrackId);
    }
    if (message.videoTrackId !== undefined && message.videoTrackId !== "") {
      writer.uint32(26).string(message.videoTrackId);
    }
    if (message.file !== undefined) {
      EncodedFileOutput.encode(message.file, writer.uint32(34).fork()).ldelim();
    }
    if (message.stream !== undefined) {
      StreamOutput.encode(message.stream, writer.uint32(42).fork()).ldelim();
    }
    if (message.segments !== undefined) {
      SegmentedFileOutput.encode(message.segments, writer.uint32(66).fork()).ldelim();
    }
    if (message.preset !== undefined) {
      writer.uint32(48).int32(message.preset);
    }
    if (message.advanced !== undefined) {
      EncodingOptions.encode(message.advanced, writer.uint32(58).fork()).ldelim();
    }
    if (message.fileOutputs !== undefined && message.fileOutputs.length !== 0) {
      for (const v of message.fileOutputs) {
        EncodedFileOutput.encode(v!, writer.uint32(90).fork()).ldelim();
      }
    }
    if (message.streamOutputs !== undefined && message.streamOutputs.length !== 0) {
      for (const v of message.streamOutputs) {
        StreamOutput.encode(v!, writer.uint32(98).fork()).ldelim();
      }
    }
    if (message.segmentOutputs !== undefined && message.segmentOutputs.length !== 0) {
      for (const v of message.segmentOutputs) {
        SegmentedFileOutput.encode(v!, writer.uint32(106).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TrackCompositeEgressRequest {
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
        case 8:
          message.segments = SegmentedFileOutput.decode(reader, reader.uint32());
          break;
        case 6:
          message.preset = reader.int32() as any;
          break;
        case 7:
          message.advanced = EncodingOptions.decode(reader, reader.uint32());
          break;
        case 11:
          message.fileOutputs!.push(EncodedFileOutput.decode(reader, reader.uint32()));
          break;
        case 12:
          message.streamOutputs!.push(StreamOutput.decode(reader, reader.uint32()));
          break;
        case 13:
          message.segmentOutputs!.push(SegmentedFileOutput.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TrackCompositeEgressRequest {
    return {
      roomName: isSet(object.roomName) ? String(object.roomName) : "",
      audioTrackId: isSet(object.audioTrackId) ? String(object.audioTrackId) : "",
      videoTrackId: isSet(object.videoTrackId) ? String(object.videoTrackId) : "",
      file: isSet(object.file) ? EncodedFileOutput.fromJSON(object.file) : undefined,
      stream: isSet(object.stream) ? StreamOutput.fromJSON(object.stream) : undefined,
      segments: isSet(object.segments) ? SegmentedFileOutput.fromJSON(object.segments) : undefined,
      preset: isSet(object.preset) ? encodingOptionsPresetFromJSON(object.preset) : undefined,
      advanced: isSet(object.advanced) ? EncodingOptions.fromJSON(object.advanced) : undefined,
      fileOutputs: Array.isArray(object?.fileOutputs)
        ? object.fileOutputs.map((e: any) => EncodedFileOutput.fromJSON(e))
        : [],
      streamOutputs: Array.isArray(object?.streamOutputs)
        ? object.streamOutputs.map((e: any) => StreamOutput.fromJSON(e))
        : [],
      segmentOutputs: Array.isArray(object?.segmentOutputs)
        ? object.segmentOutputs.map((e: any) => SegmentedFileOutput.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TrackCompositeEgressRequest): unknown {
    const obj: any = {};
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.audioTrackId !== undefined && (obj.audioTrackId = message.audioTrackId);
    message.videoTrackId !== undefined && (obj.videoTrackId = message.videoTrackId);
    message.file !== undefined && (obj.file = message.file ? EncodedFileOutput.toJSON(message.file) : undefined);
    message.stream !== undefined && (obj.stream = message.stream ? StreamOutput.toJSON(message.stream) : undefined);
    message.segments !== undefined &&
      (obj.segments = message.segments ? SegmentedFileOutput.toJSON(message.segments) : undefined);
    message.preset !== undefined &&
      (obj.preset = message.preset !== undefined ? encodingOptionsPresetToJSON(message.preset) : undefined);
    message.advanced !== undefined &&
      (obj.advanced = message.advanced ? EncodingOptions.toJSON(message.advanced) : undefined);
    if (message.fileOutputs) {
      obj.fileOutputs = message.fileOutputs.map((e) => e ? EncodedFileOutput.toJSON(e) : undefined);
    } else {
      obj.fileOutputs = [];
    }
    if (message.streamOutputs) {
      obj.streamOutputs = message.streamOutputs.map((e) => e ? StreamOutput.toJSON(e) : undefined);
    } else {
      obj.streamOutputs = [];
    }
    if (message.segmentOutputs) {
      obj.segmentOutputs = message.segmentOutputs.map((e) => e ? SegmentedFileOutput.toJSON(e) : undefined);
    } else {
      obj.segmentOutputs = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TrackCompositeEgressRequest>, I>>(object: I): TrackCompositeEgressRequest {
    const message = createBaseTrackCompositeEgressRequest();
    message.roomName = object.roomName ?? "";
    message.audioTrackId = object.audioTrackId ?? "";
    message.videoTrackId = object.videoTrackId ?? "";
    message.file = (object.file !== undefined && object.file !== null)
      ? EncodedFileOutput.fromPartial(object.file)
      : undefined;
    message.stream = (object.stream !== undefined && object.stream !== null)
      ? StreamOutput.fromPartial(object.stream)
      : undefined;
    message.segments = (object.segments !== undefined && object.segments !== null)
      ? SegmentedFileOutput.fromPartial(object.segments)
      : undefined;
    message.preset = object.preset ?? undefined;
    message.advanced = (object.advanced !== undefined && object.advanced !== null)
      ? EncodingOptions.fromPartial(object.advanced)
      : undefined;
    message.fileOutputs = object.fileOutputs?.map((e) => EncodedFileOutput.fromPartial(e)) || [];
    message.streamOutputs = object.streamOutputs?.map((e) => StreamOutput.fromPartial(e)) || [];
    message.segmentOutputs = object.segmentOutputs?.map((e) => SegmentedFileOutput.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTrackEgressRequest(): TrackEgressRequest {
  return { roomName: "", trackId: "", file: undefined, websocketUrl: undefined };
}

export const TrackEgressRequest = {
  encode(message: TrackEgressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomName !== undefined && message.roomName !== "") {
      writer.uint32(10).string(message.roomName);
    }
    if (message.trackId !== undefined && message.trackId !== "") {
      writer.uint32(18).string(message.trackId);
    }
    if (message.file !== undefined) {
      DirectFileOutput.encode(message.file, writer.uint32(26).fork()).ldelim();
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
          message.file = DirectFileOutput.decode(reader, reader.uint32());
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
    return {
      roomName: isSet(object.roomName) ? String(object.roomName) : "",
      trackId: isSet(object.trackId) ? String(object.trackId) : "",
      file: isSet(object.file) ? DirectFileOutput.fromJSON(object.file) : undefined,
      websocketUrl: isSet(object.websocketUrl) ? String(object.websocketUrl) : undefined,
    };
  },

  toJSON(message: TrackEgressRequest): unknown {
    const obj: any = {};
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.trackId !== undefined && (obj.trackId = message.trackId);
    message.file !== undefined && (obj.file = message.file ? DirectFileOutput.toJSON(message.file) : undefined);
    message.websocketUrl !== undefined && (obj.websocketUrl = message.websocketUrl);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TrackEgressRequest>, I>>(object: I): TrackEgressRequest {
    const message = createBaseTrackEgressRequest();
    message.roomName = object.roomName ?? "";
    message.trackId = object.trackId ?? "";
    message.file = (object.file !== undefined && object.file !== null)
      ? DirectFileOutput.fromPartial(object.file)
      : undefined;
    message.websocketUrl = object.websocketUrl ?? undefined;
    return message;
  },
};

function createBaseEncodedFileOutput(): EncodedFileOutput {
  return {
    fileType: 0,
    filepath: "",
    disableManifest: false,
    s3: undefined,
    gcp: undefined,
    azure: undefined,
    aliOSS: undefined,
  };
}

export const EncodedFileOutput = {
  encode(message: EncodedFileOutput, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fileType !== undefined && message.fileType !== 0) {
      writer.uint32(8).int32(message.fileType);
    }
    if (message.filepath !== undefined && message.filepath !== "") {
      writer.uint32(18).string(message.filepath);
    }
    if (message.disableManifest === true) {
      writer.uint32(48).bool(message.disableManifest);
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
    if (message.aliOSS !== undefined) {
      AliOSSUpload.encode(message.aliOSS, writer.uint32(58).fork()).ldelim();
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
        case 6:
          message.disableManifest = reader.bool();
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
        case 7:
          message.aliOSS = AliOSSUpload.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EncodedFileOutput {
    return {
      fileType: isSet(object.fileType) ? encodedFileTypeFromJSON(object.fileType) : 0,
      filepath: isSet(object.filepath) ? String(object.filepath) : "",
      disableManifest: isSet(object.disableManifest) ? Boolean(object.disableManifest) : false,
      s3: isSet(object.s3) ? S3Upload.fromJSON(object.s3) : undefined,
      gcp: isSet(object.gcp) ? GCPUpload.fromJSON(object.gcp) : undefined,
      azure: isSet(object.azure) ? AzureBlobUpload.fromJSON(object.azure) : undefined,
      aliOSS: isSet(object.aliOSS) ? AliOSSUpload.fromJSON(object.aliOSS) : undefined,
    };
  },

  toJSON(message: EncodedFileOutput): unknown {
    const obj: any = {};
    message.fileType !== undefined && (obj.fileType = encodedFileTypeToJSON(message.fileType));
    message.filepath !== undefined && (obj.filepath = message.filepath);
    message.disableManifest !== undefined && (obj.disableManifest = message.disableManifest);
    message.s3 !== undefined && (obj.s3 = message.s3 ? S3Upload.toJSON(message.s3) : undefined);
    message.gcp !== undefined && (obj.gcp = message.gcp ? GCPUpload.toJSON(message.gcp) : undefined);
    message.azure !== undefined && (obj.azure = message.azure ? AzureBlobUpload.toJSON(message.azure) : undefined);
    message.aliOSS !== undefined && (obj.aliOSS = message.aliOSS ? AliOSSUpload.toJSON(message.aliOSS) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EncodedFileOutput>, I>>(object: I): EncodedFileOutput {
    const message = createBaseEncodedFileOutput();
    message.fileType = object.fileType ?? 0;
    message.filepath = object.filepath ?? "";
    message.disableManifest = object.disableManifest ?? false;
    message.s3 = (object.s3 !== undefined && object.s3 !== null) ? S3Upload.fromPartial(object.s3) : undefined;
    message.gcp = (object.gcp !== undefined && object.gcp !== null) ? GCPUpload.fromPartial(object.gcp) : undefined;
    message.azure = (object.azure !== undefined && object.azure !== null)
      ? AzureBlobUpload.fromPartial(object.azure)
      : undefined;
    message.aliOSS = (object.aliOSS !== undefined && object.aliOSS !== null)
      ? AliOSSUpload.fromPartial(object.aliOSS)
      : undefined;
    return message;
  },
};

function createBaseSegmentedFileOutput(): SegmentedFileOutput {
  return {
    protocol: 0,
    filenamePrefix: "",
    playlistName: "",
    segmentDuration: 0,
    filenameSuffix: 0,
    disableManifest: false,
    s3: undefined,
    gcp: undefined,
    azure: undefined,
    aliOSS: undefined,
  };
}

export const SegmentedFileOutput = {
  encode(message: SegmentedFileOutput, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.protocol !== undefined && message.protocol !== 0) {
      writer.uint32(8).int32(message.protocol);
    }
    if (message.filenamePrefix !== undefined && message.filenamePrefix !== "") {
      writer.uint32(18).string(message.filenamePrefix);
    }
    if (message.playlistName !== undefined && message.playlistName !== "") {
      writer.uint32(26).string(message.playlistName);
    }
    if (message.segmentDuration !== undefined && message.segmentDuration !== 0) {
      writer.uint32(32).uint32(message.segmentDuration);
    }
    if (message.filenameSuffix !== undefined && message.filenameSuffix !== 0) {
      writer.uint32(80).int32(message.filenameSuffix);
    }
    if (message.disableManifest === true) {
      writer.uint32(64).bool(message.disableManifest);
    }
    if (message.s3 !== undefined) {
      S3Upload.encode(message.s3, writer.uint32(42).fork()).ldelim();
    }
    if (message.gcp !== undefined) {
      GCPUpload.encode(message.gcp, writer.uint32(50).fork()).ldelim();
    }
    if (message.azure !== undefined) {
      AzureBlobUpload.encode(message.azure, writer.uint32(58).fork()).ldelim();
    }
    if (message.aliOSS !== undefined) {
      AliOSSUpload.encode(message.aliOSS, writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SegmentedFileOutput {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSegmentedFileOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.protocol = reader.int32() as any;
          break;
        case 2:
          message.filenamePrefix = reader.string();
          break;
        case 3:
          message.playlistName = reader.string();
          break;
        case 4:
          message.segmentDuration = reader.uint32();
          break;
        case 10:
          message.filenameSuffix = reader.int32() as any;
          break;
        case 8:
          message.disableManifest = reader.bool();
          break;
        case 5:
          message.s3 = S3Upload.decode(reader, reader.uint32());
          break;
        case 6:
          message.gcp = GCPUpload.decode(reader, reader.uint32());
          break;
        case 7:
          message.azure = AzureBlobUpload.decode(reader, reader.uint32());
          break;
        case 9:
          message.aliOSS = AliOSSUpload.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SegmentedFileOutput {
    return {
      protocol: isSet(object.protocol) ? segmentedFileProtocolFromJSON(object.protocol) : 0,
      filenamePrefix: isSet(object.filenamePrefix) ? String(object.filenamePrefix) : "",
      playlistName: isSet(object.playlistName) ? String(object.playlistName) : "",
      segmentDuration: isSet(object.segmentDuration) ? Number(object.segmentDuration) : 0,
      filenameSuffix: isSet(object.filenameSuffix) ? segmentedFileSuffixFromJSON(object.filenameSuffix) : 0,
      disableManifest: isSet(object.disableManifest) ? Boolean(object.disableManifest) : false,
      s3: isSet(object.s3) ? S3Upload.fromJSON(object.s3) : undefined,
      gcp: isSet(object.gcp) ? GCPUpload.fromJSON(object.gcp) : undefined,
      azure: isSet(object.azure) ? AzureBlobUpload.fromJSON(object.azure) : undefined,
      aliOSS: isSet(object.aliOSS) ? AliOSSUpload.fromJSON(object.aliOSS) : undefined,
    };
  },

  toJSON(message: SegmentedFileOutput): unknown {
    const obj: any = {};
    message.protocol !== undefined && (obj.protocol = segmentedFileProtocolToJSON(message.protocol));
    message.filenamePrefix !== undefined && (obj.filenamePrefix = message.filenamePrefix);
    message.playlistName !== undefined && (obj.playlistName = message.playlistName);
    message.segmentDuration !== undefined && (obj.segmentDuration = Math.round(message.segmentDuration));
    message.filenameSuffix !== undefined && (obj.filenameSuffix = segmentedFileSuffixToJSON(message.filenameSuffix));
    message.disableManifest !== undefined && (obj.disableManifest = message.disableManifest);
    message.s3 !== undefined && (obj.s3 = message.s3 ? S3Upload.toJSON(message.s3) : undefined);
    message.gcp !== undefined && (obj.gcp = message.gcp ? GCPUpload.toJSON(message.gcp) : undefined);
    message.azure !== undefined && (obj.azure = message.azure ? AzureBlobUpload.toJSON(message.azure) : undefined);
    message.aliOSS !== undefined && (obj.aliOSS = message.aliOSS ? AliOSSUpload.toJSON(message.aliOSS) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SegmentedFileOutput>, I>>(object: I): SegmentedFileOutput {
    const message = createBaseSegmentedFileOutput();
    message.protocol = object.protocol ?? 0;
    message.filenamePrefix = object.filenamePrefix ?? "";
    message.playlistName = object.playlistName ?? "";
    message.segmentDuration = object.segmentDuration ?? 0;
    message.filenameSuffix = object.filenameSuffix ?? 0;
    message.disableManifest = object.disableManifest ?? false;
    message.s3 = (object.s3 !== undefined && object.s3 !== null) ? S3Upload.fromPartial(object.s3) : undefined;
    message.gcp = (object.gcp !== undefined && object.gcp !== null) ? GCPUpload.fromPartial(object.gcp) : undefined;
    message.azure = (object.azure !== undefined && object.azure !== null)
      ? AzureBlobUpload.fromPartial(object.azure)
      : undefined;
    message.aliOSS = (object.aliOSS !== undefined && object.aliOSS !== null)
      ? AliOSSUpload.fromPartial(object.aliOSS)
      : undefined;
    return message;
  },
};

function createBaseDirectFileOutput(): DirectFileOutput {
  return { filepath: "", disableManifest: false, s3: undefined, gcp: undefined, azure: undefined, aliOSS: undefined };
}

export const DirectFileOutput = {
  encode(message: DirectFileOutput, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.filepath !== undefined && message.filepath !== "") {
      writer.uint32(10).string(message.filepath);
    }
    if (message.disableManifest === true) {
      writer.uint32(40).bool(message.disableManifest);
    }
    if (message.s3 !== undefined) {
      S3Upload.encode(message.s3, writer.uint32(18).fork()).ldelim();
    }
    if (message.gcp !== undefined) {
      GCPUpload.encode(message.gcp, writer.uint32(26).fork()).ldelim();
    }
    if (message.azure !== undefined) {
      AzureBlobUpload.encode(message.azure, writer.uint32(34).fork()).ldelim();
    }
    if (message.aliOSS !== undefined) {
      AliOSSUpload.encode(message.aliOSS, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DirectFileOutput {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDirectFileOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filepath = reader.string();
          break;
        case 5:
          message.disableManifest = reader.bool();
          break;
        case 2:
          message.s3 = S3Upload.decode(reader, reader.uint32());
          break;
        case 3:
          message.gcp = GCPUpload.decode(reader, reader.uint32());
          break;
        case 4:
          message.azure = AzureBlobUpload.decode(reader, reader.uint32());
          break;
        case 6:
          message.aliOSS = AliOSSUpload.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DirectFileOutput {
    return {
      filepath: isSet(object.filepath) ? String(object.filepath) : "",
      disableManifest: isSet(object.disableManifest) ? Boolean(object.disableManifest) : false,
      s3: isSet(object.s3) ? S3Upload.fromJSON(object.s3) : undefined,
      gcp: isSet(object.gcp) ? GCPUpload.fromJSON(object.gcp) : undefined,
      azure: isSet(object.azure) ? AzureBlobUpload.fromJSON(object.azure) : undefined,
      aliOSS: isSet(object.aliOSS) ? AliOSSUpload.fromJSON(object.aliOSS) : undefined,
    };
  },

  toJSON(message: DirectFileOutput): unknown {
    const obj: any = {};
    message.filepath !== undefined && (obj.filepath = message.filepath);
    message.disableManifest !== undefined && (obj.disableManifest = message.disableManifest);
    message.s3 !== undefined && (obj.s3 = message.s3 ? S3Upload.toJSON(message.s3) : undefined);
    message.gcp !== undefined && (obj.gcp = message.gcp ? GCPUpload.toJSON(message.gcp) : undefined);
    message.azure !== undefined && (obj.azure = message.azure ? AzureBlobUpload.toJSON(message.azure) : undefined);
    message.aliOSS !== undefined && (obj.aliOSS = message.aliOSS ? AliOSSUpload.toJSON(message.aliOSS) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DirectFileOutput>, I>>(object: I): DirectFileOutput {
    const message = createBaseDirectFileOutput();
    message.filepath = object.filepath ?? "";
    message.disableManifest = object.disableManifest ?? false;
    message.s3 = (object.s3 !== undefined && object.s3 !== null) ? S3Upload.fromPartial(object.s3) : undefined;
    message.gcp = (object.gcp !== undefined && object.gcp !== null) ? GCPUpload.fromPartial(object.gcp) : undefined;
    message.azure = (object.azure !== undefined && object.azure !== null)
      ? AzureBlobUpload.fromPartial(object.azure)
      : undefined;
    message.aliOSS = (object.aliOSS !== undefined && object.aliOSS !== null)
      ? AliOSSUpload.fromPartial(object.aliOSS)
      : undefined;
    return message;
  },
};

function createBaseS3Upload(): S3Upload {
  return {
    accessKey: "",
    secret: "",
    region: "",
    endpoint: "",
    bucket: "",
    forcePathStyle: false,
    metadata: {},
    tagging: "",
  };
}

export const S3Upload = {
  encode(message: S3Upload, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accessKey !== undefined && message.accessKey !== "") {
      writer.uint32(10).string(message.accessKey);
    }
    if (message.secret !== undefined && message.secret !== "") {
      writer.uint32(18).string(message.secret);
    }
    if (message.region !== undefined && message.region !== "") {
      writer.uint32(26).string(message.region);
    }
    if (message.endpoint !== undefined && message.endpoint !== "") {
      writer.uint32(34).string(message.endpoint);
    }
    if (message.bucket !== undefined && message.bucket !== "") {
      writer.uint32(42).string(message.bucket);
    }
    if (message.forcePathStyle === true) {
      writer.uint32(48).bool(message.forcePathStyle);
    }
    Object.entries(message.metadata || {}).forEach(([key, value]) => {
      S3Upload_MetadataEntry.encode({ key: key as any, value }, writer.uint32(58).fork()).ldelim();
    });
    if (message.tagging !== undefined && message.tagging !== "") {
      writer.uint32(66).string(message.tagging);
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
        case 6:
          message.forcePathStyle = reader.bool();
          break;
        case 7:
          const entry7 = S3Upload_MetadataEntry.decode(reader, reader.uint32());
          if (entry7.value !== undefined) {
            message.metadata![entry7.key] = entry7.value;
          }
          break;
        case 8:
          message.tagging = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): S3Upload {
    return {
      accessKey: isSet(object.accessKey) ? String(object.accessKey) : "",
      secret: isSet(object.secret) ? String(object.secret) : "",
      region: isSet(object.region) ? String(object.region) : "",
      endpoint: isSet(object.endpoint) ? String(object.endpoint) : "",
      bucket: isSet(object.bucket) ? String(object.bucket) : "",
      forcePathStyle: isSet(object.forcePathStyle) ? Boolean(object.forcePathStyle) : false,
      metadata: isObject(object.metadata)
        ? Object.entries(object.metadata).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      tagging: isSet(object.tagging) ? String(object.tagging) : "",
    };
  },

  toJSON(message: S3Upload): unknown {
    const obj: any = {};
    message.accessKey !== undefined && (obj.accessKey = message.accessKey);
    message.secret !== undefined && (obj.secret = message.secret);
    message.region !== undefined && (obj.region = message.region);
    message.endpoint !== undefined && (obj.endpoint = message.endpoint);
    message.bucket !== undefined && (obj.bucket = message.bucket);
    message.forcePathStyle !== undefined && (obj.forcePathStyle = message.forcePathStyle);
    obj.metadata = {};
    if (message.metadata) {
      Object.entries(message.metadata).forEach(([k, v]) => {
        obj.metadata[k] = v;
      });
    }
    message.tagging !== undefined && (obj.tagging = message.tagging);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<S3Upload>, I>>(object: I): S3Upload {
    const message = createBaseS3Upload();
    message.accessKey = object.accessKey ?? "";
    message.secret = object.secret ?? "";
    message.region = object.region ?? "";
    message.endpoint = object.endpoint ?? "";
    message.bucket = object.bucket ?? "";
    message.forcePathStyle = object.forcePathStyle ?? false;
    message.metadata = Object.entries(object.metadata ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.tagging = object.tagging ?? "";
    return message;
  },
};

function createBaseS3Upload_MetadataEntry(): S3Upload_MetadataEntry {
  return { key: "", value: "" };
}

export const S3Upload_MetadataEntry = {
  encode(message: S3Upload_MetadataEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): S3Upload_MetadataEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseS3Upload_MetadataEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): S3Upload_MetadataEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: S3Upload_MetadataEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<S3Upload_MetadataEntry>, I>>(object: I): S3Upload_MetadataEntry {
    const message = createBaseS3Upload_MetadataEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseGCPUpload(): GCPUpload {
  return { credentials: "", bucket: "" };
}

export const GCPUpload = {
  encode(message: GCPUpload, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.credentials !== undefined && message.credentials !== "") {
      writer.uint32(10).string(message.credentials);
    }
    if (message.bucket !== undefined && message.bucket !== "") {
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
          message.credentials = reader.string();
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
    return {
      credentials: isSet(object.credentials) ? String(object.credentials) : "",
      bucket: isSet(object.bucket) ? String(object.bucket) : "",
    };
  },

  toJSON(message: GCPUpload): unknown {
    const obj: any = {};
    message.credentials !== undefined && (obj.credentials = message.credentials);
    message.bucket !== undefined && (obj.bucket = message.bucket);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GCPUpload>, I>>(object: I): GCPUpload {
    const message = createBaseGCPUpload();
    message.credentials = object.credentials ?? "";
    message.bucket = object.bucket ?? "";
    return message;
  },
};

function createBaseAzureBlobUpload(): AzureBlobUpload {
  return { accountName: "", accountKey: "", containerName: "" };
}

export const AzureBlobUpload = {
  encode(message: AzureBlobUpload, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accountName !== undefined && message.accountName !== "") {
      writer.uint32(10).string(message.accountName);
    }
    if (message.accountKey !== undefined && message.accountKey !== "") {
      writer.uint32(18).string(message.accountKey);
    }
    if (message.containerName !== undefined && message.containerName !== "") {
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
    return {
      accountName: isSet(object.accountName) ? String(object.accountName) : "",
      accountKey: isSet(object.accountKey) ? String(object.accountKey) : "",
      containerName: isSet(object.containerName) ? String(object.containerName) : "",
    };
  },

  toJSON(message: AzureBlobUpload): unknown {
    const obj: any = {};
    message.accountName !== undefined && (obj.accountName = message.accountName);
    message.accountKey !== undefined && (obj.accountKey = message.accountKey);
    message.containerName !== undefined && (obj.containerName = message.containerName);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AzureBlobUpload>, I>>(object: I): AzureBlobUpload {
    const message = createBaseAzureBlobUpload();
    message.accountName = object.accountName ?? "";
    message.accountKey = object.accountKey ?? "";
    message.containerName = object.containerName ?? "";
    return message;
  },
};

function createBaseAliOSSUpload(): AliOSSUpload {
  return { accessKey: "", secret: "", region: "", endpoint: "", bucket: "" };
}

export const AliOSSUpload = {
  encode(message: AliOSSUpload, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accessKey !== undefined && message.accessKey !== "") {
      writer.uint32(10).string(message.accessKey);
    }
    if (message.secret !== undefined && message.secret !== "") {
      writer.uint32(18).string(message.secret);
    }
    if (message.region !== undefined && message.region !== "") {
      writer.uint32(26).string(message.region);
    }
    if (message.endpoint !== undefined && message.endpoint !== "") {
      writer.uint32(34).string(message.endpoint);
    }
    if (message.bucket !== undefined && message.bucket !== "") {
      writer.uint32(42).string(message.bucket);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AliOSSUpload {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAliOSSUpload();
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

  fromJSON(object: any): AliOSSUpload {
    return {
      accessKey: isSet(object.accessKey) ? String(object.accessKey) : "",
      secret: isSet(object.secret) ? String(object.secret) : "",
      region: isSet(object.region) ? String(object.region) : "",
      endpoint: isSet(object.endpoint) ? String(object.endpoint) : "",
      bucket: isSet(object.bucket) ? String(object.bucket) : "",
    };
  },

  toJSON(message: AliOSSUpload): unknown {
    const obj: any = {};
    message.accessKey !== undefined && (obj.accessKey = message.accessKey);
    message.secret !== undefined && (obj.secret = message.secret);
    message.region !== undefined && (obj.region = message.region);
    message.endpoint !== undefined && (obj.endpoint = message.endpoint);
    message.bucket !== undefined && (obj.bucket = message.bucket);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AliOSSUpload>, I>>(object: I): AliOSSUpload {
    const message = createBaseAliOSSUpload();
    message.accessKey = object.accessKey ?? "";
    message.secret = object.secret ?? "";
    message.region = object.region ?? "";
    message.endpoint = object.endpoint ?? "";
    message.bucket = object.bucket ?? "";
    return message;
  },
};

function createBaseStreamOutput(): StreamOutput {
  return { protocol: 0, urls: [] };
}

export const StreamOutput = {
  encode(message: StreamOutput, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.protocol !== undefined && message.protocol !== 0) {
      writer.uint32(8).int32(message.protocol);
    }
    if (message.urls !== undefined && message.urls.length !== 0) {
      for (const v of message.urls) {
        writer.uint32(18).string(v!);
      }
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
          message.urls!.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamOutput {
    return {
      protocol: isSet(object.protocol) ? streamProtocolFromJSON(object.protocol) : 0,
      urls: Array.isArray(object?.urls) ? object.urls.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: StreamOutput): unknown {
    const obj: any = {};
    message.protocol !== undefined && (obj.protocol = streamProtocolToJSON(message.protocol));
    if (message.urls) {
      obj.urls = message.urls.map((e) => e);
    } else {
      obj.urls = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StreamOutput>, I>>(object: I): StreamOutput {
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
    keyFrameInterval: 0,
  };
}

export const EncodingOptions = {
  encode(message: EncodingOptions, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.width !== undefined && message.width !== 0) {
      writer.uint32(8).int32(message.width);
    }
    if (message.height !== undefined && message.height !== 0) {
      writer.uint32(16).int32(message.height);
    }
    if (message.depth !== undefined && message.depth !== 0) {
      writer.uint32(24).int32(message.depth);
    }
    if (message.framerate !== undefined && message.framerate !== 0) {
      writer.uint32(32).int32(message.framerate);
    }
    if (message.audioCodec !== undefined && message.audioCodec !== 0) {
      writer.uint32(40).int32(message.audioCodec);
    }
    if (message.audioBitrate !== undefined && message.audioBitrate !== 0) {
      writer.uint32(48).int32(message.audioBitrate);
    }
    if (message.audioFrequency !== undefined && message.audioFrequency !== 0) {
      writer.uint32(56).int32(message.audioFrequency);
    }
    if (message.videoCodec !== undefined && message.videoCodec !== 0) {
      writer.uint32(64).int32(message.videoCodec);
    }
    if (message.videoBitrate !== undefined && message.videoBitrate !== 0) {
      writer.uint32(72).int32(message.videoBitrate);
    }
    if (message.keyFrameInterval !== undefined && message.keyFrameInterval !== 0) {
      writer.uint32(81).double(message.keyFrameInterval);
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
        case 10:
          message.keyFrameInterval = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EncodingOptions {
    return {
      width: isSet(object.width) ? Number(object.width) : 0,
      height: isSet(object.height) ? Number(object.height) : 0,
      depth: isSet(object.depth) ? Number(object.depth) : 0,
      framerate: isSet(object.framerate) ? Number(object.framerate) : 0,
      audioCodec: isSet(object.audioCodec) ? audioCodecFromJSON(object.audioCodec) : 0,
      audioBitrate: isSet(object.audioBitrate) ? Number(object.audioBitrate) : 0,
      audioFrequency: isSet(object.audioFrequency) ? Number(object.audioFrequency) : 0,
      videoCodec: isSet(object.videoCodec) ? videoCodecFromJSON(object.videoCodec) : 0,
      videoBitrate: isSet(object.videoBitrate) ? Number(object.videoBitrate) : 0,
      keyFrameInterval: isSet(object.keyFrameInterval) ? Number(object.keyFrameInterval) : 0,
    };
  },

  toJSON(message: EncodingOptions): unknown {
    const obj: any = {};
    message.width !== undefined && (obj.width = Math.round(message.width));
    message.height !== undefined && (obj.height = Math.round(message.height));
    message.depth !== undefined && (obj.depth = Math.round(message.depth));
    message.framerate !== undefined && (obj.framerate = Math.round(message.framerate));
    message.audioCodec !== undefined && (obj.audioCodec = audioCodecToJSON(message.audioCodec));
    message.audioBitrate !== undefined && (obj.audioBitrate = Math.round(message.audioBitrate));
    message.audioFrequency !== undefined && (obj.audioFrequency = Math.round(message.audioFrequency));
    message.videoCodec !== undefined && (obj.videoCodec = videoCodecToJSON(message.videoCodec));
    message.videoBitrate !== undefined && (obj.videoBitrate = Math.round(message.videoBitrate));
    message.keyFrameInterval !== undefined && (obj.keyFrameInterval = message.keyFrameInterval);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EncodingOptions>, I>>(object: I): EncodingOptions {
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
    message.keyFrameInterval = object.keyFrameInterval ?? 0;
    return message;
  },
};

function createBaseUpdateLayoutRequest(): UpdateLayoutRequest {
  return { egressId: "", layout: "" };
}

export const UpdateLayoutRequest = {
  encode(message: UpdateLayoutRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.egressId !== undefined && message.egressId !== "") {
      writer.uint32(10).string(message.egressId);
    }
    if (message.layout !== undefined && message.layout !== "") {
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
    return {
      egressId: isSet(object.egressId) ? String(object.egressId) : "",
      layout: isSet(object.layout) ? String(object.layout) : "",
    };
  },

  toJSON(message: UpdateLayoutRequest): unknown {
    const obj: any = {};
    message.egressId !== undefined && (obj.egressId = message.egressId);
    message.layout !== undefined && (obj.layout = message.layout);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateLayoutRequest>, I>>(object: I): UpdateLayoutRequest {
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
  encode(message: UpdateStreamRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.egressId !== undefined && message.egressId !== "") {
      writer.uint32(10).string(message.egressId);
    }
    if (message.addOutputUrls !== undefined && message.addOutputUrls.length !== 0) {
      for (const v of message.addOutputUrls) {
        writer.uint32(18).string(v!);
      }
    }
    if (message.removeOutputUrls !== undefined && message.removeOutputUrls.length !== 0) {
      for (const v of message.removeOutputUrls) {
        writer.uint32(26).string(v!);
      }
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
          message.addOutputUrls!.push(reader.string());
          break;
        case 3:
          message.removeOutputUrls!.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateStreamRequest {
    return {
      egressId: isSet(object.egressId) ? String(object.egressId) : "",
      addOutputUrls: Array.isArray(object?.addOutputUrls) ? object.addOutputUrls.map((e: any) => String(e)) : [],
      removeOutputUrls: Array.isArray(object?.removeOutputUrls)
        ? object.removeOutputUrls.map((e: any) => String(e))
        : [],
    };
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

  fromPartial<I extends Exact<DeepPartial<UpdateStreamRequest>, I>>(object: I): UpdateStreamRequest {
    const message = createBaseUpdateStreamRequest();
    message.egressId = object.egressId ?? "";
    message.addOutputUrls = object.addOutputUrls?.map((e) => e) || [];
    message.removeOutputUrls = object.removeOutputUrls?.map((e) => e) || [];
    return message;
  },
};

function createBaseListEgressRequest(): ListEgressRequest {
  return { roomName: "", egressId: "", active: false };
}

export const ListEgressRequest = {
  encode(message: ListEgressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomName !== undefined && message.roomName !== "") {
      writer.uint32(10).string(message.roomName);
    }
    if (message.egressId !== undefined && message.egressId !== "") {
      writer.uint32(18).string(message.egressId);
    }
    if (message.active === true) {
      writer.uint32(24).bool(message.active);
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
        case 2:
          message.egressId = reader.string();
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

  fromJSON(object: any): ListEgressRequest {
    return {
      roomName: isSet(object.roomName) ? String(object.roomName) : "",
      egressId: isSet(object.egressId) ? String(object.egressId) : "",
      active: isSet(object.active) ? Boolean(object.active) : false,
    };
  },

  toJSON(message: ListEgressRequest): unknown {
    const obj: any = {};
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.egressId !== undefined && (obj.egressId = message.egressId);
    message.active !== undefined && (obj.active = message.active);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListEgressRequest>, I>>(object: I): ListEgressRequest {
    const message = createBaseListEgressRequest();
    message.roomName = object.roomName ?? "";
    message.egressId = object.egressId ?? "";
    message.active = object.active ?? false;
    return message;
  },
};

function createBaseListEgressResponse(): ListEgressResponse {
  return { items: [] };
}

export const ListEgressResponse = {
  encode(message: ListEgressResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.items !== undefined && message.items.length !== 0) {
      for (const v of message.items) {
        EgressInfo.encode(v!, writer.uint32(10).fork()).ldelim();
      }
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
          message.items!.push(EgressInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListEgressResponse {
    return { items: Array.isArray(object?.items) ? object.items.map((e: any) => EgressInfo.fromJSON(e)) : [] };
  },

  toJSON(message: ListEgressResponse): unknown {
    const obj: any = {};
    if (message.items) {
      obj.items = message.items.map((e) => e ? EgressInfo.toJSON(e) : undefined);
    } else {
      obj.items = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListEgressResponse>, I>>(object: I): ListEgressResponse {
    const message = createBaseListEgressResponse();
    message.items = object.items?.map((e) => EgressInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseStopEgressRequest(): StopEgressRequest {
  return { egressId: "" };
}

export const StopEgressRequest = {
  encode(message: StopEgressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.egressId !== undefined && message.egressId !== "") {
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
    return { egressId: isSet(object.egressId) ? String(object.egressId) : "" };
  },

  toJSON(message: StopEgressRequest): unknown {
    const obj: any = {};
    message.egressId !== undefined && (obj.egressId = message.egressId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StopEgressRequest>, I>>(object: I): StopEgressRequest {
    const message = createBaseStopEgressRequest();
    message.egressId = object.egressId ?? "";
    return message;
  },
};

function createBaseEgressInfo(): EgressInfo {
  return {
    egressId: "",
    roomId: "",
    roomName: "",
    status: 0,
    startedAt: 0,
    endedAt: 0,
    updatedAt: 0,
    error: "",
    roomComposite: undefined,
    trackComposite: undefined,
    track: undefined,
    web: undefined,
    stream: undefined,
    file: undefined,
    segments: undefined,
    streamResults: [],
    fileResults: [],
    segmentResults: [],
  };
}

export const EgressInfo = {
  encode(message: EgressInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.egressId !== undefined && message.egressId !== "") {
      writer.uint32(10).string(message.egressId);
    }
    if (message.roomId !== undefined && message.roomId !== "") {
      writer.uint32(18).string(message.roomId);
    }
    if (message.roomName !== undefined && message.roomName !== "") {
      writer.uint32(106).string(message.roomName);
    }
    if (message.status !== undefined && message.status !== 0) {
      writer.uint32(24).int32(message.status);
    }
    if (message.startedAt !== undefined && message.startedAt !== 0) {
      writer.uint32(80).int64(message.startedAt);
    }
    if (message.endedAt !== undefined && message.endedAt !== 0) {
      writer.uint32(88).int64(message.endedAt);
    }
    if (message.updatedAt !== undefined && message.updatedAt !== 0) {
      writer.uint32(144).int64(message.updatedAt);
    }
    if (message.error !== undefined && message.error !== "") {
      writer.uint32(74).string(message.error);
    }
    if (message.roomComposite !== undefined) {
      RoomCompositeEgressRequest.encode(message.roomComposite, writer.uint32(34).fork()).ldelim();
    }
    if (message.trackComposite !== undefined) {
      TrackCompositeEgressRequest.encode(message.trackComposite, writer.uint32(42).fork()).ldelim();
    }
    if (message.track !== undefined) {
      TrackEgressRequest.encode(message.track, writer.uint32(50).fork()).ldelim();
    }
    if (message.web !== undefined) {
      WebEgressRequest.encode(message.web, writer.uint32(114).fork()).ldelim();
    }
    if (message.stream !== undefined) {
      StreamInfoList.encode(message.stream, writer.uint32(58).fork()).ldelim();
    }
    if (message.file !== undefined) {
      FileInfo.encode(message.file, writer.uint32(66).fork()).ldelim();
    }
    if (message.segments !== undefined) {
      SegmentsInfo.encode(message.segments, writer.uint32(98).fork()).ldelim();
    }
    if (message.streamResults !== undefined && message.streamResults.length !== 0) {
      for (const v of message.streamResults) {
        StreamInfo.encode(v!, writer.uint32(122).fork()).ldelim();
      }
    }
    if (message.fileResults !== undefined && message.fileResults.length !== 0) {
      for (const v of message.fileResults) {
        FileInfo.encode(v!, writer.uint32(130).fork()).ldelim();
      }
    }
    if (message.segmentResults !== undefined && message.segmentResults.length !== 0) {
      for (const v of message.segmentResults) {
        SegmentsInfo.encode(v!, writer.uint32(138).fork()).ldelim();
      }
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
        case 13:
          message.roomName = reader.string();
          break;
        case 3:
          message.status = reader.int32() as any;
          break;
        case 10:
          message.startedAt = longToNumber(reader.int64() as Long);
          break;
        case 11:
          message.endedAt = longToNumber(reader.int64() as Long);
          break;
        case 18:
          message.updatedAt = longToNumber(reader.int64() as Long);
          break;
        case 9:
          message.error = reader.string();
          break;
        case 4:
          message.roomComposite = RoomCompositeEgressRequest.decode(reader, reader.uint32());
          break;
        case 5:
          message.trackComposite = TrackCompositeEgressRequest.decode(reader, reader.uint32());
          break;
        case 6:
          message.track = TrackEgressRequest.decode(reader, reader.uint32());
          break;
        case 14:
          message.web = WebEgressRequest.decode(reader, reader.uint32());
          break;
        case 7:
          message.stream = StreamInfoList.decode(reader, reader.uint32());
          break;
        case 8:
          message.file = FileInfo.decode(reader, reader.uint32());
          break;
        case 12:
          message.segments = SegmentsInfo.decode(reader, reader.uint32());
          break;
        case 15:
          message.streamResults!.push(StreamInfo.decode(reader, reader.uint32()));
          break;
        case 16:
          message.fileResults!.push(FileInfo.decode(reader, reader.uint32()));
          break;
        case 17:
          message.segmentResults!.push(SegmentsInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EgressInfo {
    return {
      egressId: isSet(object.egressId) ? String(object.egressId) : "",
      roomId: isSet(object.roomId) ? String(object.roomId) : "",
      roomName: isSet(object.roomName) ? String(object.roomName) : "",
      status: isSet(object.status) ? egressStatusFromJSON(object.status) : 0,
      startedAt: isSet(object.startedAt) ? Number(object.startedAt) : 0,
      endedAt: isSet(object.endedAt) ? Number(object.endedAt) : 0,
      updatedAt: isSet(object.updatedAt) ? Number(object.updatedAt) : 0,
      error: isSet(object.error) ? String(object.error) : "",
      roomComposite: isSet(object.roomComposite)
        ? RoomCompositeEgressRequest.fromJSON(object.roomComposite)
        : undefined,
      trackComposite: isSet(object.trackComposite)
        ? TrackCompositeEgressRequest.fromJSON(object.trackComposite)
        : undefined,
      track: isSet(object.track) ? TrackEgressRequest.fromJSON(object.track) : undefined,
      web: isSet(object.web) ? WebEgressRequest.fromJSON(object.web) : undefined,
      stream: isSet(object.stream) ? StreamInfoList.fromJSON(object.stream) : undefined,
      file: isSet(object.file) ? FileInfo.fromJSON(object.file) : undefined,
      segments: isSet(object.segments) ? SegmentsInfo.fromJSON(object.segments) : undefined,
      streamResults: Array.isArray(object?.streamResults)
        ? object.streamResults.map((e: any) => StreamInfo.fromJSON(e))
        : [],
      fileResults: Array.isArray(object?.fileResults) ? object.fileResults.map((e: any) => FileInfo.fromJSON(e)) : [],
      segmentResults: Array.isArray(object?.segmentResults)
        ? object.segmentResults.map((e: any) => SegmentsInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: EgressInfo): unknown {
    const obj: any = {};
    message.egressId !== undefined && (obj.egressId = message.egressId);
    message.roomId !== undefined && (obj.roomId = message.roomId);
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.status !== undefined && (obj.status = egressStatusToJSON(message.status));
    message.startedAt !== undefined && (obj.startedAt = Math.round(message.startedAt));
    message.endedAt !== undefined && (obj.endedAt = Math.round(message.endedAt));
    message.updatedAt !== undefined && (obj.updatedAt = Math.round(message.updatedAt));
    message.error !== undefined && (obj.error = message.error);
    message.roomComposite !== undefined &&
      (obj.roomComposite = message.roomComposite
        ? RoomCompositeEgressRequest.toJSON(message.roomComposite)
        : undefined);
    message.trackComposite !== undefined && (obj.trackComposite = message.trackComposite
      ? TrackCompositeEgressRequest.toJSON(message.trackComposite)
      : undefined);
    message.track !== undefined && (obj.track = message.track ? TrackEgressRequest.toJSON(message.track) : undefined);
    message.web !== undefined && (obj.web = message.web ? WebEgressRequest.toJSON(message.web) : undefined);
    message.stream !== undefined && (obj.stream = message.stream ? StreamInfoList.toJSON(message.stream) : undefined);
    message.file !== undefined && (obj.file = message.file ? FileInfo.toJSON(message.file) : undefined);
    message.segments !== undefined &&
      (obj.segments = message.segments ? SegmentsInfo.toJSON(message.segments) : undefined);
    if (message.streamResults) {
      obj.streamResults = message.streamResults.map((e) => e ? StreamInfo.toJSON(e) : undefined);
    } else {
      obj.streamResults = [];
    }
    if (message.fileResults) {
      obj.fileResults = message.fileResults.map((e) => e ? FileInfo.toJSON(e) : undefined);
    } else {
      obj.fileResults = [];
    }
    if (message.segmentResults) {
      obj.segmentResults = message.segmentResults.map((e) => e ? SegmentsInfo.toJSON(e) : undefined);
    } else {
      obj.segmentResults = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EgressInfo>, I>>(object: I): EgressInfo {
    const message = createBaseEgressInfo();
    message.egressId = object.egressId ?? "";
    message.roomId = object.roomId ?? "";
    message.roomName = object.roomName ?? "";
    message.status = object.status ?? 0;
    message.startedAt = object.startedAt ?? 0;
    message.endedAt = object.endedAt ?? 0;
    message.updatedAt = object.updatedAt ?? 0;
    message.error = object.error ?? "";
    message.roomComposite = (object.roomComposite !== undefined && object.roomComposite !== null)
      ? RoomCompositeEgressRequest.fromPartial(object.roomComposite)
      : undefined;
    message.trackComposite = (object.trackComposite !== undefined && object.trackComposite !== null)
      ? TrackCompositeEgressRequest.fromPartial(object.trackComposite)
      : undefined;
    message.track = (object.track !== undefined && object.track !== null)
      ? TrackEgressRequest.fromPartial(object.track)
      : undefined;
    message.web = (object.web !== undefined && object.web !== null)
      ? WebEgressRequest.fromPartial(object.web)
      : undefined;
    message.stream = (object.stream !== undefined && object.stream !== null)
      ? StreamInfoList.fromPartial(object.stream)
      : undefined;
    message.file = (object.file !== undefined && object.file !== null) ? FileInfo.fromPartial(object.file) : undefined;
    message.segments = (object.segments !== undefined && object.segments !== null)
      ? SegmentsInfo.fromPartial(object.segments)
      : undefined;
    message.streamResults = object.streamResults?.map((e) => StreamInfo.fromPartial(e)) || [];
    message.fileResults = object.fileResults?.map((e) => FileInfo.fromPartial(e)) || [];
    message.segmentResults = object.segmentResults?.map((e) => SegmentsInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseStreamInfoList(): StreamInfoList {
  return { info: [] };
}

export const StreamInfoList = {
  encode(message: StreamInfoList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.info !== undefined && message.info.length !== 0) {
      for (const v of message.info) {
        StreamInfo.encode(v!, writer.uint32(10).fork()).ldelim();
      }
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
          message.info!.push(StreamInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamInfoList {
    return { info: Array.isArray(object?.info) ? object.info.map((e: any) => StreamInfo.fromJSON(e)) : [] };
  },

  toJSON(message: StreamInfoList): unknown {
    const obj: any = {};
    if (message.info) {
      obj.info = message.info.map((e) => e ? StreamInfo.toJSON(e) : undefined);
    } else {
      obj.info = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StreamInfoList>, I>>(object: I): StreamInfoList {
    const message = createBaseStreamInfoList();
    message.info = object.info?.map((e) => StreamInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseStreamInfo(): StreamInfo {
  return { url: "", startedAt: 0, endedAt: 0, duration: 0, status: 0, error: "" };
}

export const StreamInfo = {
  encode(message: StreamInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.url !== undefined && message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    if (message.startedAt !== undefined && message.startedAt !== 0) {
      writer.uint32(16).int64(message.startedAt);
    }
    if (message.endedAt !== undefined && message.endedAt !== 0) {
      writer.uint32(24).int64(message.endedAt);
    }
    if (message.duration !== undefined && message.duration !== 0) {
      writer.uint32(32).int64(message.duration);
    }
    if (message.status !== undefined && message.status !== 0) {
      writer.uint32(40).int32(message.status);
    }
    if (message.error !== undefined && message.error !== "") {
      writer.uint32(50).string(message.error);
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
        case 4:
          message.duration = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.status = reader.int32() as any;
          break;
        case 6:
          message.error = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamInfo {
    return {
      url: isSet(object.url) ? String(object.url) : "",
      startedAt: isSet(object.startedAt) ? Number(object.startedAt) : 0,
      endedAt: isSet(object.endedAt) ? Number(object.endedAt) : 0,
      duration: isSet(object.duration) ? Number(object.duration) : 0,
      status: isSet(object.status) ? streamInfo_StatusFromJSON(object.status) : 0,
      error: isSet(object.error) ? String(object.error) : "",
    };
  },

  toJSON(message: StreamInfo): unknown {
    const obj: any = {};
    message.url !== undefined && (obj.url = message.url);
    message.startedAt !== undefined && (obj.startedAt = Math.round(message.startedAt));
    message.endedAt !== undefined && (obj.endedAt = Math.round(message.endedAt));
    message.duration !== undefined && (obj.duration = Math.round(message.duration));
    message.status !== undefined && (obj.status = streamInfo_StatusToJSON(message.status));
    message.error !== undefined && (obj.error = message.error);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StreamInfo>, I>>(object: I): StreamInfo {
    const message = createBaseStreamInfo();
    message.url = object.url ?? "";
    message.startedAt = object.startedAt ?? 0;
    message.endedAt = object.endedAt ?? 0;
    message.duration = object.duration ?? 0;
    message.status = object.status ?? 0;
    message.error = object.error ?? "";
    return message;
  },
};

function createBaseFileInfo(): FileInfo {
  return { filename: "", startedAt: 0, endedAt: 0, duration: 0, size: 0, location: "" };
}

export const FileInfo = {
  encode(message: FileInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.filename !== undefined && message.filename !== "") {
      writer.uint32(10).string(message.filename);
    }
    if (message.startedAt !== undefined && message.startedAt !== 0) {
      writer.uint32(16).int64(message.startedAt);
    }
    if (message.endedAt !== undefined && message.endedAt !== 0) {
      writer.uint32(24).int64(message.endedAt);
    }
    if (message.duration !== undefined && message.duration !== 0) {
      writer.uint32(48).int64(message.duration);
    }
    if (message.size !== undefined && message.size !== 0) {
      writer.uint32(32).int64(message.size);
    }
    if (message.location !== undefined && message.location !== "") {
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
        case 6:
          message.duration = longToNumber(reader.int64() as Long);
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
    return {
      filename: isSet(object.filename) ? String(object.filename) : "",
      startedAt: isSet(object.startedAt) ? Number(object.startedAt) : 0,
      endedAt: isSet(object.endedAt) ? Number(object.endedAt) : 0,
      duration: isSet(object.duration) ? Number(object.duration) : 0,
      size: isSet(object.size) ? Number(object.size) : 0,
      location: isSet(object.location) ? String(object.location) : "",
    };
  },

  toJSON(message: FileInfo): unknown {
    const obj: any = {};
    message.filename !== undefined && (obj.filename = message.filename);
    message.startedAt !== undefined && (obj.startedAt = Math.round(message.startedAt));
    message.endedAt !== undefined && (obj.endedAt = Math.round(message.endedAt));
    message.duration !== undefined && (obj.duration = Math.round(message.duration));
    message.size !== undefined && (obj.size = Math.round(message.size));
    message.location !== undefined && (obj.location = message.location);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FileInfo>, I>>(object: I): FileInfo {
    const message = createBaseFileInfo();
    message.filename = object.filename ?? "";
    message.startedAt = object.startedAt ?? 0;
    message.endedAt = object.endedAt ?? 0;
    message.duration = object.duration ?? 0;
    message.size = object.size ?? 0;
    message.location = object.location ?? "";
    return message;
  },
};

function createBaseSegmentsInfo(): SegmentsInfo {
  return { playlistName: "", duration: 0, size: 0, playlistLocation: "", segmentCount: 0, startedAt: 0, endedAt: 0 };
}

export const SegmentsInfo = {
  encode(message: SegmentsInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.playlistName !== undefined && message.playlistName !== "") {
      writer.uint32(10).string(message.playlistName);
    }
    if (message.duration !== undefined && message.duration !== 0) {
      writer.uint32(16).int64(message.duration);
    }
    if (message.size !== undefined && message.size !== 0) {
      writer.uint32(24).int64(message.size);
    }
    if (message.playlistLocation !== undefined && message.playlistLocation !== "") {
      writer.uint32(34).string(message.playlistLocation);
    }
    if (message.segmentCount !== undefined && message.segmentCount !== 0) {
      writer.uint32(40).int64(message.segmentCount);
    }
    if (message.startedAt !== undefined && message.startedAt !== 0) {
      writer.uint32(48).int64(message.startedAt);
    }
    if (message.endedAt !== undefined && message.endedAt !== 0) {
      writer.uint32(56).int64(message.endedAt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SegmentsInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSegmentsInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.playlistName = reader.string();
          break;
        case 2:
          message.duration = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.size = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.playlistLocation = reader.string();
          break;
        case 5:
          message.segmentCount = longToNumber(reader.int64() as Long);
          break;
        case 6:
          message.startedAt = longToNumber(reader.int64() as Long);
          break;
        case 7:
          message.endedAt = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SegmentsInfo {
    return {
      playlistName: isSet(object.playlistName) ? String(object.playlistName) : "",
      duration: isSet(object.duration) ? Number(object.duration) : 0,
      size: isSet(object.size) ? Number(object.size) : 0,
      playlistLocation: isSet(object.playlistLocation) ? String(object.playlistLocation) : "",
      segmentCount: isSet(object.segmentCount) ? Number(object.segmentCount) : 0,
      startedAt: isSet(object.startedAt) ? Number(object.startedAt) : 0,
      endedAt: isSet(object.endedAt) ? Number(object.endedAt) : 0,
    };
  },

  toJSON(message: SegmentsInfo): unknown {
    const obj: any = {};
    message.playlistName !== undefined && (obj.playlistName = message.playlistName);
    message.duration !== undefined && (obj.duration = Math.round(message.duration));
    message.size !== undefined && (obj.size = Math.round(message.size));
    message.playlistLocation !== undefined && (obj.playlistLocation = message.playlistLocation);
    message.segmentCount !== undefined && (obj.segmentCount = Math.round(message.segmentCount));
    message.startedAt !== undefined && (obj.startedAt = Math.round(message.startedAt));
    message.endedAt !== undefined && (obj.endedAt = Math.round(message.endedAt));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SegmentsInfo>, I>>(object: I): SegmentsInfo {
    const message = createBaseSegmentsInfo();
    message.playlistName = object.playlistName ?? "";
    message.duration = object.duration ?? 0;
    message.size = object.size ?? 0;
    message.playlistLocation = object.playlistLocation ?? "";
    message.segmentCount = object.segmentCount ?? 0;
    message.startedAt = object.startedAt ?? 0;
    message.endedAt = object.endedAt ?? 0;
    return message;
  },
};

function createBaseAutoTrackEgress(): AutoTrackEgress {
  return { filepath: "", disableManifest: false, s3: undefined, gcp: undefined, azure: undefined };
}

export const AutoTrackEgress = {
  encode(message: AutoTrackEgress, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.filepath !== undefined && message.filepath !== "") {
      writer.uint32(10).string(message.filepath);
    }
    if (message.disableManifest === true) {
      writer.uint32(40).bool(message.disableManifest);
    }
    if (message.s3 !== undefined) {
      S3Upload.encode(message.s3, writer.uint32(18).fork()).ldelim();
    }
    if (message.gcp !== undefined) {
      GCPUpload.encode(message.gcp, writer.uint32(26).fork()).ldelim();
    }
    if (message.azure !== undefined) {
      AzureBlobUpload.encode(message.azure, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AutoTrackEgress {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAutoTrackEgress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filepath = reader.string();
          break;
        case 5:
          message.disableManifest = reader.bool();
          break;
        case 2:
          message.s3 = S3Upload.decode(reader, reader.uint32());
          break;
        case 3:
          message.gcp = GCPUpload.decode(reader, reader.uint32());
          break;
        case 4:
          message.azure = AzureBlobUpload.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AutoTrackEgress {
    return {
      filepath: isSet(object.filepath) ? String(object.filepath) : "",
      disableManifest: isSet(object.disableManifest) ? Boolean(object.disableManifest) : false,
      s3: isSet(object.s3) ? S3Upload.fromJSON(object.s3) : undefined,
      gcp: isSet(object.gcp) ? GCPUpload.fromJSON(object.gcp) : undefined,
      azure: isSet(object.azure) ? AzureBlobUpload.fromJSON(object.azure) : undefined,
    };
  },

  toJSON(message: AutoTrackEgress): unknown {
    const obj: any = {};
    message.filepath !== undefined && (obj.filepath = message.filepath);
    message.disableManifest !== undefined && (obj.disableManifest = message.disableManifest);
    message.s3 !== undefined && (obj.s3 = message.s3 ? S3Upload.toJSON(message.s3) : undefined);
    message.gcp !== undefined && (obj.gcp = message.gcp ? GCPUpload.toJSON(message.gcp) : undefined);
    message.azure !== undefined && (obj.azure = message.azure ? AzureBlobUpload.toJSON(message.azure) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AutoTrackEgress>, I>>(object: I): AutoTrackEgress {
    const message = createBaseAutoTrackEgress();
    message.filepath = object.filepath ?? "";
    message.disableManifest = object.disableManifest ?? false;
    message.s3 = (object.s3 !== undefined && object.s3 !== null) ? S3Upload.fromPartial(object.s3) : undefined;
    message.gcp = (object.gcp !== undefined && object.gcp !== null) ? GCPUpload.fromPartial(object.gcp) : undefined;
    message.azure = (object.azure !== undefined && object.azure !== null)
      ? AzureBlobUpload.fromPartial(object.azure)
      : undefined;
    return message;
  },
};

export interface Egress {
  /** start recording or streaming a room, participant, or tracks */
  StartRoomCompositeEgress(request: RoomCompositeEgressRequest): Promise<EgressInfo>;
  StartTrackCompositeEgress(request: TrackCompositeEgressRequest): Promise<EgressInfo>;
  StartTrackEgress(request: TrackEgressRequest): Promise<EgressInfo>;
  StartWebEgress(request: WebEgressRequest): Promise<EgressInfo>;
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
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
