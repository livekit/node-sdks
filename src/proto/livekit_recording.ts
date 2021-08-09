/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  RecordingOptions,
  RecordingTemplate,
  RecordingS3Output,
} from "./livekit_models";

export const protobufPackage = "livekit";

export interface StartRecordingRequest {
  url: string | undefined;
  template?: RecordingTemplate | undefined;
  file: string | undefined;
  s3?: RecordingS3Output | undefined;
  rtmp: string | undefined;
  options?: RecordingOptions;
}

export interface EndRecordingRequest {
  recordingId: string;
}

export interface RecordingResponse {
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
    if (message.file !== undefined) {
      writer.uint32(26).string(message.file);
    }
    if (message.s3 !== undefined) {
      RecordingS3Output.encode(message.s3, writer.uint32(34).fork()).ldelim();
    }
    if (message.rtmp !== undefined) {
      writer.uint32(42).string(message.rtmp);
    }
    if (message.options !== undefined) {
      RecordingOptions.encode(
        message.options,
        writer.uint32(50).fork()
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
          message.file = reader.string();
          break;
        case 4:
          message.s3 = RecordingS3Output.decode(reader, reader.uint32());
          break;
        case 5:
          message.rtmp = reader.string();
          break;
        case 6:
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
    if (object.file !== undefined && object.file !== null) {
      message.file = String(object.file);
    } else {
      message.file = undefined;
    }
    if (object.s3 !== undefined && object.s3 !== null) {
      message.s3 = RecordingS3Output.fromJSON(object.s3);
    } else {
      message.s3 = undefined;
    }
    if (object.rtmp !== undefined && object.rtmp !== null) {
      message.rtmp = String(object.rtmp);
    } else {
      message.rtmp = undefined;
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
    message.file !== undefined && (obj.file = message.file);
    message.s3 !== undefined &&
      (obj.s3 = message.s3 ? RecordingS3Output.toJSON(message.s3) : undefined);
    message.rtmp !== undefined && (obj.rtmp = message.rtmp);
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
    if (object.file !== undefined && object.file !== null) {
      message.file = object.file;
    } else {
      message.file = undefined;
    }
    if (object.s3 !== undefined && object.s3 !== null) {
      message.s3 = RecordingS3Output.fromPartial(object.s3);
    } else {
      message.s3 = undefined;
    }
    if (object.rtmp !== undefined && object.rtmp !== null) {
      message.rtmp = object.rtmp;
    } else {
      message.rtmp = undefined;
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
