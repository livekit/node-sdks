/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  AudioCodec,
  audioCodecFromJSON,
  audioCodecToJSON,
  ImageCodec,
  imageCodecFromJSON,
  imageCodecToJSON,
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

export enum ImageFileSuffix {
  IMAGE_SUFFIX_INDEX = 0,
  IMAGE_SUFFIX_TIMESTAMP = 1,
  UNRECOGNIZED = -1,
}

export function imageFileSuffixFromJSON(object: any): ImageFileSuffix {
  switch (object) {
    case 0:
    case "IMAGE_SUFFIX_INDEX":
      return ImageFileSuffix.IMAGE_SUFFIX_INDEX;
    case 1:
    case "IMAGE_SUFFIX_TIMESTAMP":
      return ImageFileSuffix.IMAGE_SUFFIX_TIMESTAMP;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ImageFileSuffix.UNRECOGNIZED;
  }
}

export function imageFileSuffixToJSON(object: ImageFileSuffix): string {
  switch (object) {
    case ImageFileSuffix.IMAGE_SUFFIX_INDEX:
      return "IMAGE_SUFFIX_INDEX";
    case ImageFileSuffix.IMAGE_SUFFIX_TIMESTAMP:
      return "IMAGE_SUFFIX_TIMESTAMP";
    case ImageFileSuffix.UNRECOGNIZED:
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
  roomName?:
    | string
    | undefined;
  /** (optional) */
  layout?:
    | string
    | undefined;
  /** (default false) */
  audioOnly?:
    | boolean
    | undefined;
  /** (default false) */
  videoOnly?:
    | boolean
    | undefined;
  /** template base url (default https://recorder.livekit.io) */
  customBaseUrl?:
    | string
    | undefined;
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
  fileOutputs?: EncodedFileOutput[] | undefined;
  streamOutputs?: StreamOutput[] | undefined;
  segmentOutputs?: SegmentedFileOutput[] | undefined;
  imageOutputs?: ImageOutput[] | undefined;
}

/** record any website */
export interface WebEgressRequest {
  url?: string | undefined;
  audioOnly?: boolean | undefined;
  videoOnly?: boolean | undefined;
  awaitStartSignal?:
    | boolean
    | undefined;
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
  fileOutputs?: EncodedFileOutput[] | undefined;
  streamOutputs?: StreamOutput[] | undefined;
  segmentOutputs?: SegmentedFileOutput[] | undefined;
  imageOutputs?: ImageOutput[] | undefined;
}

/** record audio and video from a single participant */
export interface ParticipantEgressRequest {
  /** required */
  roomName?:
    | string
    | undefined;
  /** required */
  identity?:
    | string
    | undefined;
  /** (default false) */
  screenShare?:
    | boolean
    | undefined;
  /** (default H264_720P_30) */
  preset?:
    | EncodingOptionsPreset
    | undefined;
  /** (optional) */
  advanced?: EncodingOptions | undefined;
  fileOutputs?: EncodedFileOutput[] | undefined;
  streamOutputs?: StreamOutput[] | undefined;
  segmentOutputs?: SegmentedFileOutput[] | undefined;
  imageOutputs?: ImageOutput[] | undefined;
}

/** containerize up to one audio and one video track */
export interface TrackCompositeEgressRequest {
  /** required */
  roomName?:
    | string
    | undefined;
  /** (optional) */
  audioTrackId?:
    | string
    | undefined;
  /** (optional) */
  videoTrackId?:
    | string
    | undefined;
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
  fileOutputs?: EncodedFileOutput[] | undefined;
  streamOutputs?: StreamOutput[] | undefined;
  segmentOutputs?: SegmentedFileOutput[] | undefined;
  imageOutputs?: ImageOutput[] | undefined;
}

/** record tracks individually, without transcoding */
export interface TrackEgressRequest {
  /** required */
  roomName?:
    | string
    | undefined;
  /** required */
  trackId?: string | undefined;
  file?: DirectFileOutput | undefined;
  websocketUrl?: string | undefined;
}

export interface EncodedFileOutput {
  /** (optional) */
  fileType?:
    | EncodedFileType
    | undefined;
  /** see egress docs for templating (default {room_name}-{time}) */
  filepath?:
    | string
    | undefined;
  /** disable upload of manifest file (default false) */
  disableManifest?: boolean | undefined;
  s3?: S3Upload | undefined;
  gcp?: GCPUpload | undefined;
  azure?: AzureBlobUpload | undefined;
  aliOSS?: AliOSSUpload | undefined;
}

/** Used to generate HLS segments or other kind of segmented output */
export interface SegmentedFileOutput {
  /** (optional) */
  protocol?:
    | SegmentedFileProtocol
    | undefined;
  /** (optional) */
  filenamePrefix?:
    | string
    | undefined;
  /** (optional) */
  playlistName?:
    | string
    | undefined;
  /** (optional, disabled if not provided). Path of a live playlist */
  livePlaylistName?:
    | string
    | undefined;
  /** in seconds (optional) */
  segmentDuration?:
    | number
    | undefined;
  /** (optional, default INDEX) */
  filenameSuffix?:
    | SegmentedFileSuffix
    | undefined;
  /** disable upload of manifest file (default false) */
  disableManifest?: boolean | undefined;
  s3?: S3Upload | undefined;
  gcp?: GCPUpload | undefined;
  azure?: AzureBlobUpload | undefined;
  aliOSS?: AliOSSUpload | undefined;
}

export interface DirectFileOutput {
  /** see egress docs for templating (default {track_id}-{time}) */
  filepath?:
    | string
    | undefined;
  /** disable upload of manifest file (default false) */
  disableManifest?: boolean | undefined;
  s3?: S3Upload | undefined;
  gcp?: GCPUpload | undefined;
  azure?: AzureBlobUpload | undefined;
  aliOSS?: AliOSSUpload | undefined;
}

export interface ImageOutput {
  /** in seconds (required) */
  captureInterval?:
    | number
    | undefined;
  /** (optional, defaults to track width) */
  width?:
    | number
    | undefined;
  /** (optional, defaults to track height) */
  height?:
    | number
    | undefined;
  /** (optional) */
  filenamePrefix?:
    | string
    | undefined;
  /** (optional, default INDEX) */
  filenameSuffix?:
    | ImageFileSuffix
    | undefined;
  /** (optional) */
  imageCodec?:
    | ImageCodec
    | undefined;
  /** disable upload of manifest file (default false) */
  disableManifest?: boolean | undefined;
  s3?: S3Upload | undefined;
  gcp?: GCPUpload | undefined;
  azure?: AzureBlobUpload | undefined;
  aliOSS?: AliOSSUpload | undefined;
}

export interface S3Upload {
  accessKey?: string | undefined;
  secret?: string | undefined;
  region?: string | undefined;
  endpoint?: string | undefined;
  bucket?: string | undefined;
  forcePathStyle?: boolean | undefined;
  metadata?: { [key: string]: string } | undefined;
  tagging?: string | undefined;
  contentDisposition?: string | undefined;
}

export interface S3Upload_MetadataEntry {
  key: string;
  value: string;
}

export interface GCPUpload {
  credentials?: string | undefined;
  bucket?: string | undefined;
}

export interface AzureBlobUpload {
  accountName?: string | undefined;
  accountKey?: string | undefined;
  containerName?: string | undefined;
}

export interface AliOSSUpload {
  accessKey?: string | undefined;
  secret?: string | undefined;
  region?: string | undefined;
  endpoint?: string | undefined;
  bucket?: string | undefined;
}

export interface StreamOutput {
  /** required */
  protocol?:
    | StreamProtocol
    | undefined;
  /** required */
  urls?: string[] | undefined;
}

export interface EncodingOptions {
  /** (default 1920) */
  width?:
    | number
    | undefined;
  /** (default 1080) */
  height?:
    | number
    | undefined;
  /** (default 24) */
  depth?:
    | number
    | undefined;
  /** (default 30) */
  framerate?:
    | number
    | undefined;
  /** (default OPUS) */
  audioCodec?:
    | AudioCodec
    | undefined;
  /** (default 128) */
  audioBitrate?:
    | number
    | undefined;
  /** quality setting on audio encoder */
  audioQuality?:
    | number
    | undefined;
  /** (default 44100) */
  audioFrequency?:
    | number
    | undefined;
  /** (default H264_MAIN) */
  videoCodec?:
    | VideoCodec
    | undefined;
  /** (default 4500) */
  videoBitrate?:
    | number
    | undefined;
  /** quality setting on video encoder */
  videoQuality?:
    | number
    | undefined;
  /** in seconds (default 4s for streaming, segment duration for segmented output, encoder default for files) */
  keyFrameInterval?: number | undefined;
}

export interface UpdateLayoutRequest {
  egressId?: string | undefined;
  layout?: string | undefined;
}

export interface UpdateStreamRequest {
  egressId?: string | undefined;
  addOutputUrls?: string[] | undefined;
  removeOutputUrls?: string[] | undefined;
}

export interface ListEgressRequest {
  /** (optional, filter by room name) */
  roomName?:
    | string
    | undefined;
  /** (optional, filter by egress ID) */
  egressId?:
    | string
    | undefined;
  /** (optional, list active egress only) */
  active?: boolean | undefined;
}

export interface ListEgressResponse {
  items?: EgressInfo[] | undefined;
}

export interface StopEgressRequest {
  egressId?: string | undefined;
}

export interface EgressInfo {
  egressId?: string | undefined;
  roomId?: string | undefined;
  roomName?: string | undefined;
  status?: EgressStatus | undefined;
  startedAt?: number | undefined;
  endedAt?: number | undefined;
  updatedAt?: number | undefined;
  error?: string | undefined;
  roomComposite?: RoomCompositeEgressRequest | undefined;
  web?: WebEgressRequest | undefined;
  participant?: ParticipantEgressRequest | undefined;
  trackComposite?: TrackCompositeEgressRequest | undefined;
  track?:
    | TrackEgressRequest
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
  streamResults?: StreamInfo[] | undefined;
  fileResults?: FileInfo[] | undefined;
  segmentResults?: SegmentsInfo[] | undefined;
  imageResults?: ImagesInfo[] | undefined;
}

/** @deprecated */
export interface StreamInfoList {
  info?: StreamInfo[] | undefined;
}

export interface StreamInfo {
  url?: string | undefined;
  startedAt?: number | undefined;
  endedAt?: number | undefined;
  duration?: number | undefined;
  status?: StreamInfo_Status | undefined;
  error?: string | undefined;
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
  filename?: string | undefined;
  startedAt?: number | undefined;
  endedAt?: number | undefined;
  duration?: number | undefined;
  size?: number | undefined;
  location?: string | undefined;
}

export interface SegmentsInfo {
  playlistName?: string | undefined;
  livePlaylistName?: string | undefined;
  duration?: number | undefined;
  size?: number | undefined;
  playlistLocation?: string | undefined;
  livePlaylistLocation?: string | undefined;
  segmentCount?: number | undefined;
  startedAt?: number | undefined;
  endedAt?: number | undefined;
}

export interface ImagesInfo {
  imageCount?: number | undefined;
  startedAt?: number | undefined;
  endedAt?: number | undefined;
}

export interface AutoParticipantEgress {
  /** (default H264_720P_30) */
  preset?:
    | EncodingOptionsPreset
    | undefined;
  /** (optional) */
  advanced?: EncodingOptions | undefined;
  fileOutputs?: EncodedFileOutput[] | undefined;
  segmentOutputs?: SegmentedFileOutput[] | undefined;
}

export interface AutoTrackEgress {
  /** see docs for templating (default {track_id}-{time}) */
  filepath?:
    | string
    | undefined;
  /** disables upload of json manifest file (default false) */
  disableManifest?: boolean | undefined;
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
    imageOutputs: [],
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
    if (message.imageOutputs !== undefined && message.imageOutputs.length !== 0) {
      for (const v of message.imageOutputs) {
        ImageOutput.encode(v!, writer.uint32(114).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RoomCompositeEgressRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRoomCompositeEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.layout = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.audioOnly = reader.bool();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.videoOnly = reader.bool();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.customBaseUrl = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.file = EncodedFileOutput.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.stream = StreamOutput.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.segments = SegmentedFileOutput.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.preset = reader.int32() as any;
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.advanced = EncodingOptions.decode(reader, reader.uint32());
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.fileOutputs!.push(EncodedFileOutput.decode(reader, reader.uint32()));
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.streamOutputs!.push(StreamOutput.decode(reader, reader.uint32()));
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.segmentOutputs!.push(SegmentedFileOutput.decode(reader, reader.uint32()));
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.imageOutputs!.push(ImageOutput.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RoomCompositeEgressRequest {
    return {
      roomName: isSet(object.roomName) ? globalThis.String(object.roomName) : "",
      layout: isSet(object.layout) ? globalThis.String(object.layout) : "",
      audioOnly: isSet(object.audioOnly) ? globalThis.Boolean(object.audioOnly) : false,
      videoOnly: isSet(object.videoOnly) ? globalThis.Boolean(object.videoOnly) : false,
      customBaseUrl: isSet(object.customBaseUrl) ? globalThis.String(object.customBaseUrl) : "",
      file: isSet(object.file) ? EncodedFileOutput.fromJSON(object.file) : undefined,
      stream: isSet(object.stream) ? StreamOutput.fromJSON(object.stream) : undefined,
      segments: isSet(object.segments) ? SegmentedFileOutput.fromJSON(object.segments) : undefined,
      preset: isSet(object.preset) ? encodingOptionsPresetFromJSON(object.preset) : undefined,
      advanced: isSet(object.advanced) ? EncodingOptions.fromJSON(object.advanced) : undefined,
      fileOutputs: globalThis.Array.isArray(object?.fileOutputs)
        ? object.fileOutputs.map((e: any) => EncodedFileOutput.fromJSON(e))
        : [],
      streamOutputs: globalThis.Array.isArray(object?.streamOutputs)
        ? object.streamOutputs.map((e: any) => StreamOutput.fromJSON(e))
        : [],
      segmentOutputs: globalThis.Array.isArray(object?.segmentOutputs)
        ? object.segmentOutputs.map((e: any) => SegmentedFileOutput.fromJSON(e))
        : [],
      imageOutputs: globalThis.Array.isArray(object?.imageOutputs)
        ? object.imageOutputs.map((e: any) => ImageOutput.fromJSON(e))
        : [],
    };
  },

  toJSON(message: RoomCompositeEgressRequest): unknown {
    const obj: any = {};
    if (message.roomName !== undefined && message.roomName !== "") {
      obj.roomName = message.roomName;
    }
    if (message.layout !== undefined && message.layout !== "") {
      obj.layout = message.layout;
    }
    if (message.audioOnly === true) {
      obj.audioOnly = message.audioOnly;
    }
    if (message.videoOnly === true) {
      obj.videoOnly = message.videoOnly;
    }
    if (message.customBaseUrl !== undefined && message.customBaseUrl !== "") {
      obj.customBaseUrl = message.customBaseUrl;
    }
    if (message.file !== undefined) {
      obj.file = EncodedFileOutput.toJSON(message.file);
    }
    if (message.stream !== undefined) {
      obj.stream = StreamOutput.toJSON(message.stream);
    }
    if (message.segments !== undefined) {
      obj.segments = SegmentedFileOutput.toJSON(message.segments);
    }
    if (message.preset !== undefined) {
      obj.preset = encodingOptionsPresetToJSON(message.preset);
    }
    if (message.advanced !== undefined) {
      obj.advanced = EncodingOptions.toJSON(message.advanced);
    }
    if (message.fileOutputs?.length) {
      obj.fileOutputs = message.fileOutputs.map((e) => EncodedFileOutput.toJSON(e));
    }
    if (message.streamOutputs?.length) {
      obj.streamOutputs = message.streamOutputs.map((e) => StreamOutput.toJSON(e));
    }
    if (message.segmentOutputs?.length) {
      obj.segmentOutputs = message.segmentOutputs.map((e) => SegmentedFileOutput.toJSON(e));
    }
    if (message.imageOutputs?.length) {
      obj.imageOutputs = message.imageOutputs.map((e) => ImageOutput.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RoomCompositeEgressRequest>, I>>(base?: I): RoomCompositeEgressRequest {
    return RoomCompositeEgressRequest.fromPartial(base ?? ({} as any));
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
    message.imageOutputs = object.imageOutputs?.map((e) => ImageOutput.fromPartial(e)) || [];
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
    imageOutputs: [],
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
    if (message.imageOutputs !== undefined && message.imageOutputs.length !== 0) {
      for (const v of message.imageOutputs) {
        ImageOutput.encode(v!, writer.uint32(106).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WebEgressRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWebEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.url = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.audioOnly = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.videoOnly = reader.bool();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.awaitStartSignal = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.file = EncodedFileOutput.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.stream = StreamOutput.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.segments = SegmentedFileOutput.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.preset = reader.int32() as any;
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.advanced = EncodingOptions.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.fileOutputs!.push(EncodedFileOutput.decode(reader, reader.uint32()));
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.streamOutputs!.push(StreamOutput.decode(reader, reader.uint32()));
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.segmentOutputs!.push(SegmentedFileOutput.decode(reader, reader.uint32()));
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.imageOutputs!.push(ImageOutput.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WebEgressRequest {
    return {
      url: isSet(object.url) ? globalThis.String(object.url) : "",
      audioOnly: isSet(object.audioOnly) ? globalThis.Boolean(object.audioOnly) : false,
      videoOnly: isSet(object.videoOnly) ? globalThis.Boolean(object.videoOnly) : false,
      awaitStartSignal: isSet(object.awaitStartSignal) ? globalThis.Boolean(object.awaitStartSignal) : false,
      file: isSet(object.file) ? EncodedFileOutput.fromJSON(object.file) : undefined,
      stream: isSet(object.stream) ? StreamOutput.fromJSON(object.stream) : undefined,
      segments: isSet(object.segments) ? SegmentedFileOutput.fromJSON(object.segments) : undefined,
      preset: isSet(object.preset) ? encodingOptionsPresetFromJSON(object.preset) : undefined,
      advanced: isSet(object.advanced) ? EncodingOptions.fromJSON(object.advanced) : undefined,
      fileOutputs: globalThis.Array.isArray(object?.fileOutputs)
        ? object.fileOutputs.map((e: any) => EncodedFileOutput.fromJSON(e))
        : [],
      streamOutputs: globalThis.Array.isArray(object?.streamOutputs)
        ? object.streamOutputs.map((e: any) => StreamOutput.fromJSON(e))
        : [],
      segmentOutputs: globalThis.Array.isArray(object?.segmentOutputs)
        ? object.segmentOutputs.map((e: any) => SegmentedFileOutput.fromJSON(e))
        : [],
      imageOutputs: globalThis.Array.isArray(object?.imageOutputs)
        ? object.imageOutputs.map((e: any) => ImageOutput.fromJSON(e))
        : [],
    };
  },

  toJSON(message: WebEgressRequest): unknown {
    const obj: any = {};
    if (message.url !== undefined && message.url !== "") {
      obj.url = message.url;
    }
    if (message.audioOnly === true) {
      obj.audioOnly = message.audioOnly;
    }
    if (message.videoOnly === true) {
      obj.videoOnly = message.videoOnly;
    }
    if (message.awaitStartSignal === true) {
      obj.awaitStartSignal = message.awaitStartSignal;
    }
    if (message.file !== undefined) {
      obj.file = EncodedFileOutput.toJSON(message.file);
    }
    if (message.stream !== undefined) {
      obj.stream = StreamOutput.toJSON(message.stream);
    }
    if (message.segments !== undefined) {
      obj.segments = SegmentedFileOutput.toJSON(message.segments);
    }
    if (message.preset !== undefined) {
      obj.preset = encodingOptionsPresetToJSON(message.preset);
    }
    if (message.advanced !== undefined) {
      obj.advanced = EncodingOptions.toJSON(message.advanced);
    }
    if (message.fileOutputs?.length) {
      obj.fileOutputs = message.fileOutputs.map((e) => EncodedFileOutput.toJSON(e));
    }
    if (message.streamOutputs?.length) {
      obj.streamOutputs = message.streamOutputs.map((e) => StreamOutput.toJSON(e));
    }
    if (message.segmentOutputs?.length) {
      obj.segmentOutputs = message.segmentOutputs.map((e) => SegmentedFileOutput.toJSON(e));
    }
    if (message.imageOutputs?.length) {
      obj.imageOutputs = message.imageOutputs.map((e) => ImageOutput.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<WebEgressRequest>, I>>(base?: I): WebEgressRequest {
    return WebEgressRequest.fromPartial(base ?? ({} as any));
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
    message.imageOutputs = object.imageOutputs?.map((e) => ImageOutput.fromPartial(e)) || [];
    return message;
  },
};

function createBaseParticipantEgressRequest(): ParticipantEgressRequest {
  return {
    roomName: "",
    identity: "",
    screenShare: false,
    preset: undefined,
    advanced: undefined,
    fileOutputs: [],
    streamOutputs: [],
    segmentOutputs: [],
    imageOutputs: [],
  };
}

export const ParticipantEgressRequest = {
  encode(message: ParticipantEgressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomName !== undefined && message.roomName !== "") {
      writer.uint32(10).string(message.roomName);
    }
    if (message.identity !== undefined && message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    if (message.screenShare === true) {
      writer.uint32(24).bool(message.screenShare);
    }
    if (message.preset !== undefined) {
      writer.uint32(32).int32(message.preset);
    }
    if (message.advanced !== undefined) {
      EncodingOptions.encode(message.advanced, writer.uint32(42).fork()).ldelim();
    }
    if (message.fileOutputs !== undefined && message.fileOutputs.length !== 0) {
      for (const v of message.fileOutputs) {
        EncodedFileOutput.encode(v!, writer.uint32(50).fork()).ldelim();
      }
    }
    if (message.streamOutputs !== undefined && message.streamOutputs.length !== 0) {
      for (const v of message.streamOutputs) {
        StreamOutput.encode(v!, writer.uint32(58).fork()).ldelim();
      }
    }
    if (message.segmentOutputs !== undefined && message.segmentOutputs.length !== 0) {
      for (const v of message.segmentOutputs) {
        SegmentedFileOutput.encode(v!, writer.uint32(66).fork()).ldelim();
      }
    }
    if (message.imageOutputs !== undefined && message.imageOutputs.length !== 0) {
      for (const v of message.imageOutputs) {
        ImageOutput.encode(v!, writer.uint32(74).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParticipantEgressRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParticipantEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomName = reader.string();
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

          message.screenShare = reader.bool();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.preset = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.advanced = EncodingOptions.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.fileOutputs!.push(EncodedFileOutput.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.streamOutputs!.push(StreamOutput.decode(reader, reader.uint32()));
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.segmentOutputs!.push(SegmentedFileOutput.decode(reader, reader.uint32()));
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.imageOutputs!.push(ImageOutput.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ParticipantEgressRequest {
    return {
      roomName: isSet(object.roomName) ? globalThis.String(object.roomName) : "",
      identity: isSet(object.identity) ? globalThis.String(object.identity) : "",
      screenShare: isSet(object.screenShare) ? globalThis.Boolean(object.screenShare) : false,
      preset: isSet(object.preset) ? encodingOptionsPresetFromJSON(object.preset) : undefined,
      advanced: isSet(object.advanced) ? EncodingOptions.fromJSON(object.advanced) : undefined,
      fileOutputs: globalThis.Array.isArray(object?.fileOutputs)
        ? object.fileOutputs.map((e: any) => EncodedFileOutput.fromJSON(e))
        : [],
      streamOutputs: globalThis.Array.isArray(object?.streamOutputs)
        ? object.streamOutputs.map((e: any) => StreamOutput.fromJSON(e))
        : [],
      segmentOutputs: globalThis.Array.isArray(object?.segmentOutputs)
        ? object.segmentOutputs.map((e: any) => SegmentedFileOutput.fromJSON(e))
        : [],
      imageOutputs: globalThis.Array.isArray(object?.imageOutputs)
        ? object.imageOutputs.map((e: any) => ImageOutput.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ParticipantEgressRequest): unknown {
    const obj: any = {};
    if (message.roomName !== undefined && message.roomName !== "") {
      obj.roomName = message.roomName;
    }
    if (message.identity !== undefined && message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.screenShare === true) {
      obj.screenShare = message.screenShare;
    }
    if (message.preset !== undefined) {
      obj.preset = encodingOptionsPresetToJSON(message.preset);
    }
    if (message.advanced !== undefined) {
      obj.advanced = EncodingOptions.toJSON(message.advanced);
    }
    if (message.fileOutputs?.length) {
      obj.fileOutputs = message.fileOutputs.map((e) => EncodedFileOutput.toJSON(e));
    }
    if (message.streamOutputs?.length) {
      obj.streamOutputs = message.streamOutputs.map((e) => StreamOutput.toJSON(e));
    }
    if (message.segmentOutputs?.length) {
      obj.segmentOutputs = message.segmentOutputs.map((e) => SegmentedFileOutput.toJSON(e));
    }
    if (message.imageOutputs?.length) {
      obj.imageOutputs = message.imageOutputs.map((e) => ImageOutput.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ParticipantEgressRequest>, I>>(base?: I): ParticipantEgressRequest {
    return ParticipantEgressRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ParticipantEgressRequest>, I>>(object: I): ParticipantEgressRequest {
    const message = createBaseParticipantEgressRequest();
    message.roomName = object.roomName ?? "";
    message.identity = object.identity ?? "";
    message.screenShare = object.screenShare ?? false;
    message.preset = object.preset ?? undefined;
    message.advanced = (object.advanced !== undefined && object.advanced !== null)
      ? EncodingOptions.fromPartial(object.advanced)
      : undefined;
    message.fileOutputs = object.fileOutputs?.map((e) => EncodedFileOutput.fromPartial(e)) || [];
    message.streamOutputs = object.streamOutputs?.map((e) => StreamOutput.fromPartial(e)) || [];
    message.segmentOutputs = object.segmentOutputs?.map((e) => SegmentedFileOutput.fromPartial(e)) || [];
    message.imageOutputs = object.imageOutputs?.map((e) => ImageOutput.fromPartial(e)) || [];
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
    imageOutputs: [],
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
    if (message.imageOutputs !== undefined && message.imageOutputs.length !== 0) {
      for (const v of message.imageOutputs) {
        ImageOutput.encode(v!, writer.uint32(114).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TrackCompositeEgressRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrackCompositeEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.audioTrackId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.videoTrackId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.file = EncodedFileOutput.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.stream = StreamOutput.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.segments = SegmentedFileOutput.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.preset = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.advanced = EncodingOptions.decode(reader, reader.uint32());
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.fileOutputs!.push(EncodedFileOutput.decode(reader, reader.uint32()));
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.streamOutputs!.push(StreamOutput.decode(reader, reader.uint32()));
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.segmentOutputs!.push(SegmentedFileOutput.decode(reader, reader.uint32()));
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.imageOutputs!.push(ImageOutput.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TrackCompositeEgressRequest {
    return {
      roomName: isSet(object.roomName) ? globalThis.String(object.roomName) : "",
      audioTrackId: isSet(object.audioTrackId) ? globalThis.String(object.audioTrackId) : "",
      videoTrackId: isSet(object.videoTrackId) ? globalThis.String(object.videoTrackId) : "",
      file: isSet(object.file) ? EncodedFileOutput.fromJSON(object.file) : undefined,
      stream: isSet(object.stream) ? StreamOutput.fromJSON(object.stream) : undefined,
      segments: isSet(object.segments) ? SegmentedFileOutput.fromJSON(object.segments) : undefined,
      preset: isSet(object.preset) ? encodingOptionsPresetFromJSON(object.preset) : undefined,
      advanced: isSet(object.advanced) ? EncodingOptions.fromJSON(object.advanced) : undefined,
      fileOutputs: globalThis.Array.isArray(object?.fileOutputs)
        ? object.fileOutputs.map((e: any) => EncodedFileOutput.fromJSON(e))
        : [],
      streamOutputs: globalThis.Array.isArray(object?.streamOutputs)
        ? object.streamOutputs.map((e: any) => StreamOutput.fromJSON(e))
        : [],
      segmentOutputs: globalThis.Array.isArray(object?.segmentOutputs)
        ? object.segmentOutputs.map((e: any) => SegmentedFileOutput.fromJSON(e))
        : [],
      imageOutputs: globalThis.Array.isArray(object?.imageOutputs)
        ? object.imageOutputs.map((e: any) => ImageOutput.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TrackCompositeEgressRequest): unknown {
    const obj: any = {};
    if (message.roomName !== undefined && message.roomName !== "") {
      obj.roomName = message.roomName;
    }
    if (message.audioTrackId !== undefined && message.audioTrackId !== "") {
      obj.audioTrackId = message.audioTrackId;
    }
    if (message.videoTrackId !== undefined && message.videoTrackId !== "") {
      obj.videoTrackId = message.videoTrackId;
    }
    if (message.file !== undefined) {
      obj.file = EncodedFileOutput.toJSON(message.file);
    }
    if (message.stream !== undefined) {
      obj.stream = StreamOutput.toJSON(message.stream);
    }
    if (message.segments !== undefined) {
      obj.segments = SegmentedFileOutput.toJSON(message.segments);
    }
    if (message.preset !== undefined) {
      obj.preset = encodingOptionsPresetToJSON(message.preset);
    }
    if (message.advanced !== undefined) {
      obj.advanced = EncodingOptions.toJSON(message.advanced);
    }
    if (message.fileOutputs?.length) {
      obj.fileOutputs = message.fileOutputs.map((e) => EncodedFileOutput.toJSON(e));
    }
    if (message.streamOutputs?.length) {
      obj.streamOutputs = message.streamOutputs.map((e) => StreamOutput.toJSON(e));
    }
    if (message.segmentOutputs?.length) {
      obj.segmentOutputs = message.segmentOutputs.map((e) => SegmentedFileOutput.toJSON(e));
    }
    if (message.imageOutputs?.length) {
      obj.imageOutputs = message.imageOutputs.map((e) => ImageOutput.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TrackCompositeEgressRequest>, I>>(base?: I): TrackCompositeEgressRequest {
    return TrackCompositeEgressRequest.fromPartial(base ?? ({} as any));
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
    message.imageOutputs = object.imageOutputs?.map((e) => ImageOutput.fromPartial(e)) || [];
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrackEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.trackId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.file = DirectFileOutput.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.websocketUrl = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TrackEgressRequest {
    return {
      roomName: isSet(object.roomName) ? globalThis.String(object.roomName) : "",
      trackId: isSet(object.trackId) ? globalThis.String(object.trackId) : "",
      file: isSet(object.file) ? DirectFileOutput.fromJSON(object.file) : undefined,
      websocketUrl: isSet(object.websocketUrl) ? globalThis.String(object.websocketUrl) : undefined,
    };
  },

  toJSON(message: TrackEgressRequest): unknown {
    const obj: any = {};
    if (message.roomName !== undefined && message.roomName !== "") {
      obj.roomName = message.roomName;
    }
    if (message.trackId !== undefined && message.trackId !== "") {
      obj.trackId = message.trackId;
    }
    if (message.file !== undefined) {
      obj.file = DirectFileOutput.toJSON(message.file);
    }
    if (message.websocketUrl !== undefined) {
      obj.websocketUrl = message.websocketUrl;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TrackEgressRequest>, I>>(base?: I): TrackEgressRequest {
    return TrackEgressRequest.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncodedFileOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.fileType = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.filepath = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.disableManifest = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.s3 = S3Upload.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.gcp = GCPUpload.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.azure = AzureBlobUpload.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.aliOSS = AliOSSUpload.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EncodedFileOutput {
    return {
      fileType: isSet(object.fileType) ? encodedFileTypeFromJSON(object.fileType) : 0,
      filepath: isSet(object.filepath) ? globalThis.String(object.filepath) : "",
      disableManifest: isSet(object.disableManifest) ? globalThis.Boolean(object.disableManifest) : false,
      s3: isSet(object.s3) ? S3Upload.fromJSON(object.s3) : undefined,
      gcp: isSet(object.gcp) ? GCPUpload.fromJSON(object.gcp) : undefined,
      azure: isSet(object.azure) ? AzureBlobUpload.fromJSON(object.azure) : undefined,
      aliOSS: isSet(object.aliOSS) ? AliOSSUpload.fromJSON(object.aliOSS) : undefined,
    };
  },

  toJSON(message: EncodedFileOutput): unknown {
    const obj: any = {};
    if (message.fileType !== undefined && message.fileType !== 0) {
      obj.fileType = encodedFileTypeToJSON(message.fileType);
    }
    if (message.filepath !== undefined && message.filepath !== "") {
      obj.filepath = message.filepath;
    }
    if (message.disableManifest === true) {
      obj.disableManifest = message.disableManifest;
    }
    if (message.s3 !== undefined) {
      obj.s3 = S3Upload.toJSON(message.s3);
    }
    if (message.gcp !== undefined) {
      obj.gcp = GCPUpload.toJSON(message.gcp);
    }
    if (message.azure !== undefined) {
      obj.azure = AzureBlobUpload.toJSON(message.azure);
    }
    if (message.aliOSS !== undefined) {
      obj.aliOSS = AliOSSUpload.toJSON(message.aliOSS);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EncodedFileOutput>, I>>(base?: I): EncodedFileOutput {
    return EncodedFileOutput.fromPartial(base ?? ({} as any));
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
    livePlaylistName: "",
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
    if (message.livePlaylistName !== undefined && message.livePlaylistName !== "") {
      writer.uint32(90).string(message.livePlaylistName);
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSegmentedFileOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.protocol = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.filenamePrefix = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.playlistName = reader.string();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.livePlaylistName = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.segmentDuration = reader.uint32();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.filenameSuffix = reader.int32() as any;
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.disableManifest = reader.bool();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.s3 = S3Upload.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.gcp = GCPUpload.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.azure = AzureBlobUpload.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.aliOSS = AliOSSUpload.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SegmentedFileOutput {
    return {
      protocol: isSet(object.protocol) ? segmentedFileProtocolFromJSON(object.protocol) : 0,
      filenamePrefix: isSet(object.filenamePrefix) ? globalThis.String(object.filenamePrefix) : "",
      playlistName: isSet(object.playlistName) ? globalThis.String(object.playlistName) : "",
      livePlaylistName: isSet(object.livePlaylistName) ? globalThis.String(object.livePlaylistName) : "",
      segmentDuration: isSet(object.segmentDuration) ? globalThis.Number(object.segmentDuration) : 0,
      filenameSuffix: isSet(object.filenameSuffix) ? segmentedFileSuffixFromJSON(object.filenameSuffix) : 0,
      disableManifest: isSet(object.disableManifest) ? globalThis.Boolean(object.disableManifest) : false,
      s3: isSet(object.s3) ? S3Upload.fromJSON(object.s3) : undefined,
      gcp: isSet(object.gcp) ? GCPUpload.fromJSON(object.gcp) : undefined,
      azure: isSet(object.azure) ? AzureBlobUpload.fromJSON(object.azure) : undefined,
      aliOSS: isSet(object.aliOSS) ? AliOSSUpload.fromJSON(object.aliOSS) : undefined,
    };
  },

  toJSON(message: SegmentedFileOutput): unknown {
    const obj: any = {};
    if (message.protocol !== undefined && message.protocol !== 0) {
      obj.protocol = segmentedFileProtocolToJSON(message.protocol);
    }
    if (message.filenamePrefix !== undefined && message.filenamePrefix !== "") {
      obj.filenamePrefix = message.filenamePrefix;
    }
    if (message.playlistName !== undefined && message.playlistName !== "") {
      obj.playlistName = message.playlistName;
    }
    if (message.livePlaylistName !== undefined && message.livePlaylistName !== "") {
      obj.livePlaylistName = message.livePlaylistName;
    }
    if (message.segmentDuration !== undefined && message.segmentDuration !== 0) {
      obj.segmentDuration = Math.round(message.segmentDuration);
    }
    if (message.filenameSuffix !== undefined && message.filenameSuffix !== 0) {
      obj.filenameSuffix = segmentedFileSuffixToJSON(message.filenameSuffix);
    }
    if (message.disableManifest === true) {
      obj.disableManifest = message.disableManifest;
    }
    if (message.s3 !== undefined) {
      obj.s3 = S3Upload.toJSON(message.s3);
    }
    if (message.gcp !== undefined) {
      obj.gcp = GCPUpload.toJSON(message.gcp);
    }
    if (message.azure !== undefined) {
      obj.azure = AzureBlobUpload.toJSON(message.azure);
    }
    if (message.aliOSS !== undefined) {
      obj.aliOSS = AliOSSUpload.toJSON(message.aliOSS);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SegmentedFileOutput>, I>>(base?: I): SegmentedFileOutput {
    return SegmentedFileOutput.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SegmentedFileOutput>, I>>(object: I): SegmentedFileOutput {
    const message = createBaseSegmentedFileOutput();
    message.protocol = object.protocol ?? 0;
    message.filenamePrefix = object.filenamePrefix ?? "";
    message.playlistName = object.playlistName ?? "";
    message.livePlaylistName = object.livePlaylistName ?? "";
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDirectFileOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.filepath = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.disableManifest = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.s3 = S3Upload.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.gcp = GCPUpload.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.azure = AzureBlobUpload.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.aliOSS = AliOSSUpload.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DirectFileOutput {
    return {
      filepath: isSet(object.filepath) ? globalThis.String(object.filepath) : "",
      disableManifest: isSet(object.disableManifest) ? globalThis.Boolean(object.disableManifest) : false,
      s3: isSet(object.s3) ? S3Upload.fromJSON(object.s3) : undefined,
      gcp: isSet(object.gcp) ? GCPUpload.fromJSON(object.gcp) : undefined,
      azure: isSet(object.azure) ? AzureBlobUpload.fromJSON(object.azure) : undefined,
      aliOSS: isSet(object.aliOSS) ? AliOSSUpload.fromJSON(object.aliOSS) : undefined,
    };
  },

  toJSON(message: DirectFileOutput): unknown {
    const obj: any = {};
    if (message.filepath !== undefined && message.filepath !== "") {
      obj.filepath = message.filepath;
    }
    if (message.disableManifest === true) {
      obj.disableManifest = message.disableManifest;
    }
    if (message.s3 !== undefined) {
      obj.s3 = S3Upload.toJSON(message.s3);
    }
    if (message.gcp !== undefined) {
      obj.gcp = GCPUpload.toJSON(message.gcp);
    }
    if (message.azure !== undefined) {
      obj.azure = AzureBlobUpload.toJSON(message.azure);
    }
    if (message.aliOSS !== undefined) {
      obj.aliOSS = AliOSSUpload.toJSON(message.aliOSS);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DirectFileOutput>, I>>(base?: I): DirectFileOutput {
    return DirectFileOutput.fromPartial(base ?? ({} as any));
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

function createBaseImageOutput(): ImageOutput {
  return {
    captureInterval: 0,
    width: 0,
    height: 0,
    filenamePrefix: "",
    filenameSuffix: 0,
    imageCodec: 0,
    disableManifest: false,
    s3: undefined,
    gcp: undefined,
    azure: undefined,
    aliOSS: undefined,
  };
}

export const ImageOutput = {
  encode(message: ImageOutput, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.captureInterval !== undefined && message.captureInterval !== 0) {
      writer.uint32(8).uint32(message.captureInterval);
    }
    if (message.width !== undefined && message.width !== 0) {
      writer.uint32(16).int32(message.width);
    }
    if (message.height !== undefined && message.height !== 0) {
      writer.uint32(24).int32(message.height);
    }
    if (message.filenamePrefix !== undefined && message.filenamePrefix !== "") {
      writer.uint32(34).string(message.filenamePrefix);
    }
    if (message.filenameSuffix !== undefined && message.filenameSuffix !== 0) {
      writer.uint32(40).int32(message.filenameSuffix);
    }
    if (message.imageCodec !== undefined && message.imageCodec !== 0) {
      writer.uint32(48).int32(message.imageCodec);
    }
    if (message.disableManifest === true) {
      writer.uint32(56).bool(message.disableManifest);
    }
    if (message.s3 !== undefined) {
      S3Upload.encode(message.s3, writer.uint32(66).fork()).ldelim();
    }
    if (message.gcp !== undefined) {
      GCPUpload.encode(message.gcp, writer.uint32(74).fork()).ldelim();
    }
    if (message.azure !== undefined) {
      AzureBlobUpload.encode(message.azure, writer.uint32(82).fork()).ldelim();
    }
    if (message.aliOSS !== undefined) {
      AliOSSUpload.encode(message.aliOSS, writer.uint32(90).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ImageOutput {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseImageOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.captureInterval = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.width = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.height = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.filenamePrefix = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.filenameSuffix = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.imageCodec = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.disableManifest = reader.bool();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.s3 = S3Upload.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.gcp = GCPUpload.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.azure = AzureBlobUpload.decode(reader, reader.uint32());
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.aliOSS = AliOSSUpload.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ImageOutput {
    return {
      captureInterval: isSet(object.captureInterval) ? globalThis.Number(object.captureInterval) : 0,
      width: isSet(object.width) ? globalThis.Number(object.width) : 0,
      height: isSet(object.height) ? globalThis.Number(object.height) : 0,
      filenamePrefix: isSet(object.filenamePrefix) ? globalThis.String(object.filenamePrefix) : "",
      filenameSuffix: isSet(object.filenameSuffix) ? imageFileSuffixFromJSON(object.filenameSuffix) : 0,
      imageCodec: isSet(object.imageCodec) ? imageCodecFromJSON(object.imageCodec) : 0,
      disableManifest: isSet(object.disableManifest) ? globalThis.Boolean(object.disableManifest) : false,
      s3: isSet(object.s3) ? S3Upload.fromJSON(object.s3) : undefined,
      gcp: isSet(object.gcp) ? GCPUpload.fromJSON(object.gcp) : undefined,
      azure: isSet(object.azure) ? AzureBlobUpload.fromJSON(object.azure) : undefined,
      aliOSS: isSet(object.aliOSS) ? AliOSSUpload.fromJSON(object.aliOSS) : undefined,
    };
  },

  toJSON(message: ImageOutput): unknown {
    const obj: any = {};
    if (message.captureInterval !== undefined && message.captureInterval !== 0) {
      obj.captureInterval = Math.round(message.captureInterval);
    }
    if (message.width !== undefined && message.width !== 0) {
      obj.width = Math.round(message.width);
    }
    if (message.height !== undefined && message.height !== 0) {
      obj.height = Math.round(message.height);
    }
    if (message.filenamePrefix !== undefined && message.filenamePrefix !== "") {
      obj.filenamePrefix = message.filenamePrefix;
    }
    if (message.filenameSuffix !== undefined && message.filenameSuffix !== 0) {
      obj.filenameSuffix = imageFileSuffixToJSON(message.filenameSuffix);
    }
    if (message.imageCodec !== undefined && message.imageCodec !== 0) {
      obj.imageCodec = imageCodecToJSON(message.imageCodec);
    }
    if (message.disableManifest === true) {
      obj.disableManifest = message.disableManifest;
    }
    if (message.s3 !== undefined) {
      obj.s3 = S3Upload.toJSON(message.s3);
    }
    if (message.gcp !== undefined) {
      obj.gcp = GCPUpload.toJSON(message.gcp);
    }
    if (message.azure !== undefined) {
      obj.azure = AzureBlobUpload.toJSON(message.azure);
    }
    if (message.aliOSS !== undefined) {
      obj.aliOSS = AliOSSUpload.toJSON(message.aliOSS);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ImageOutput>, I>>(base?: I): ImageOutput {
    return ImageOutput.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ImageOutput>, I>>(object: I): ImageOutput {
    const message = createBaseImageOutput();
    message.captureInterval = object.captureInterval ?? 0;
    message.width = object.width ?? 0;
    message.height = object.height ?? 0;
    message.filenamePrefix = object.filenamePrefix ?? "";
    message.filenameSuffix = object.filenameSuffix ?? 0;
    message.imageCodec = object.imageCodec ?? 0;
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
    contentDisposition: "",
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
    if (message.contentDisposition !== undefined && message.contentDisposition !== "") {
      writer.uint32(74).string(message.contentDisposition);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): S3Upload {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseS3Upload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.accessKey = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.secret = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.region = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.endpoint = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.bucket = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.forcePathStyle = reader.bool();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          const entry7 = S3Upload_MetadataEntry.decode(reader, reader.uint32());
          if (entry7.value !== undefined) {
            message.metadata![entry7.key] = entry7.value;
          }
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.tagging = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.contentDisposition = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): S3Upload {
    return {
      accessKey: isSet(object.accessKey) ? globalThis.String(object.accessKey) : "",
      secret: isSet(object.secret) ? globalThis.String(object.secret) : "",
      region: isSet(object.region) ? globalThis.String(object.region) : "",
      endpoint: isSet(object.endpoint) ? globalThis.String(object.endpoint) : "",
      bucket: isSet(object.bucket) ? globalThis.String(object.bucket) : "",
      forcePathStyle: isSet(object.forcePathStyle) ? globalThis.Boolean(object.forcePathStyle) : false,
      metadata: isObject(object.metadata)
        ? Object.entries(object.metadata).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      tagging: isSet(object.tagging) ? globalThis.String(object.tagging) : "",
      contentDisposition: isSet(object.contentDisposition) ? globalThis.String(object.contentDisposition) : "",
    };
  },

  toJSON(message: S3Upload): unknown {
    const obj: any = {};
    if (message.accessKey !== undefined && message.accessKey !== "") {
      obj.accessKey = message.accessKey;
    }
    if (message.secret !== undefined && message.secret !== "") {
      obj.secret = message.secret;
    }
    if (message.region !== undefined && message.region !== "") {
      obj.region = message.region;
    }
    if (message.endpoint !== undefined && message.endpoint !== "") {
      obj.endpoint = message.endpoint;
    }
    if (message.bucket !== undefined && message.bucket !== "") {
      obj.bucket = message.bucket;
    }
    if (message.forcePathStyle === true) {
      obj.forcePathStyle = message.forcePathStyle;
    }
    if (message.metadata) {
      const entries = Object.entries(message.metadata);
      if (entries.length > 0) {
        obj.metadata = {};
        entries.forEach(([k, v]) => {
          obj.metadata[k] = v;
        });
      }
    }
    if (message.tagging !== undefined && message.tagging !== "") {
      obj.tagging = message.tagging;
    }
    if (message.contentDisposition !== undefined && message.contentDisposition !== "") {
      obj.contentDisposition = message.contentDisposition;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<S3Upload>, I>>(base?: I): S3Upload {
    return S3Upload.fromPartial(base ?? ({} as any));
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
        acc[key] = globalThis.String(value);
      }
      return acc;
    }, {});
    message.tagging = object.tagging ?? "";
    message.contentDisposition = object.contentDisposition ?? "";
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseS3Upload_MetadataEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): S3Upload_MetadataEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: S3Upload_MetadataEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<S3Upload_MetadataEntry>, I>>(base?: I): S3Upload_MetadataEntry {
    return S3Upload_MetadataEntry.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGCPUpload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.credentials = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.bucket = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GCPUpload {
    return {
      credentials: isSet(object.credentials) ? globalThis.String(object.credentials) : "",
      bucket: isSet(object.bucket) ? globalThis.String(object.bucket) : "",
    };
  },

  toJSON(message: GCPUpload): unknown {
    const obj: any = {};
    if (message.credentials !== undefined && message.credentials !== "") {
      obj.credentials = message.credentials;
    }
    if (message.bucket !== undefined && message.bucket !== "") {
      obj.bucket = message.bucket;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GCPUpload>, I>>(base?: I): GCPUpload {
    return GCPUpload.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAzureBlobUpload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.accountName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.accountKey = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.containerName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AzureBlobUpload {
    return {
      accountName: isSet(object.accountName) ? globalThis.String(object.accountName) : "",
      accountKey: isSet(object.accountKey) ? globalThis.String(object.accountKey) : "",
      containerName: isSet(object.containerName) ? globalThis.String(object.containerName) : "",
    };
  },

  toJSON(message: AzureBlobUpload): unknown {
    const obj: any = {};
    if (message.accountName !== undefined && message.accountName !== "") {
      obj.accountName = message.accountName;
    }
    if (message.accountKey !== undefined && message.accountKey !== "") {
      obj.accountKey = message.accountKey;
    }
    if (message.containerName !== undefined && message.containerName !== "") {
      obj.containerName = message.containerName;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AzureBlobUpload>, I>>(base?: I): AzureBlobUpload {
    return AzureBlobUpload.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAliOSSUpload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.accessKey = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.secret = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.region = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.endpoint = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.bucket = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AliOSSUpload {
    return {
      accessKey: isSet(object.accessKey) ? globalThis.String(object.accessKey) : "",
      secret: isSet(object.secret) ? globalThis.String(object.secret) : "",
      region: isSet(object.region) ? globalThis.String(object.region) : "",
      endpoint: isSet(object.endpoint) ? globalThis.String(object.endpoint) : "",
      bucket: isSet(object.bucket) ? globalThis.String(object.bucket) : "",
    };
  },

  toJSON(message: AliOSSUpload): unknown {
    const obj: any = {};
    if (message.accessKey !== undefined && message.accessKey !== "") {
      obj.accessKey = message.accessKey;
    }
    if (message.secret !== undefined && message.secret !== "") {
      obj.secret = message.secret;
    }
    if (message.region !== undefined && message.region !== "") {
      obj.region = message.region;
    }
    if (message.endpoint !== undefined && message.endpoint !== "") {
      obj.endpoint = message.endpoint;
    }
    if (message.bucket !== undefined && message.bucket !== "") {
      obj.bucket = message.bucket;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AliOSSUpload>, I>>(base?: I): AliOSSUpload {
    return AliOSSUpload.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.protocol = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.urls!.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StreamOutput {
    return {
      protocol: isSet(object.protocol) ? streamProtocolFromJSON(object.protocol) : 0,
      urls: globalThis.Array.isArray(object?.urls) ? object.urls.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: StreamOutput): unknown {
    const obj: any = {};
    if (message.protocol !== undefined && message.protocol !== 0) {
      obj.protocol = streamProtocolToJSON(message.protocol);
    }
    if (message.urls?.length) {
      obj.urls = message.urls;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamOutput>, I>>(base?: I): StreamOutput {
    return StreamOutput.fromPartial(base ?? ({} as any));
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
    audioQuality: 0,
    audioFrequency: 0,
    videoCodec: 0,
    videoBitrate: 0,
    videoQuality: 0,
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
    if (message.audioQuality !== undefined && message.audioQuality !== 0) {
      writer.uint32(88).int32(message.audioQuality);
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
    if (message.videoQuality !== undefined && message.videoQuality !== 0) {
      writer.uint32(96).int32(message.videoQuality);
    }
    if (message.keyFrameInterval !== undefined && message.keyFrameInterval !== 0) {
      writer.uint32(81).double(message.keyFrameInterval);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EncodingOptions {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncodingOptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.width = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.height = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.depth = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.framerate = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.audioCodec = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.audioBitrate = reader.int32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.audioQuality = reader.int32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.audioFrequency = reader.int32();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.videoCodec = reader.int32() as any;
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.videoBitrate = reader.int32();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.videoQuality = reader.int32();
          continue;
        case 10:
          if (tag !== 81) {
            break;
          }

          message.keyFrameInterval = reader.double();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EncodingOptions {
    return {
      width: isSet(object.width) ? globalThis.Number(object.width) : 0,
      height: isSet(object.height) ? globalThis.Number(object.height) : 0,
      depth: isSet(object.depth) ? globalThis.Number(object.depth) : 0,
      framerate: isSet(object.framerate) ? globalThis.Number(object.framerate) : 0,
      audioCodec: isSet(object.audioCodec) ? audioCodecFromJSON(object.audioCodec) : 0,
      audioBitrate: isSet(object.audioBitrate) ? globalThis.Number(object.audioBitrate) : 0,
      audioQuality: isSet(object.audioQuality) ? globalThis.Number(object.audioQuality) : 0,
      audioFrequency: isSet(object.audioFrequency) ? globalThis.Number(object.audioFrequency) : 0,
      videoCodec: isSet(object.videoCodec) ? videoCodecFromJSON(object.videoCodec) : 0,
      videoBitrate: isSet(object.videoBitrate) ? globalThis.Number(object.videoBitrate) : 0,
      videoQuality: isSet(object.videoQuality) ? globalThis.Number(object.videoQuality) : 0,
      keyFrameInterval: isSet(object.keyFrameInterval) ? globalThis.Number(object.keyFrameInterval) : 0,
    };
  },

  toJSON(message: EncodingOptions): unknown {
    const obj: any = {};
    if (message.width !== undefined && message.width !== 0) {
      obj.width = Math.round(message.width);
    }
    if (message.height !== undefined && message.height !== 0) {
      obj.height = Math.round(message.height);
    }
    if (message.depth !== undefined && message.depth !== 0) {
      obj.depth = Math.round(message.depth);
    }
    if (message.framerate !== undefined && message.framerate !== 0) {
      obj.framerate = Math.round(message.framerate);
    }
    if (message.audioCodec !== undefined && message.audioCodec !== 0) {
      obj.audioCodec = audioCodecToJSON(message.audioCodec);
    }
    if (message.audioBitrate !== undefined && message.audioBitrate !== 0) {
      obj.audioBitrate = Math.round(message.audioBitrate);
    }
    if (message.audioQuality !== undefined && message.audioQuality !== 0) {
      obj.audioQuality = Math.round(message.audioQuality);
    }
    if (message.audioFrequency !== undefined && message.audioFrequency !== 0) {
      obj.audioFrequency = Math.round(message.audioFrequency);
    }
    if (message.videoCodec !== undefined && message.videoCodec !== 0) {
      obj.videoCodec = videoCodecToJSON(message.videoCodec);
    }
    if (message.videoBitrate !== undefined && message.videoBitrate !== 0) {
      obj.videoBitrate = Math.round(message.videoBitrate);
    }
    if (message.videoQuality !== undefined && message.videoQuality !== 0) {
      obj.videoQuality = Math.round(message.videoQuality);
    }
    if (message.keyFrameInterval !== undefined && message.keyFrameInterval !== 0) {
      obj.keyFrameInterval = message.keyFrameInterval;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EncodingOptions>, I>>(base?: I): EncodingOptions {
    return EncodingOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EncodingOptions>, I>>(object: I): EncodingOptions {
    const message = createBaseEncodingOptions();
    message.width = object.width ?? 0;
    message.height = object.height ?? 0;
    message.depth = object.depth ?? 0;
    message.framerate = object.framerate ?? 0;
    message.audioCodec = object.audioCodec ?? 0;
    message.audioBitrate = object.audioBitrate ?? 0;
    message.audioQuality = object.audioQuality ?? 0;
    message.audioFrequency = object.audioFrequency ?? 0;
    message.videoCodec = object.videoCodec ?? 0;
    message.videoBitrate = object.videoBitrate ?? 0;
    message.videoQuality = object.videoQuality ?? 0;
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateLayoutRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.egressId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.layout = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateLayoutRequest {
    return {
      egressId: isSet(object.egressId) ? globalThis.String(object.egressId) : "",
      layout: isSet(object.layout) ? globalThis.String(object.layout) : "",
    };
  },

  toJSON(message: UpdateLayoutRequest): unknown {
    const obj: any = {};
    if (message.egressId !== undefined && message.egressId !== "") {
      obj.egressId = message.egressId;
    }
    if (message.layout !== undefined && message.layout !== "") {
      obj.layout = message.layout;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateLayoutRequest>, I>>(base?: I): UpdateLayoutRequest {
    return UpdateLayoutRequest.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateStreamRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.egressId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.addOutputUrls!.push(reader.string());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.removeOutputUrls!.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateStreamRequest {
    return {
      egressId: isSet(object.egressId) ? globalThis.String(object.egressId) : "",
      addOutputUrls: globalThis.Array.isArray(object?.addOutputUrls)
        ? object.addOutputUrls.map((e: any) => globalThis.String(e))
        : [],
      removeOutputUrls: globalThis.Array.isArray(object?.removeOutputUrls)
        ? object.removeOutputUrls.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: UpdateStreamRequest): unknown {
    const obj: any = {};
    if (message.egressId !== undefined && message.egressId !== "") {
      obj.egressId = message.egressId;
    }
    if (message.addOutputUrls?.length) {
      obj.addOutputUrls = message.addOutputUrls;
    }
    if (message.removeOutputUrls?.length) {
      obj.removeOutputUrls = message.removeOutputUrls;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateStreamRequest>, I>>(base?: I): UpdateStreamRequest {
    return UpdateStreamRequest.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.egressId = reader.string();
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

  fromJSON(object: any): ListEgressRequest {
    return {
      roomName: isSet(object.roomName) ? globalThis.String(object.roomName) : "",
      egressId: isSet(object.egressId) ? globalThis.String(object.egressId) : "",
      active: isSet(object.active) ? globalThis.Boolean(object.active) : false,
    };
  },

  toJSON(message: ListEgressRequest): unknown {
    const obj: any = {};
    if (message.roomName !== undefined && message.roomName !== "") {
      obj.roomName = message.roomName;
    }
    if (message.egressId !== undefined && message.egressId !== "") {
      obj.egressId = message.egressId;
    }
    if (message.active === true) {
      obj.active = message.active;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ListEgressRequest>, I>>(base?: I): ListEgressRequest {
    return ListEgressRequest.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListEgressResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.items!.push(EgressInfo.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListEgressResponse {
    return {
      items: globalThis.Array.isArray(object?.items) ? object.items.map((e: any) => EgressInfo.fromJSON(e)) : [],
    };
  },

  toJSON(message: ListEgressResponse): unknown {
    const obj: any = {};
    if (message.items?.length) {
      obj.items = message.items.map((e) => EgressInfo.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ListEgressResponse>, I>>(base?: I): ListEgressResponse {
    return ListEgressResponse.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStopEgressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.egressId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StopEgressRequest {
    return { egressId: isSet(object.egressId) ? globalThis.String(object.egressId) : "" };
  },

  toJSON(message: StopEgressRequest): unknown {
    const obj: any = {};
    if (message.egressId !== undefined && message.egressId !== "") {
      obj.egressId = message.egressId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StopEgressRequest>, I>>(base?: I): StopEgressRequest {
    return StopEgressRequest.fromPartial(base ?? ({} as any));
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
    web: undefined,
    participant: undefined,
    trackComposite: undefined,
    track: undefined,
    stream: undefined,
    file: undefined,
    segments: undefined,
    streamResults: [],
    fileResults: [],
    segmentResults: [],
    imageResults: [],
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
    if (message.web !== undefined) {
      WebEgressRequest.encode(message.web, writer.uint32(114).fork()).ldelim();
    }
    if (message.participant !== undefined) {
      ParticipantEgressRequest.encode(message.participant, writer.uint32(154).fork()).ldelim();
    }
    if (message.trackComposite !== undefined) {
      TrackCompositeEgressRequest.encode(message.trackComposite, writer.uint32(42).fork()).ldelim();
    }
    if (message.track !== undefined) {
      TrackEgressRequest.encode(message.track, writer.uint32(50).fork()).ldelim();
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
    if (message.imageResults !== undefined && message.imageResults.length !== 0) {
      for (const v of message.imageResults) {
        ImagesInfo.encode(v!, writer.uint32(162).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EgressInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEgressInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.egressId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.roomId = reader.string();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.roomName = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.startedAt = longToNumber(reader.int64() as Long);
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.endedAt = longToNumber(reader.int64() as Long);
          continue;
        case 18:
          if (tag !== 144) {
            break;
          }

          message.updatedAt = longToNumber(reader.int64() as Long);
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.error = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.roomComposite = RoomCompositeEgressRequest.decode(reader, reader.uint32());
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.web = WebEgressRequest.decode(reader, reader.uint32());
          continue;
        case 19:
          if (tag !== 154) {
            break;
          }

          message.participant = ParticipantEgressRequest.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.trackComposite = TrackCompositeEgressRequest.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.track = TrackEgressRequest.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.stream = StreamInfoList.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.file = FileInfo.decode(reader, reader.uint32());
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.segments = SegmentsInfo.decode(reader, reader.uint32());
          continue;
        case 15:
          if (tag !== 122) {
            break;
          }

          message.streamResults!.push(StreamInfo.decode(reader, reader.uint32()));
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.fileResults!.push(FileInfo.decode(reader, reader.uint32()));
          continue;
        case 17:
          if (tag !== 138) {
            break;
          }

          message.segmentResults!.push(SegmentsInfo.decode(reader, reader.uint32()));
          continue;
        case 20:
          if (tag !== 162) {
            break;
          }

          message.imageResults!.push(ImagesInfo.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EgressInfo {
    return {
      egressId: isSet(object.egressId) ? globalThis.String(object.egressId) : "",
      roomId: isSet(object.roomId) ? globalThis.String(object.roomId) : "",
      roomName: isSet(object.roomName) ? globalThis.String(object.roomName) : "",
      status: isSet(object.status) ? egressStatusFromJSON(object.status) : 0,
      startedAt: isSet(object.startedAt) ? globalThis.Number(object.startedAt) : 0,
      endedAt: isSet(object.endedAt) ? globalThis.Number(object.endedAt) : 0,
      updatedAt: isSet(object.updatedAt) ? globalThis.Number(object.updatedAt) : 0,
      error: isSet(object.error) ? globalThis.String(object.error) : "",
      roomComposite: isSet(object.roomComposite)
        ? RoomCompositeEgressRequest.fromJSON(object.roomComposite)
        : undefined,
      web: isSet(object.web) ? WebEgressRequest.fromJSON(object.web) : undefined,
      participant: isSet(object.participant) ? ParticipantEgressRequest.fromJSON(object.participant) : undefined,
      trackComposite: isSet(object.trackComposite)
        ? TrackCompositeEgressRequest.fromJSON(object.trackComposite)
        : undefined,
      track: isSet(object.track) ? TrackEgressRequest.fromJSON(object.track) : undefined,
      stream: isSet(object.stream) ? StreamInfoList.fromJSON(object.stream) : undefined,
      file: isSet(object.file) ? FileInfo.fromJSON(object.file) : undefined,
      segments: isSet(object.segments) ? SegmentsInfo.fromJSON(object.segments) : undefined,
      streamResults: globalThis.Array.isArray(object?.streamResults)
        ? object.streamResults.map((e: any) => StreamInfo.fromJSON(e))
        : [],
      fileResults: globalThis.Array.isArray(object?.fileResults)
        ? object.fileResults.map((e: any) => FileInfo.fromJSON(e))
        : [],
      segmentResults: globalThis.Array.isArray(object?.segmentResults)
        ? object.segmentResults.map((e: any) => SegmentsInfo.fromJSON(e))
        : [],
      imageResults: globalThis.Array.isArray(object?.imageResults)
        ? object.imageResults.map((e: any) => ImagesInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: EgressInfo): unknown {
    const obj: any = {};
    if (message.egressId !== undefined && message.egressId !== "") {
      obj.egressId = message.egressId;
    }
    if (message.roomId !== undefined && message.roomId !== "") {
      obj.roomId = message.roomId;
    }
    if (message.roomName !== undefined && message.roomName !== "") {
      obj.roomName = message.roomName;
    }
    if (message.status !== undefined && message.status !== 0) {
      obj.status = egressStatusToJSON(message.status);
    }
    if (message.startedAt !== undefined && message.startedAt !== 0) {
      obj.startedAt = Math.round(message.startedAt);
    }
    if (message.endedAt !== undefined && message.endedAt !== 0) {
      obj.endedAt = Math.round(message.endedAt);
    }
    if (message.updatedAt !== undefined && message.updatedAt !== 0) {
      obj.updatedAt = Math.round(message.updatedAt);
    }
    if (message.error !== undefined && message.error !== "") {
      obj.error = message.error;
    }
    if (message.roomComposite !== undefined) {
      obj.roomComposite = RoomCompositeEgressRequest.toJSON(message.roomComposite);
    }
    if (message.web !== undefined) {
      obj.web = WebEgressRequest.toJSON(message.web);
    }
    if (message.participant !== undefined) {
      obj.participant = ParticipantEgressRequest.toJSON(message.participant);
    }
    if (message.trackComposite !== undefined) {
      obj.trackComposite = TrackCompositeEgressRequest.toJSON(message.trackComposite);
    }
    if (message.track !== undefined) {
      obj.track = TrackEgressRequest.toJSON(message.track);
    }
    if (message.stream !== undefined) {
      obj.stream = StreamInfoList.toJSON(message.stream);
    }
    if (message.file !== undefined) {
      obj.file = FileInfo.toJSON(message.file);
    }
    if (message.segments !== undefined) {
      obj.segments = SegmentsInfo.toJSON(message.segments);
    }
    if (message.streamResults?.length) {
      obj.streamResults = message.streamResults.map((e) => StreamInfo.toJSON(e));
    }
    if (message.fileResults?.length) {
      obj.fileResults = message.fileResults.map((e) => FileInfo.toJSON(e));
    }
    if (message.segmentResults?.length) {
      obj.segmentResults = message.segmentResults.map((e) => SegmentsInfo.toJSON(e));
    }
    if (message.imageResults?.length) {
      obj.imageResults = message.imageResults.map((e) => ImagesInfo.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EgressInfo>, I>>(base?: I): EgressInfo {
    return EgressInfo.fromPartial(base ?? ({} as any));
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
    message.web = (object.web !== undefined && object.web !== null)
      ? WebEgressRequest.fromPartial(object.web)
      : undefined;
    message.participant = (object.participant !== undefined && object.participant !== null)
      ? ParticipantEgressRequest.fromPartial(object.participant)
      : undefined;
    message.trackComposite = (object.trackComposite !== undefined && object.trackComposite !== null)
      ? TrackCompositeEgressRequest.fromPartial(object.trackComposite)
      : undefined;
    message.track = (object.track !== undefined && object.track !== null)
      ? TrackEgressRequest.fromPartial(object.track)
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
    message.imageResults = object.imageResults?.map((e) => ImagesInfo.fromPartial(e)) || [];
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamInfoList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.info!.push(StreamInfo.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StreamInfoList {
    return { info: globalThis.Array.isArray(object?.info) ? object.info.map((e: any) => StreamInfo.fromJSON(e)) : [] };
  },

  toJSON(message: StreamInfoList): unknown {
    const obj: any = {};
    if (message.info?.length) {
      obj.info = message.info.map((e) => StreamInfo.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamInfoList>, I>>(base?: I): StreamInfoList {
    return StreamInfoList.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.url = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.startedAt = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.endedAt = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.duration = longToNumber(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.error = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StreamInfo {
    return {
      url: isSet(object.url) ? globalThis.String(object.url) : "",
      startedAt: isSet(object.startedAt) ? globalThis.Number(object.startedAt) : 0,
      endedAt: isSet(object.endedAt) ? globalThis.Number(object.endedAt) : 0,
      duration: isSet(object.duration) ? globalThis.Number(object.duration) : 0,
      status: isSet(object.status) ? streamInfo_StatusFromJSON(object.status) : 0,
      error: isSet(object.error) ? globalThis.String(object.error) : "",
    };
  },

  toJSON(message: StreamInfo): unknown {
    const obj: any = {};
    if (message.url !== undefined && message.url !== "") {
      obj.url = message.url;
    }
    if (message.startedAt !== undefined && message.startedAt !== 0) {
      obj.startedAt = Math.round(message.startedAt);
    }
    if (message.endedAt !== undefined && message.endedAt !== 0) {
      obj.endedAt = Math.round(message.endedAt);
    }
    if (message.duration !== undefined && message.duration !== 0) {
      obj.duration = Math.round(message.duration);
    }
    if (message.status !== undefined && message.status !== 0) {
      obj.status = streamInfo_StatusToJSON(message.status);
    }
    if (message.error !== undefined && message.error !== "") {
      obj.error = message.error;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamInfo>, I>>(base?: I): StreamInfo {
    return StreamInfo.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.filename = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.startedAt = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.endedAt = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.duration = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.size = longToNumber(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.location = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FileInfo {
    return {
      filename: isSet(object.filename) ? globalThis.String(object.filename) : "",
      startedAt: isSet(object.startedAt) ? globalThis.Number(object.startedAt) : 0,
      endedAt: isSet(object.endedAt) ? globalThis.Number(object.endedAt) : 0,
      duration: isSet(object.duration) ? globalThis.Number(object.duration) : 0,
      size: isSet(object.size) ? globalThis.Number(object.size) : 0,
      location: isSet(object.location) ? globalThis.String(object.location) : "",
    };
  },

  toJSON(message: FileInfo): unknown {
    const obj: any = {};
    if (message.filename !== undefined && message.filename !== "") {
      obj.filename = message.filename;
    }
    if (message.startedAt !== undefined && message.startedAt !== 0) {
      obj.startedAt = Math.round(message.startedAt);
    }
    if (message.endedAt !== undefined && message.endedAt !== 0) {
      obj.endedAt = Math.round(message.endedAt);
    }
    if (message.duration !== undefined && message.duration !== 0) {
      obj.duration = Math.round(message.duration);
    }
    if (message.size !== undefined && message.size !== 0) {
      obj.size = Math.round(message.size);
    }
    if (message.location !== undefined && message.location !== "") {
      obj.location = message.location;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FileInfo>, I>>(base?: I): FileInfo {
    return FileInfo.fromPartial(base ?? ({} as any));
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
  return {
    playlistName: "",
    livePlaylistName: "",
    duration: 0,
    size: 0,
    playlistLocation: "",
    livePlaylistLocation: "",
    segmentCount: 0,
    startedAt: 0,
    endedAt: 0,
  };
}

export const SegmentsInfo = {
  encode(message: SegmentsInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.playlistName !== undefined && message.playlistName !== "") {
      writer.uint32(10).string(message.playlistName);
    }
    if (message.livePlaylistName !== undefined && message.livePlaylistName !== "") {
      writer.uint32(66).string(message.livePlaylistName);
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
    if (message.livePlaylistLocation !== undefined && message.livePlaylistLocation !== "") {
      writer.uint32(74).string(message.livePlaylistLocation);
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSegmentsInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.playlistName = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.livePlaylistName = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.duration = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.size = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.playlistLocation = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.livePlaylistLocation = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.segmentCount = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.startedAt = longToNumber(reader.int64() as Long);
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.endedAt = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SegmentsInfo {
    return {
      playlistName: isSet(object.playlistName) ? globalThis.String(object.playlistName) : "",
      livePlaylistName: isSet(object.livePlaylistName) ? globalThis.String(object.livePlaylistName) : "",
      duration: isSet(object.duration) ? globalThis.Number(object.duration) : 0,
      size: isSet(object.size) ? globalThis.Number(object.size) : 0,
      playlistLocation: isSet(object.playlistLocation) ? globalThis.String(object.playlistLocation) : "",
      livePlaylistLocation: isSet(object.livePlaylistLocation) ? globalThis.String(object.livePlaylistLocation) : "",
      segmentCount: isSet(object.segmentCount) ? globalThis.Number(object.segmentCount) : 0,
      startedAt: isSet(object.startedAt) ? globalThis.Number(object.startedAt) : 0,
      endedAt: isSet(object.endedAt) ? globalThis.Number(object.endedAt) : 0,
    };
  },

  toJSON(message: SegmentsInfo): unknown {
    const obj: any = {};
    if (message.playlistName !== undefined && message.playlistName !== "") {
      obj.playlistName = message.playlistName;
    }
    if (message.livePlaylistName !== undefined && message.livePlaylistName !== "") {
      obj.livePlaylistName = message.livePlaylistName;
    }
    if (message.duration !== undefined && message.duration !== 0) {
      obj.duration = Math.round(message.duration);
    }
    if (message.size !== undefined && message.size !== 0) {
      obj.size = Math.round(message.size);
    }
    if (message.playlistLocation !== undefined && message.playlistLocation !== "") {
      obj.playlistLocation = message.playlistLocation;
    }
    if (message.livePlaylistLocation !== undefined && message.livePlaylistLocation !== "") {
      obj.livePlaylistLocation = message.livePlaylistLocation;
    }
    if (message.segmentCount !== undefined && message.segmentCount !== 0) {
      obj.segmentCount = Math.round(message.segmentCount);
    }
    if (message.startedAt !== undefined && message.startedAt !== 0) {
      obj.startedAt = Math.round(message.startedAt);
    }
    if (message.endedAt !== undefined && message.endedAt !== 0) {
      obj.endedAt = Math.round(message.endedAt);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SegmentsInfo>, I>>(base?: I): SegmentsInfo {
    return SegmentsInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SegmentsInfo>, I>>(object: I): SegmentsInfo {
    const message = createBaseSegmentsInfo();
    message.playlistName = object.playlistName ?? "";
    message.livePlaylistName = object.livePlaylistName ?? "";
    message.duration = object.duration ?? 0;
    message.size = object.size ?? 0;
    message.playlistLocation = object.playlistLocation ?? "";
    message.livePlaylistLocation = object.livePlaylistLocation ?? "";
    message.segmentCount = object.segmentCount ?? 0;
    message.startedAt = object.startedAt ?? 0;
    message.endedAt = object.endedAt ?? 0;
    return message;
  },
};

function createBaseImagesInfo(): ImagesInfo {
  return { imageCount: 0, startedAt: 0, endedAt: 0 };
}

export const ImagesInfo = {
  encode(message: ImagesInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.imageCount !== undefined && message.imageCount !== 0) {
      writer.uint32(8).int64(message.imageCount);
    }
    if (message.startedAt !== undefined && message.startedAt !== 0) {
      writer.uint32(16).int64(message.startedAt);
    }
    if (message.endedAt !== undefined && message.endedAt !== 0) {
      writer.uint32(24).int64(message.endedAt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ImagesInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseImagesInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.imageCount = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.startedAt = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.endedAt = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ImagesInfo {
    return {
      imageCount: isSet(object.imageCount) ? globalThis.Number(object.imageCount) : 0,
      startedAt: isSet(object.startedAt) ? globalThis.Number(object.startedAt) : 0,
      endedAt: isSet(object.endedAt) ? globalThis.Number(object.endedAt) : 0,
    };
  },

  toJSON(message: ImagesInfo): unknown {
    const obj: any = {};
    if (message.imageCount !== undefined && message.imageCount !== 0) {
      obj.imageCount = Math.round(message.imageCount);
    }
    if (message.startedAt !== undefined && message.startedAt !== 0) {
      obj.startedAt = Math.round(message.startedAt);
    }
    if (message.endedAt !== undefined && message.endedAt !== 0) {
      obj.endedAt = Math.round(message.endedAt);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ImagesInfo>, I>>(base?: I): ImagesInfo {
    return ImagesInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ImagesInfo>, I>>(object: I): ImagesInfo {
    const message = createBaseImagesInfo();
    message.imageCount = object.imageCount ?? 0;
    message.startedAt = object.startedAt ?? 0;
    message.endedAt = object.endedAt ?? 0;
    return message;
  },
};

function createBaseAutoParticipantEgress(): AutoParticipantEgress {
  return { preset: undefined, advanced: undefined, fileOutputs: [], segmentOutputs: [] };
}

export const AutoParticipantEgress = {
  encode(message: AutoParticipantEgress, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.preset !== undefined) {
      writer.uint32(8).int32(message.preset);
    }
    if (message.advanced !== undefined) {
      EncodingOptions.encode(message.advanced, writer.uint32(18).fork()).ldelim();
    }
    if (message.fileOutputs !== undefined && message.fileOutputs.length !== 0) {
      for (const v of message.fileOutputs) {
        EncodedFileOutput.encode(v!, writer.uint32(26).fork()).ldelim();
      }
    }
    if (message.segmentOutputs !== undefined && message.segmentOutputs.length !== 0) {
      for (const v of message.segmentOutputs) {
        SegmentedFileOutput.encode(v!, writer.uint32(34).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AutoParticipantEgress {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAutoParticipantEgress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.preset = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.advanced = EncodingOptions.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.fileOutputs!.push(EncodedFileOutput.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.segmentOutputs!.push(SegmentedFileOutput.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AutoParticipantEgress {
    return {
      preset: isSet(object.preset) ? encodingOptionsPresetFromJSON(object.preset) : undefined,
      advanced: isSet(object.advanced) ? EncodingOptions.fromJSON(object.advanced) : undefined,
      fileOutputs: globalThis.Array.isArray(object?.fileOutputs)
        ? object.fileOutputs.map((e: any) => EncodedFileOutput.fromJSON(e))
        : [],
      segmentOutputs: globalThis.Array.isArray(object?.segmentOutputs)
        ? object.segmentOutputs.map((e: any) => SegmentedFileOutput.fromJSON(e))
        : [],
    };
  },

  toJSON(message: AutoParticipantEgress): unknown {
    const obj: any = {};
    if (message.preset !== undefined) {
      obj.preset = encodingOptionsPresetToJSON(message.preset);
    }
    if (message.advanced !== undefined) {
      obj.advanced = EncodingOptions.toJSON(message.advanced);
    }
    if (message.fileOutputs?.length) {
      obj.fileOutputs = message.fileOutputs.map((e) => EncodedFileOutput.toJSON(e));
    }
    if (message.segmentOutputs?.length) {
      obj.segmentOutputs = message.segmentOutputs.map((e) => SegmentedFileOutput.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AutoParticipantEgress>, I>>(base?: I): AutoParticipantEgress {
    return AutoParticipantEgress.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AutoParticipantEgress>, I>>(object: I): AutoParticipantEgress {
    const message = createBaseAutoParticipantEgress();
    message.preset = object.preset ?? undefined;
    message.advanced = (object.advanced !== undefined && object.advanced !== null)
      ? EncodingOptions.fromPartial(object.advanced)
      : undefined;
    message.fileOutputs = object.fileOutputs?.map((e) => EncodedFileOutput.fromPartial(e)) || [];
    message.segmentOutputs = object.segmentOutputs?.map((e) => SegmentedFileOutput.fromPartial(e)) || [];
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAutoTrackEgress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.filepath = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.disableManifest = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.s3 = S3Upload.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.gcp = GCPUpload.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.azure = AzureBlobUpload.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AutoTrackEgress {
    return {
      filepath: isSet(object.filepath) ? globalThis.String(object.filepath) : "",
      disableManifest: isSet(object.disableManifest) ? globalThis.Boolean(object.disableManifest) : false,
      s3: isSet(object.s3) ? S3Upload.fromJSON(object.s3) : undefined,
      gcp: isSet(object.gcp) ? GCPUpload.fromJSON(object.gcp) : undefined,
      azure: isSet(object.azure) ? AzureBlobUpload.fromJSON(object.azure) : undefined,
    };
  },

  toJSON(message: AutoTrackEgress): unknown {
    const obj: any = {};
    if (message.filepath !== undefined && message.filepath !== "") {
      obj.filepath = message.filepath;
    }
    if (message.disableManifest === true) {
      obj.disableManifest = message.disableManifest;
    }
    if (message.s3 !== undefined) {
      obj.s3 = S3Upload.toJSON(message.s3);
    }
    if (message.gcp !== undefined) {
      obj.gcp = GCPUpload.toJSON(message.gcp);
    }
    if (message.azure !== undefined) {
      obj.azure = AzureBlobUpload.toJSON(message.azure);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AutoTrackEgress>, I>>(base?: I): AutoTrackEgress {
    return AutoTrackEgress.fromPartial(base ?? ({} as any));
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
  StartWebEgress(request: WebEgressRequest): Promise<EgressInfo>;
  StartParticipantEgress(request: ParticipantEgressRequest): Promise<EgressInfo>;
  StartTrackCompositeEgress(request: TrackCompositeEgressRequest): Promise<EgressInfo>;
  StartTrackEgress(request: TrackEgressRequest): Promise<EgressInfo>;
  /** update web composite layout */
  UpdateLayout(request: UpdateLayoutRequest): Promise<EgressInfo>;
  /** add or remove stream endpoints */
  UpdateStream(request: UpdateStreamRequest): Promise<EgressInfo>;
  /** list available egress */
  ListEgress(request: ListEgressRequest): Promise<ListEgressResponse>;
  /** stop a recording or stream */
  StopEgress(request: StopEgressRequest): Promise<EgressInfo>;
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
