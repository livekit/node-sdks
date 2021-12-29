/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Room, ParticipantInfo } from "./livekit_models";
import { RecordingInfo } from "./livekit_recording";

export const protobufPackage = "livekit";

export interface WebhookEvent {
  /** one of room_started, room_finished, participant_joined, participant_left, recording_started, recording_finished */
  event: string;
  room?: Room;
  /** set when event is participant_* */
  participant?: ParticipantInfo;
  /** set when event is recording_* */
  recordingInfo?: RecordingInfo;
  /** unique event uuid */
  id: string;
  /** timestamp in seconds */
  createdAt: number;
}

const baseWebhookEvent: object = { event: "", id: "", createdAt: 0 };

export const WebhookEvent = {
  encode(
    message: WebhookEvent,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.event !== "") {
      writer.uint32(10).string(message.event);
    }
    if (message.room !== undefined) {
      Room.encode(message.room, writer.uint32(18).fork()).ldelim();
    }
    if (message.participant !== undefined) {
      ParticipantInfo.encode(
        message.participant,
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.recordingInfo !== undefined) {
      RecordingInfo.encode(
        message.recordingInfo,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.id !== "") {
      writer.uint32(50).string(message.id);
    }
    if (message.createdAt !== 0) {
      writer.uint32(56).int64(message.createdAt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WebhookEvent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWebhookEvent } as WebhookEvent;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.event = reader.string();
          break;
        case 2:
          message.room = Room.decode(reader, reader.uint32());
          break;
        case 3:
          message.participant = ParticipantInfo.decode(reader, reader.uint32());
          break;
        case 5:
          message.recordingInfo = RecordingInfo.decode(reader, reader.uint32());
          break;
        case 6:
          message.id = reader.string();
          break;
        case 7:
          message.createdAt = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WebhookEvent {
    const message = { ...baseWebhookEvent } as WebhookEvent;
    if (object.event !== undefined && object.event !== null) {
      message.event = String(object.event);
    } else {
      message.event = "";
    }
    if (object.room !== undefined && object.room !== null) {
      message.room = Room.fromJSON(object.room);
    } else {
      message.room = undefined;
    }
    if (object.participant !== undefined && object.participant !== null) {
      message.participant = ParticipantInfo.fromJSON(object.participant);
    } else {
      message.participant = undefined;
    }
    if (object.recordingInfo !== undefined && object.recordingInfo !== null) {
      message.recordingInfo = RecordingInfo.fromJSON(object.recordingInfo);
    } else {
      message.recordingInfo = undefined;
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = "";
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = Number(object.createdAt);
    } else {
      message.createdAt = 0;
    }
    return message;
  },

  toJSON(message: WebhookEvent): unknown {
    const obj: any = {};
    message.event !== undefined && (obj.event = message.event);
    message.room !== undefined &&
      (obj.room = message.room ? Room.toJSON(message.room) : undefined);
    message.participant !== undefined &&
      (obj.participant = message.participant
        ? ParticipantInfo.toJSON(message.participant)
        : undefined);
    message.recordingInfo !== undefined &&
      (obj.recordingInfo = message.recordingInfo
        ? RecordingInfo.toJSON(message.recordingInfo)
        : undefined);
    message.id !== undefined && (obj.id = message.id);
    message.createdAt !== undefined && (obj.createdAt = message.createdAt);
    return obj;
  },

  fromPartial(object: DeepPartial<WebhookEvent>): WebhookEvent {
    const message = { ...baseWebhookEvent } as WebhookEvent;
    if (object.event !== undefined && object.event !== null) {
      message.event = object.event;
    } else {
      message.event = "";
    }
    if (object.room !== undefined && object.room !== null) {
      message.room = Room.fromPartial(object.room);
    } else {
      message.room = undefined;
    }
    if (object.participant !== undefined && object.participant !== null) {
      message.participant = ParticipantInfo.fromPartial(object.participant);
    } else {
      message.participant = undefined;
    }
    if (object.recordingInfo !== undefined && object.recordingInfo !== null) {
      message.recordingInfo = RecordingInfo.fromPartial(object.recordingInfo);
    } else {
      message.recordingInfo = undefined;
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = "";
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = object.createdAt;
    } else {
      message.createdAt = 0;
    }
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
