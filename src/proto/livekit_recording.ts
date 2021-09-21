/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "livekit";

export enum RecordingPreset {
  NONE = 0,
  /** HD_30 - 720p, 30fps */
  HD_30 = 1,
  /** HD_60 - 720p, 60fps */
  HD_60 = 2,
  /** FULL_HD_30 - 1080p, 30fps */
  FULL_HD_30 = 3,
  /** FULL_HD_60 - 1080p, 60fps */
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
  input?: RecordingInput;
  output?: RecordingOutput;
  options?: RecordingOptions;
}

export interface EndRecordingRequest {
  recordingId: string;
}

export interface RecordingResponse {
  recordingId: string;
}

export interface RecordingInput {
  url: string;
  template?: RecordingTemplate;
}

export interface RecordingTemplate {
  layout: string;
  /** either token or room name required */
  token: string;
  roomName: string;
}

export interface RecordingOutput {
  rtmp: string;
  /** bucket/key */
  s3Path: string;
}

export interface RecordingOptions {
  preset: RecordingPreset;
  inputWidth: number;
  inputHeight: number;
  outputWidth: number;
  outputHeight: number;
  depth: number;
  framerate: number;
  audioBitrate: number;
  audioFrequency: number;
  videoBitrate: number;
}

const baseStartRecordingRequest: object = {};

