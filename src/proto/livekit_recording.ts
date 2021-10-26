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
  roomName: string | undefined;
  token: string | undefined;
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

const baseRecordingTemplate: object = { layout: "" };

export const RecordingTemplate = {
  encode(
    message: RecordingTemplate,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.layout !== "") {
      writer.uint32(10).string(message.layout);
    }
    if (message.roomName !== undefined) {
      writer.uint32(18).string(message.roomName);
    }
    if (message.token !== undefined) {
      writer.uint32(26).string(message.token);
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
          message.token = reader.string();
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
      message.roomName = undefined;
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = String(object.token);
    } else {
      message.token = undefined;
    }
    return message;
  },

  toJSON(message: RecordingTemplate): unknown {
    const obj: any = {};
    message.layout !== undefined && (obj.layout = message.layout);
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.token !== undefined && (obj.token = message.token);
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
      message.roomName = undefined;
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = object.token;
    } else {
      message.token = undefined;
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

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
