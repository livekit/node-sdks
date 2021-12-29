/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Empty } from "./google/protobuf/empty";

export const protobufPackage = "livekit";

export enum RecordingPreset {
  /** NONE - All presets use 44100 Hz, 128k bitrate for audio and a color depth of 24 */
  NONE = 0,
  /** HD_30 - 720p, 30fps, 3000 kpbs */
  HD_30 = 1,
  /** HD_60 - 720p, 60fps, 4500 kbps */
  HD_60 = 2,
  /** FULL_HD_30 - 1080p, 30fps, 4500 kbps */
  FULL_HD_30 = 3,
  /** FULL_HD_60 - 1080p, 60fps, 6000 kbps */
  FULL_HD_60 = 4,
  UNRECOGNIZED = -1,
}

export function recordingPresetFromJSON(object: any): RecordingPreset {
  switch (object) {
    case 0:
    case "NONE":
      return RecordingPreset.NONE;
    case 1:
    case "HD_30":
      return RecordingPreset.HD_30;
    case 2:
    case "HD_60":
      return RecordingPreset.HD_60;
    case 3:
    case "FULL_HD_30":
      return RecordingPreset.FULL_HD_30;
    case 4:
    case "FULL_HD_60":
      return RecordingPreset.FULL_HD_60;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RecordingPreset.UNRECOGNIZED;
  }
}

export function recordingPresetToJSON(object: RecordingPreset): string {
  switch (object) {
    case RecordingPreset.NONE:
      return "NONE";
    case RecordingPreset.HD_30:
      return "HD_30";
    case RecordingPreset.HD_60:
      return "HD_60";
    case RecordingPreset.FULL_HD_30:
      return "FULL_HD_30";
    case RecordingPreset.FULL_HD_60:
      return "FULL_HD_60";
    default:
      return "UNKNOWN";
  }
}

export interface StartRecordingRequest {
  url: string | undefined;
  template?: RecordingTemplate | undefined;
  rtmp?: RtmpOutput | undefined;
  filepath: string | undefined;
  options?: RecordingOptions;
}

export interface RecordingTemplate {
  layout: string;
  roomName: string;
  /** defaults to https://recorder.livekit.io */
  baseUrl: string;
}

export interface RtmpOutput {
  urls: string[];
}

export interface RecordingOptions {
  preset: RecordingPreset;
  /** default 1920 */
  width: number;
  /** default 1080 */
  height: number;
  /** default 24 */
  depth: number;
  /** default 30 */
  framerate: number;
  /** default 128 */
  audioBitrate: number;
  /** default 44100 */
  audioFrequency: number;
  /** default 4500 */
  videoBitrate: number;
  /** baseline, main, or high. default main */
  profile: string;
}

export interface StartRecordingResponse {
  recordingId: string;
}

export interface AddOutputRequest {
  recordingId: string;
  rtmpUrl: string;
}

export interface RemoveOutputRequest {
  recordingId: string;
  rtmpUrl: string;
}

export interface EndRecordingRequest {
  recordingId: string;
}

export interface RecordingInfo {
  id: string;
  roomName: string;
  active: boolean;
  error: string;
  file?: FileResult;
  rtmp: RtmpResult[];
}

export interface FileResult {
  downloadUrl: string;
  duration: number;
}

export interface RtmpResult {
  streamUrl: string;
  duration: number;
}

const baseStartRecordingRequest: object = {};

