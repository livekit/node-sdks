/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Room, ParticipantInfo, RecordingResult } from "./livekit_models";

export const protobufPackage = "livekit";

export interface WebhookEvent {
  /** one of room_started, room_finished, participant_joined, participant_left, recording_finished */
  event: string;
  room?: Room;
  /** set when event is participant_* */
  participant?: ParticipantInfo;
  /** set when event is recording_finished */
  recordingResult?: RecordingResult;
}

const baseWebhookEvent: object = { event: "" };

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
    if (message.recordingResult !== undefined) {
      RecordingResult.encode(
        message.recordingResult,
        writer.uint32(34).fork()
      ).ldelim();
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
        case 4:
          message.recordingResult = RecordingResult.decode(
            reader,
            reader.uint32()
          );
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
    if (
      object.recordingResult !== undefined &&
      object.recordingResult !== null
    ) {
      message.recordingResult = RecordingResult.fromJSON(
        object.recordingResult
      );
    } else {
      message.recordingResult = undefined;
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
    message.recordingResult !== undefined &&
      (obj.recordingResult = message.recordingResult
        ? RecordingResult.toJSON(message.recordingResult)
        : undefined);
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
    if (
      object.recordingResult !== undefined &&
      object.recordingResult !== null
    ) {
      message.recordingResult = RecordingResult.fromPartial(
        object.recordingResult
      );
    } else {
      message.recordingResult = undefined;
    }
    return message;
  },
};

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
