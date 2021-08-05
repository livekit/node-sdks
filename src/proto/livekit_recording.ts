/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import { RecordingInput, RecordingOutput } from './livekit_models';

export const protobufPackage = 'livekit';

export interface StartRecordingRequest {
  input?: RecordingInput;
  output?: RecordingOutput;
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
    if (message.input !== undefined) {
      RecordingInput.encode(message.input, writer.uint32(10).fork()).ldelim();
    }
    if (message.output !== undefined) {
      RecordingOutput.encode(message.output, writer.uint32(18).fork()).ldelim();
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
    return message;
  },
};

const baseEndRecordingRequest: object = { recordingId: '' };

export const EndRecordingRequest = {
  encode(
    message: EndRecordingRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.recordingId !== '') {
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
      message.recordingId = '';
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
      message.recordingId = '';
    }
    return message;
  },
};

const baseRecordingResponse: object = { recordingId: '' };

export const RecordingResponse = {
  encode(
    message: RecordingResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.recordingId !== '') {
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
      message.recordingId = '';
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
      message.recordingId = '';
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