export const StartRecordingRequest = {
  encode(
    message: StartRecordingRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.url !== undefined) {
      writer.uint32(10).string(message.url);
    }
    if (message.template !== undefined) {
      RecordingTemplate.encode(
        message.template,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.rtmp !== undefined) {
      RtmpOutput.encode(message.rtmp, writer.uint32(26).fork()).ldelim();
    }
    if (message.filepath !== undefined) {
      writer.uint32(34).string(message.filepath);
    }
    if (message.options !== undefined) {
      RecordingOptions.encode(
        message.options,
        writer.uint32(42).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): StartRecordingRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStartRecordingRequest } as StartRecordingRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.url = reader.string();
          break;
        case 2:
          message.template = RecordingTemplate.decode(reader, reader.uint32());
          break;
        case 3:
          message.rtmp = RtmpOutput.decode(reader, reader.uint32());
          break;
        case 4:
          message.filepath = reader.string();
          break;
        case 5:
          message.options = RecordingOptions.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StartRecordingRequest {
    const message = { ...baseStartRecordingRequest } as StartRecordingRequest;
    if (object.url !== undefined && object.url !== null) {
      message.url = String(object.url);
    } else {
      message.url = undefined;
    }
    if (object.template !== undefined && object.template !== null) {
      message.template = RecordingTemplate.fromJSON(object.template);
    } else {
      message.template = undefined;
    }
    if (object.rtmp !== undefined && object.rtmp !== null) {
      message.rtmp = RtmpOutput.fromJSON(object.rtmp);
    } else {
      message.rtmp = undefined;
    }
    if (object.filepath !== undefined && object.filepath !== null) {
      message.filepath = String(object.filepath);
    } else {
      message.filepath = undefined;
    }
    if (object.options !== undefined && object.options !== null) {
      message.options = RecordingOptions.fromJSON(object.options);
    } else {
      message.options = undefined;
    }
    return message;
  },

  toJSON(message: StartRecordingRequest): unknown {
    const obj: any = {};
    message.url !== undefined && (obj.url = message.url);
    message.template !== undefined &&
      (obj.template = message.template
        ? RecordingTemplate.toJSON(message.template)
        : undefined);
    message.rtmp !== undefined &&
      (obj.rtmp = message.rtmp ? RtmpOutput.toJSON(message.rtmp) : undefined);
    message.filepath !== undefined && (obj.filepath = message.filepath);
    message.options !== undefined &&
      (obj.options = message.options
        ? RecordingOptions.toJSON(message.options)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<StartRecordingRequest>
  ): StartRecordingRequest {
    const message = { ...baseStartRecordingRequest } as StartRecordingRequest;
    if (object.url !== undefined && object.url !== null) {
      message.url = object.url;
    } else {
      message.url = undefined;
    }
    if (object.template !== undefined && object.template !== null) {
      message.template = RecordingTemplate.fromPartial(object.template);
    } else {
      message.template = undefined;
    }
    if (object.rtmp !== undefined && object.rtmp !== null) {
      message.rtmp = RtmpOutput.fromPartial(object.rtmp);
    } else {
      message.rtmp = undefined;
    }
    if (object.filepath !== undefined && object.filepath !== null) {
      message.filepath = object.filepath;
    } else {
      message.filepath = undefined;
    }
    if (object.options !== undefined && object.options !== null) {
      message.options = RecordingOptions.fromPartial(object.options);
    } else {
      message.options = undefined;
    }
    return message;
  },
};

const baseRecordingTemplate: object = { layout: "", roomName: "", baseUrl: "" };

export const RecordingTemplate = {
  encode(
    message: RecordingTemplate,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.layout !== "") {
      writer.uint32(10).string(message.layout);
    }
    if (message.roomName !== "") {
      writer.uint32(18).string(message.roomName);
    }
    if (message.baseUrl !== "") {
      writer.uint32(26).string(message.baseUrl);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RecordingTemplate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRecordingTemplate } as RecordingTemplate;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.layout = reader.string();
          break;
        case 2:
          message.roomName = reader.string();
          break;
        case 3:
          message.baseUrl = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RecordingTemplate {
    const message = { ...baseRecordingTemplate } as RecordingTemplate;
    if (object.layout !== undefined && object.layout !== null) {
      message.layout = String(object.layout);
    } else {
      message.layout = "";
    }
    if (object.roomName !== undefined && object.roomName !== null) {
      message.roomName = String(object.roomName);
    } else {
      message.roomName = "";
    }
    if (object.baseUrl !== undefined && object.baseUrl !== null) {
      message.baseUrl = String(object.baseUrl);
    } else {
      message.baseUrl = "";
    }
    return message;
  },

  toJSON(message: RecordingTemplate): unknown {
    const obj: any = {};
    message.layout !== undefined && (obj.layout = message.layout);
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.baseUrl !== undefined && (obj.baseUrl = message.baseUrl);
    return obj;
  },

  fromPartial(object: DeepPartial<RecordingTemplate>): RecordingTemplate {
    const message = { ...baseRecordingTemplate } as RecordingTemplate;
    if (object.layout !== undefined && object.layout !== null) {
      message.layout = object.layout;
    } else {
      message.layout = "";
    }
    if (object.roomName !== undefined && object.roomName !== null) {
      message.roomName = object.roomName;
    } else {
      message.roomName = "";
    }
    if (object.baseUrl !== undefined && object.baseUrl !== null) {
      message.baseUrl = object.baseUrl;
    } else {
      message.baseUrl = "";
    }
    return message;
  },
};

const baseRtmpOutput: object = { urls: "" };

export const RtmpOutput = {
  encode(
    message: RtmpOutput,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.urls) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RtmpOutput {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRtmpOutput } as RtmpOutput;
    message.urls = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.urls.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RtmpOutput {
    const message = { ...baseRtmpOutput } as RtmpOutput;
    message.urls = [];
    if (object.urls !== undefined && object.urls !== null) {
      for (const e of object.urls) {
        message.urls.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: RtmpOutput): unknown {
    const obj: any = {};
    if (message.urls) {
      obj.urls = message.urls.map((e) => e);
    } else {
      obj.urls = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<RtmpOutput>): RtmpOutput {
    const message = { ...baseRtmpOutput } as RtmpOutput;
    message.urls = [];
    if (object.urls !== undefined && object.urls !== null) {
      for (const e of object.urls) {
        message.urls.push(e);
      }
    }
    return message;
  },
};

const baseRecordingOptions: object = {
  preset: 0,
  width: 0,
  height: 0,
  depth: 0,
  framerate: 0,
  audioBitrate: 0,
  audioFrequency: 0,
  videoBitrate: 0,
  profile: "",
};

export const RecordingOptions = {
  encode(
    message: RecordingOptions,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.preset !== 0) {
      writer.uint32(8).int32(message.preset);
    }
    if (message.width !== 0) {
      writer.uint32(16).int32(message.width);
    }
    if (message.height !== 0) {
      writer.uint32(24).int32(message.height);
    }
    if (message.depth !== 0) {
      writer.uint32(32).int32(message.depth);
    }
    if (message.framerate !== 0) {
      writer.uint32(40).int32(message.framerate);
    }
    if (message.audioBitrate !== 0) {
      writer.uint32(48).int32(message.audioBitrate);
    }
    if (message.audioFrequency !== 0) {
      writer.uint32(56).int32(message.audioFrequency);
    }
    if (message.videoBitrate !== 0) {
      writer.uint32(64).int32(message.videoBitrate);
    }
    if (message.profile !== "") {
      writer.uint32(74).string(message.profile);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RecordingOptions {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRecordingOptions } as RecordingOptions;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.preset = reader.int32() as any;
          break;
        case 2:
          message.width = reader.int32();
          break;
        case 3:
          message.height = reader.int32();
          break;
        case 4:
          message.depth = reader.int32();
          break;
        case 5:
          message.framerate = reader.int32();
          break;
        case 6:
          message.audioBitrate = reader.int32();
          break;
        case 7:
          message.audioFrequency = reader.int32();
          break;
        case 8:
          message.videoBitrate = reader.int32();
          break;
        case 9:
          message.profile = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RecordingOptions {
    const message = { ...baseRecordingOptions } as RecordingOptions;
    if (object.preset !== undefined && object.preset !== null) {
      message.preset = recordingPresetFromJSON(object.preset);
    } else {
      message.preset = 0;
    }
    if (object.width !== undefined && object.width !== null) {
      message.width = Number(object.width);
    } else {
      message.width = 0;
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Number(object.height);
    } else {
      message.height = 0;
    }
    if (object.depth !== undefined && object.depth !== null) {
      message.depth = Number(object.depth);
    } else {
      message.depth = 0;
    }
    if (object.framerate !== undefined && object.framerate !== null) {
      message.framerate = Number(object.framerate);
    } else {
      message.framerate = 0;
    }
    if (object.audioBitrate !== undefined && object.audioBitrate !== null) {
      message.audioBitrate = Number(object.audioBitrate);
    } else {
      message.audioBitrate = 0;
    }
    if (object.audioFrequency !== undefined && object.audioFrequency !== null) {
      message.audioFrequency = Number(object.audioFrequency);
    } else {
      message.audioFrequency = 0;
    }
    if (object.videoBitrate !== undefined && object.videoBitrate !== null) {
      message.videoBitrate = Number(object.videoBitrate);
    } else {
      message.videoBitrate = 0;
    }
    if (object.profile !== undefined && object.profile !== null) {
      message.profile = String(object.profile);
    } else {
      message.profile = "";
    }
    return message;
  },

  toJSON(message: RecordingOptions): unknown {
    const obj: any = {};
    message.preset !== undefined &&
      (obj.preset = recordingPresetToJSON(message.preset));
    message.width !== undefined && (obj.width = message.width);
    message.height !== undefined && (obj.height = message.height);
    message.depth !== undefined && (obj.depth = message.depth);
    message.framerate !== undefined && (obj.framerate = message.framerate);
    message.audioBitrate !== undefined &&
      (obj.audioBitrate = message.audioBitrate);
    message.audioFrequency !== undefined &&
      (obj.audioFrequency = message.audioFrequency);
    message.videoBitrate !== undefined &&
      (obj.videoBitrate = message.videoBitrate);
    message.profile !== undefined && (obj.profile = message.profile);
    return obj;
  },

  fromPartial(object: DeepPartial<RecordingOptions>): RecordingOptions {
    const message = { ...baseRecordingOptions } as RecordingOptions;
    if (object.preset !== undefined && object.preset !== null) {
      message.preset = object.preset;
    } else {
      message.preset = 0;
    }
    if (object.width !== undefined && object.width !== null) {
      message.width = object.width;
    } else {
      message.width = 0;
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height;
    } else {
      message.height = 0;
    }
    if (object.depth !== undefined && object.depth !== null) {
      message.depth = object.depth;
    } else {
      message.depth = 0;
    }
    if (object.framerate !== undefined && object.framerate !== null) {
      message.framerate = object.framerate;
    } else {
      message.framerate = 0;
    }
    if (object.audioBitrate !== undefined && object.audioBitrate !== null) {
      message.audioBitrate = object.audioBitrate;
    } else {
      message.audioBitrate = 0;
    }
    if (object.audioFrequency !== undefined && object.audioFrequency !== null) {
      message.audioFrequency = object.audioFrequency;
    } else {
      message.audioFrequency = 0;
    }
    if (object.videoBitrate !== undefined && object.videoBitrate !== null) {
      message.videoBitrate = object.videoBitrate;
    } else {
      message.videoBitrate = 0;
    }
    if (object.profile !== undefined && object.profile !== null) {
      message.profile = object.profile;
    } else {
      message.profile = "";
    }
    return message;
  },
};

const baseStartRecordingResponse: object = { recordingId: "" };

export const StartRecordingResponse = {
  encode(
    message: StartRecordingResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.recordingId !== "") {
      writer.uint32(10).string(message.recordingId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): StartRecordingResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStartRecordingResponse } as StartRecordingResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.recordingId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StartRecordingResponse {
    const message = { ...baseStartRecordingResponse } as StartRecordingResponse;
    if (object.recordingId !== undefined && object.recordingId !== null) {
      message.recordingId = String(object.recordingId);
    } else {
      message.recordingId = "";
    }
    return message;
  },

  toJSON(message: StartRecordingResponse): unknown {
    const obj: any = {};
    message.recordingId !== undefined &&
      (obj.recordingId = message.recordingId);
    return obj;
  },

  fromPartial(
    object: DeepPartial<StartRecordingResponse>
  ): StartRecordingResponse {
    const message = { ...baseStartRecordingResponse } as StartRecordingResponse;
    if (object.recordingId !== undefined && object.recordingId !== null) {
      message.recordingId = object.recordingId;
    } else {
      message.recordingId = "";
    }
    return message;
  },
};

const baseAddOutputRequest: object = { recordingId: "", rtmpUrl: "" };

export const AddOutputRequest = {
  encode(
    message: AddOutputRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.recordingId !== "") {
      writer.uint32(10).string(message.recordingId);
    }
    if (message.rtmpUrl !== "") {
      writer.uint32(18).string(message.rtmpUrl);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddOutputRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAddOutputRequest } as AddOutputRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.recordingId = reader.string();
          break;
        case 2:
          message.rtmpUrl = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddOutputRequest {
    const message = { ...baseAddOutputRequest } as AddOutputRequest;
    if (object.recordingId !== undefined && object.recordingId !== null) {
      message.recordingId = String(object.recordingId);
    } else {
      message.recordingId = "";
    }
    if (object.rtmpUrl !== undefined && object.rtmpUrl !== null) {
      message.rtmpUrl = String(object.rtmpUrl);
    } else {
      message.rtmpUrl = "";
    }
    return message;
  },

  toJSON(message: AddOutputRequest): unknown {
    const obj: any = {};
    message.recordingId !== undefined &&
      (obj.recordingId = message.recordingId);
    message.rtmpUrl !== undefined && (obj.rtmpUrl = message.rtmpUrl);
    return obj;
  },

  fromPartial(object: DeepPartial<AddOutputRequest>): AddOutputRequest {
    const message = { ...baseAddOutputRequest } as AddOutputRequest;
    if (object.recordingId !== undefined && object.recordingId !== null) {
      message.recordingId = object.recordingId;
    } else {
      message.recordingId = "";
    }
    if (object.rtmpUrl !== undefined && object.rtmpUrl !== null) {
      message.rtmpUrl = object.rtmpUrl;
    } else {
      message.rtmpUrl = "";
    }
    return message;
  },
};

const baseRemoveOutputRequest: object = { recordingId: "", rtmpUrl: "" };

export const RemoveOutputRequest = {
  encode(
    message: RemoveOutputRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.recordingId !== "") {
      writer.uint32(10).string(message.recordingId);
    }
    if (message.rtmpUrl !== "") {
      writer.uint32(18).string(message.rtmpUrl);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveOutputRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRemoveOutputRequest } as RemoveOutputRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.recordingId = reader.string();
          break;
        case 2:
          message.rtmpUrl = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemoveOutputRequest {
    const message = { ...baseRemoveOutputRequest } as RemoveOutputRequest;
    if (object.recordingId !== undefined && object.recordingId !== null) {
      message.recordingId = String(object.recordingId);
    } else {
      message.recordingId = "";
    }
    if (object.rtmpUrl !== undefined && object.rtmpUrl !== null) {
      message.rtmpUrl = String(object.rtmpUrl);
    } else {
      message.rtmpUrl = "";
    }
    return message;
  },

  toJSON(message: RemoveOutputRequest): unknown {
    const obj: any = {};
    message.recordingId !== undefined &&
      (obj.recordingId = message.recordingId);
    message.rtmpUrl !== undefined && (obj.rtmpUrl = message.rtmpUrl);
    return obj;
  },

  fromPartial(object: DeepPartial<RemoveOutputRequest>): RemoveOutputRequest {
    const message = { ...baseRemoveOutputRequest } as RemoveOutputRequest;
    if (object.recordingId !== undefined && object.recordingId !== null) {
      message.recordingId = object.recordingId;
    } else {
      message.recordingId = "";
    }
    if (object.rtmpUrl !== undefined && object.rtmpUrl !== null) {
      message.rtmpUrl = object.rtmpUrl;
    } else {
      message.rtmpUrl = "";
    }
    return message;
  },
};

const baseEndRecordingRequest: object = { recordingId: "" };

export const EndRecordingRequest = {
  encode(
    message: EndRecordingRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.recordingId !== "") {
      writer.uint32(10).string(message.recordingId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EndRecordingRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEndRecordingRequest } as EndRecordingRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.recordingId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EndRecordingRequest {
    const message = { ...baseEndRecordingRequest } as EndRecordingRequest;
    if (object.recordingId !== undefined && object.recordingId !== null) {
      message.recordingId = String(object.recordingId);
    } else {
      message.recordingId = "";
    }
    return message;
  },

  toJSON(message: EndRecordingRequest): unknown {
    const obj: any = {};
    message.recordingId !== undefined &&
      (obj.recordingId = message.recordingId);
    return obj;
  },

  fromPartial(object: DeepPartial<EndRecordingRequest>): EndRecordingRequest {
    const message = { ...baseEndRecordingRequest } as EndRecordingRequest;
    if (object.recordingId !== undefined && object.recordingId !== null) {
      message.recordingId = object.recordingId;
    } else {
      message.recordingId = "";
    }
    return message;
  },
};

const baseRecordingInfo: object = {
  id: "",
  roomName: "",
  active: false,
  error: "",
};

export const RecordingInfo = {
  encode(
    message: RecordingInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.roomName !== "") {
      writer.uint32(18).string(message.roomName);
    }
    if (message.active === true) {
      writer.uint32(24).bool(message.active);
    }
    if (message.error !== "") {
      writer.uint32(34).string(message.error);
    }
    if (message.file !== undefined) {
      FileResult.encode(message.file, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.rtmp) {
      RtmpResult.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RecordingInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRecordingInfo } as RecordingInfo;
    message.rtmp = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.roomName = reader.string();
          break;
        case 3:
          message.active = reader.bool();
          break;
        case 4:
          message.error = reader.string();
          break;
        case 5:
          message.file = FileResult.decode(reader, reader.uint32());
          break;
        case 6:
          message.rtmp.push(RtmpResult.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RecordingInfo {
    const message = { ...baseRecordingInfo } as RecordingInfo;
    message.rtmp = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = "";
    }
    if (object.roomName !== undefined && object.roomName !== null) {
      message.roomName = String(object.roomName);
    } else {
      message.roomName = "";
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = Boolean(object.active);
    } else {
      message.active = false;
    }
    if (object.error !== undefined && object.error !== null) {
      message.error = String(object.error);
    } else {
      message.error = "";
    }
    if (object.file !== undefined && object.file !== null) {
      message.file = FileResult.fromJSON(object.file);
    } else {
      message.file = undefined;
    }
    if (object.rtmp !== undefined && object.rtmp !== null) {
      for (const e of object.rtmp) {
        message.rtmp.push(RtmpResult.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: RecordingInfo): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.active !== undefined && (obj.active = message.active);
    message.error !== undefined && (obj.error = message.error);
    message.file !== undefined &&
      (obj.file = message.file ? FileResult.toJSON(message.file) : undefined);
    if (message.rtmp) {
      obj.rtmp = message.rtmp.map((e) =>
        e ? RtmpResult.toJSON(e) : undefined
      );
    } else {
      obj.rtmp = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<RecordingInfo>): RecordingInfo {
    const message = { ...baseRecordingInfo } as RecordingInfo;
    message.rtmp = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = "";
    }
    if (object.roomName !== undefined && object.roomName !== null) {
      message.roomName = object.roomName;
    } else {
      message.roomName = "";
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = object.active;
    } else {
      message.active = false;
    }
    if (object.error !== undefined && object.error !== null) {
      message.error = object.error;
    } else {
      message.error = "";
    }
    if (object.file !== undefined && object.file !== null) {
      message.file = FileResult.fromPartial(object.file);
    } else {
      message.file = undefined;
    }
    if (object.rtmp !== undefined && object.rtmp !== null) {
      for (const e of object.rtmp) {
        message.rtmp.push(RtmpResult.fromPartial(e));
      }
    }
    return message;
  },
};

const baseFileResult: object = { downloadUrl: "", duration: 0 };

export const FileResult = {
  encode(
    message: FileResult,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.downloadUrl !== "") {
      writer.uint32(10).string(message.downloadUrl);
    }
    if (message.duration !== 0) {
      writer.uint32(16).int64(message.duration);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FileResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseFileResult } as FileResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.downloadUrl = reader.string();
          break;
        case 2:
          message.duration = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FileResult {
    const message = { ...baseFileResult } as FileResult;
    if (object.downloadUrl !== undefined && object.downloadUrl !== null) {
      message.downloadUrl = String(object.downloadUrl);
    } else {
      message.downloadUrl = "";
    }
    if (object.duration !== undefined && object.duration !== null) {
      message.duration = Number(object.duration);
    } else {
      message.duration = 0;
    }
    return message;
  },

  toJSON(message: FileResult): unknown {
    const obj: any = {};
    message.downloadUrl !== undefined &&
      (obj.downloadUrl = message.downloadUrl);
    message.duration !== undefined && (obj.duration = message.duration);
    return obj;
  },

  fromPartial(object: DeepPartial<FileResult>): FileResult {
    const message = { ...baseFileResult } as FileResult;
    if (object.downloadUrl !== undefined && object.downloadUrl !== null) {
      message.downloadUrl = object.downloadUrl;
    } else {
      message.downloadUrl = "";
    }
    if (object.duration !== undefined && object.duration !== null) {
      message.duration = object.duration;
    } else {
      message.duration = 0;
    }
    return message;
  },
};

const baseRtmpResult: object = { streamUrl: "", duration: 0 };

export const RtmpResult = {
  encode(
    message: RtmpResult,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.streamUrl !== "") {
      writer.uint32(10).string(message.streamUrl);
    }
    if (message.duration !== 0) {
      writer.uint32(16).int64(message.duration);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RtmpResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRtmpResult } as RtmpResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.streamUrl = reader.string();
          break;
        case 2:
          message.duration = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RtmpResult {
    const message = { ...baseRtmpResult } as RtmpResult;
    if (object.streamUrl !== undefined && object.streamUrl !== null) {
      message.streamUrl = String(object.streamUrl);
    } else {
      message.streamUrl = "";
    }
    if (object.duration !== undefined && object.duration !== null) {
      message.duration = Number(object.duration);
    } else {
      message.duration = 0;
    }
    return message;
  },

  toJSON(message: RtmpResult): unknown {
    const obj: any = {};
    message.streamUrl !== undefined && (obj.streamUrl = message.streamUrl);
    message.duration !== undefined && (obj.duration = message.duration);
    return obj;
  },

  fromPartial(object: DeepPartial<RtmpResult>): RtmpResult {
    const message = { ...baseRtmpResult } as RtmpResult;
    if (object.streamUrl !== undefined && object.streamUrl !== null) {
      message.streamUrl = object.streamUrl;
    } else {
      message.streamUrl = "";
    }
    if (object.duration !== undefined && object.duration !== null) {
      message.duration = object.duration;
    } else {
      message.duration = 0;
    }
    return message;
  },
};

/**
 * Recording service that can be performed on any node
 * they are Twirp-based HTTP req/responses
 */
export interface RecordingService {
  /** Starts a room */
  StartRecording(
    request: StartRecordingRequest
  ): Promise<StartRecordingResponse>;
  /** Adds an rtmp output to a live recording */
  AddOutput(request: AddOutputRequest): Promise<Empty>;
  /** Removes an rtmp output from a live recording */
  RemoveOutput(request: RemoveOutputRequest): Promise<Empty>;
  /** Ends a recording */
  EndRecording(request: EndRecordingRequest): Promise<Empty>;
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