export const StartRecordingRequest = {
  encode(
    message: StartRecordingRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.input !== undefined) {
      RecordingInput.encode(message.input, writer.uint32(10).fork()).ldelim();
    }
    if (message.output !== undefined) {
      RecordingOutput.encode(message.output, writer.uint32(18).fork()).ldelim();
    }
    if (message.options !== undefined) {
      RecordingOptions.encode(
        message.options,
        writer.uint32(26).fork()
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
          message.input = RecordingInput.decode(reader, reader.uint32());
          break;
        case 2:
          message.output = RecordingOutput.decode(reader, reader.uint32());
          break;
        case 3:
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
    if (object.input !== undefined && object.input !== null) {
      message.input = RecordingInput.fromJSON(object.input);
    } else {
      message.input = undefined;
    }
    if (object.output !== undefined && object.output !== null) {
      message.output = RecordingOutput.fromJSON(object.output);
    } else {
      message.output = undefined;
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
    message.input !== undefined &&
      (obj.input = message.input
        ? RecordingInput.toJSON(message.input)
        : undefined);
    message.output !== undefined &&
      (obj.output = message.output
        ? RecordingOutput.toJSON(message.output)
        : undefined);
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
    if (object.input !== undefined && object.input !== null) {
      message.input = RecordingInput.fromPartial(object.input);
    } else {
      message.input = undefined;
    }
    if (object.output !== undefined && object.output !== null) {
      message.output = RecordingOutput.fromPartial(object.output);
    } else {
      message.output = undefined;
    }
    if (object.options !== undefined && object.options !== null) {
      message.options = RecordingOptions.fromPartial(object.options);
    } else {
      message.options = undefined;
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

const baseRecordingResponse: object = { recordingId: "" };

export const RecordingResponse = {
  encode(
    message: RecordingResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.recordingId !== "") {
      writer.uint32(10).string(message.recordingId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RecordingResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRecordingResponse } as RecordingResponse;
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

  fromJSON(object: any): RecordingResponse {
    const message = { ...baseRecordingResponse } as RecordingResponse;
    if (object.recordingId !== undefined && object.recordingId !== null) {
      message.recordingId = String(object.recordingId);
    } else {
      message.recordingId = "";
    }
    return message;
  },

  toJSON(message: RecordingResponse): unknown {
    const obj: any = {};
    message.recordingId !== undefined &&
      (obj.recordingId = message.recordingId);
    return obj;
  },

  fromPartial(object: DeepPartial<RecordingResponse>): RecordingResponse {
    const message = { ...baseRecordingResponse } as RecordingResponse;
    if (object.recordingId !== undefined && object.recordingId !== null) {
      message.recordingId = object.recordingId;
    } else {
      message.recordingId = "";
    }
    return message;
  },
};

const baseRecordingInput: object = { url: "" };

export const RecordingInput = {
  encode(
    message: RecordingInput,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    if (message.template !== undefined) {
      RecordingTemplate.encode(
        message.template,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RecordingInput {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRecordingInput } as RecordingInput;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.url = reader.string();
          break;
        case 2:
          message.template = RecordingTemplate.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RecordingInput {
    const message = { ...baseRecordingInput } as RecordingInput;
    if (object.url !== undefined && object.url !== null) {
      message.url = String(object.url);
    } else {
      message.url = "";
    }
    if (object.template !== undefined && object.template !== null) {
      message.template = RecordingTemplate.fromJSON(object.template);
    } else {
      message.template = undefined;
    }
    return message;
  },

  toJSON(message: RecordingInput): unknown {
    const obj: any = {};
    message.url !== undefined && (obj.url = message.url);
    message.template !== undefined &&
      (obj.template = message.template
        ? RecordingTemplate.toJSON(message.template)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<RecordingInput>): RecordingInput {
    const message = { ...baseRecordingInput } as RecordingInput;
    if (object.url !== undefined && object.url !== null) {
      message.url = object.url;
    } else {
      message.url = "";
    }
    if (object.template !== undefined && object.template !== null) {
      message.template = RecordingTemplate.fromPartial(object.template);
    } else {
      message.template = undefined;
    }
    return message;
  },
};

const baseRecordingTemplate: object = { layout: "", token: "", roomName: "" };

export const RecordingTemplate = {
  encode(
    message: RecordingTemplate,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.layout !== "") {
      writer.uint32(10).string(message.layout);
    }
    if (message.token !== "") {
      writer.uint32(26).string(message.token);
    }
    if (message.roomName !== "") {
      writer.uint32(34).string(message.roomName);
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
        case 3:
          message.token = reader.string();
          break;
        case 4:
          message.roomName = reader.string();
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
    if (object.token !== undefined && object.token !== null) {
      message.token = String(object.token);
    } else {
      message.token = "";
    }
    if (object.roomName !== undefined && object.roomName !== null) {
      message.roomName = String(object.roomName);
    } else {
      message.roomName = "";
    }
    return message;
  },

  toJSON(message: RecordingTemplate): unknown {
    const obj: any = {};
    message.layout !== undefined && (obj.layout = message.layout);
    message.token !== undefined && (obj.token = message.token);
    message.roomName !== undefined && (obj.roomName = message.roomName);
    return obj;
  },

  fromPartial(object: DeepPartial<RecordingTemplate>): RecordingTemplate {
    const message = { ...baseRecordingTemplate } as RecordingTemplate;
    if (object.layout !== undefined && object.layout !== null) {
      message.layout = object.layout;
    } else {
      message.layout = "";
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = object.token;
    } else {
      message.token = "";
    }
    if (object.roomName !== undefined && object.roomName !== null) {
      message.roomName = object.roomName;
    } else {
      message.roomName = "";
    }
    return message;
  },
};

const baseRecordingOutput: object = { rtmp: "", s3Path: "" };

export const RecordingOutput = {
  encode(
    message: RecordingOutput,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.rtmp !== "") {
      writer.uint32(26).string(message.rtmp);
    }
    if (message.s3Path !== "") {
      writer.uint32(34).string(message.s3Path);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RecordingOutput {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRecordingOutput } as RecordingOutput;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          message.rtmp = reader.string();
          break;
        case 4:
          message.s3Path = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RecordingOutput {
    const message = { ...baseRecordingOutput } as RecordingOutput;
    if (object.rtmp !== undefined && object.rtmp !== null) {
      message.rtmp = String(object.rtmp);
    } else {
      message.rtmp = "";
    }
    if (object.s3Path !== undefined && object.s3Path !== null) {
      message.s3Path = String(object.s3Path);
    } else {
      message.s3Path = "";
    }
    return message;
  },

  toJSON(message: RecordingOutput): unknown {
    const obj: any = {};
    message.rtmp !== undefined && (obj.rtmp = message.rtmp);
    message.s3Path !== undefined && (obj.s3Path = message.s3Path);
    return obj;
  },

  fromPartial(object: DeepPartial<RecordingOutput>): RecordingOutput {
    const message = { ...baseRecordingOutput } as RecordingOutput;
    if (object.rtmp !== undefined && object.rtmp !== null) {
      message.rtmp = object.rtmp;
    } else {
      message.rtmp = "";
    }
    if (object.s3Path !== undefined && object.s3Path !== null) {
      message.s3Path = object.s3Path;
    } else {
      message.s3Path = "";
    }
    return message;
  },
};

const baseRecordingOptions: object = {
  preset: 0,
  inputWidth: 0,
  inputHeight: 0,
  outputWidth: 0,
  outputHeight: 0,
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
    if (message.inputWidth !== 0) {
      writer.uint32(16).int32(message.inputWidth);
    }
    if (message.inputHeight !== 0) {
      writer.uint32(24).int32(message.inputHeight);
    }
    if (message.outputWidth !== 0) {
      writer.uint32(32).int32(message.outputWidth);
    }
    if (message.outputHeight !== 0) {
      writer.uint32(40).int32(message.outputHeight);
    }
    if (message.depth !== 0) {
      writer.uint32(48).int32(message.depth);
    }
    if (message.framerate !== 0) {
      writer.uint32(56).int32(message.framerate);
    }
    if (message.audioBitrate !== 0) {
      writer.uint32(64).int32(message.audioBitrate);
    }
    if (message.audioFrequency !== 0) {
      writer.uint32(72).int32(message.audioFrequency);
    }
    if (message.videoBitrate !== 0) {
      writer.uint32(80).int32(message.videoBitrate);
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
          message.inputWidth = reader.int32();
          break;
        case 3:
          message.inputHeight = reader.int32();
          break;
        case 4:
          message.outputWidth = reader.int32();
          break;
        case 5:
          message.outputHeight = reader.int32();
          break;
        case 6:
          message.depth = reader.int32();
          break;
        case 7:
          message.framerate = reader.int32();
          break;
        case 8:
          message.audioBitrate = reader.int32();
          break;
        case 9:
          message.audioFrequency = reader.int32();
          break;
        case 10:
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
    if (object.inputWidth !== undefined && object.inputWidth !== null) {
      message.inputWidth = Number(object.inputWidth);
    } else {
      message.inputWidth = 0;
    }
    if (object.inputHeight !== undefined && object.inputHeight !== null) {
      message.inputHeight = Number(object.inputHeight);
    } else {
      message.inputHeight = 0;
    }
    if (object.outputWidth !== undefined && object.outputWidth !== null) {
      message.outputWidth = Number(object.outputWidth);
    } else {
      message.outputWidth = 0;
    }
    if (object.outputHeight !== undefined && object.outputHeight !== null) {
      message.outputHeight = Number(object.outputHeight);
    } else {
      message.outputHeight = 0;
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
    message.inputWidth !== undefined && (obj.inputWidth = message.inputWidth);
    message.inputHeight !== undefined &&
      (obj.inputHeight = message.inputHeight);
    message.outputWidth !== undefined &&
      (obj.outputWidth = message.outputWidth);
    message.outputHeight !== undefined &&
      (obj.outputHeight = message.outputHeight);
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
    if (object.inputWidth !== undefined && object.inputWidth !== null) {
      message.inputWidth = object.inputWidth;
    } else {
      message.inputWidth = 0;
    }
    if (object.inputHeight !== undefined && object.inputHeight !== null) {
      message.inputHeight = object.inputHeight;
    } else {
      message.inputHeight = 0;
    }
    if (object.outputWidth !== undefined && object.outputWidth !== null) {
      message.outputWidth = object.outputWidth;
    } else {
      message.outputWidth = 0;
    }
    if (object.outputHeight !== undefined && object.outputHeight !== null) {
      message.outputHeight = object.outputHeight;
    } else {
      message.outputHeight = 0;
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

/**
 * Recording service that can be performed on any node
 * they are Twirp-based HTTP req/responses
 */
export interface RecordingService {
  /** Starts a room */
  StartRecording(request: StartRecordingRequest): Promise<RecordingResponse>;
  /** Ends a recording */
  EndRecording(request: EndRecordingRequest): Promise<RecordingResponse>;
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
