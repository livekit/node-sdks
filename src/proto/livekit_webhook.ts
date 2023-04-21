/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { EgressInfo } from "./livekit_egress";
import { IngressInfo } from "./livekit_ingress";
import { ParticipantInfo, Room, TrackInfo } from "./livekit_models";

export const protobufPackage = "livekit";

export interface WebhookEvent {
  /**
   * one of room_started, room_finished, participant_joined, participant_left,
   * track_published, track_unpublished, egress_started, egress_updated, egress_ended,
   * ingress_started, ingress_ended
   */
  event?: string;
  room?: Room;
  /** set when event is participant_* or track_* */
  participant?: ParticipantInfo;
  /** set when event is egress_* */
  egressInfo?: EgressInfo;
  /** set when event is ingress_* */
  ingressInfo?: IngressInfo;
  /** set when event is track_* */
  track?: TrackInfo;
  /** unique event uuid */
  id?: string;
  /** timestamp in seconds */
  createdAt?: number;
  numDropped?: number;
}

function createBaseWebhookEvent(): WebhookEvent {
  return {
    event: "",
    room: undefined,
    participant: undefined,
    egressInfo: undefined,
    ingressInfo: undefined,
    track: undefined,
    id: "",
    createdAt: 0,
    numDropped: 0,
  };
}

export const WebhookEvent = {
  encode(message: WebhookEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.event !== undefined && message.event !== "") {
      writer.uint32(10).string(message.event);
    }
    if (message.room !== undefined) {
      Room.encode(message.room, writer.uint32(18).fork()).ldelim();
    }
    if (message.participant !== undefined) {
      ParticipantInfo.encode(message.participant, writer.uint32(26).fork()).ldelim();
    }
    if (message.egressInfo !== undefined) {
      EgressInfo.encode(message.egressInfo, writer.uint32(74).fork()).ldelim();
    }
    if (message.ingressInfo !== undefined) {
      IngressInfo.encode(message.ingressInfo, writer.uint32(82).fork()).ldelim();
    }
    if (message.track !== undefined) {
      TrackInfo.encode(message.track, writer.uint32(66).fork()).ldelim();
    }
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(50).string(message.id);
    }
    if (message.createdAt !== undefined && message.createdAt !== 0) {
      writer.uint32(56).int64(message.createdAt);
    }
    if (message.numDropped !== undefined && message.numDropped !== 0) {
      writer.uint32(88).int32(message.numDropped);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WebhookEvent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWebhookEvent();
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
        case 9:
          message.egressInfo = EgressInfo.decode(reader, reader.uint32());
          break;
        case 10:
          message.ingressInfo = IngressInfo.decode(reader, reader.uint32());
          break;
        case 8:
          message.track = TrackInfo.decode(reader, reader.uint32());
          break;
        case 6:
          message.id = reader.string();
          break;
        case 7:
          message.createdAt = longToNumber(reader.int64() as Long);
          break;
        case 11:
          message.numDropped = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WebhookEvent {
    return {
      event: isSet(object.event) ? String(object.event) : "",
      room: isSet(object.room) ? Room.fromJSON(object.room) : undefined,
      participant: isSet(object.participant) ? ParticipantInfo.fromJSON(object.participant) : undefined,
      egressInfo: isSet(object.egressInfo) ? EgressInfo.fromJSON(object.egressInfo) : undefined,
      ingressInfo: isSet(object.ingressInfo) ? IngressInfo.fromJSON(object.ingressInfo) : undefined,
      track: isSet(object.track) ? TrackInfo.fromJSON(object.track) : undefined,
      id: isSet(object.id) ? String(object.id) : "",
      createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
      numDropped: isSet(object.numDropped) ? Number(object.numDropped) : 0,
    };
  },

  toJSON(message: WebhookEvent): unknown {
    const obj: any = {};
    message.event !== undefined && (obj.event = message.event);
    message.room !== undefined && (obj.room = message.room ? Room.toJSON(message.room) : undefined);
    message.participant !== undefined &&
      (obj.participant = message.participant ? ParticipantInfo.toJSON(message.participant) : undefined);
    message.egressInfo !== undefined &&
      (obj.egressInfo = message.egressInfo ? EgressInfo.toJSON(message.egressInfo) : undefined);
    message.ingressInfo !== undefined &&
      (obj.ingressInfo = message.ingressInfo ? IngressInfo.toJSON(message.ingressInfo) : undefined);
    message.track !== undefined && (obj.track = message.track ? TrackInfo.toJSON(message.track) : undefined);
    message.id !== undefined && (obj.id = message.id);
    message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
    message.numDropped !== undefined && (obj.numDropped = Math.round(message.numDropped));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<WebhookEvent>, I>>(object: I): WebhookEvent {
    const message = createBaseWebhookEvent();
    message.event = object.event ?? "";
    message.room = (object.room !== undefined && object.room !== null) ? Room.fromPartial(object.room) : undefined;
    message.participant = (object.participant !== undefined && object.participant !== null)
      ? ParticipantInfo.fromPartial(object.participant)
      : undefined;
    message.egressInfo = (object.egressInfo !== undefined && object.egressInfo !== null)
      ? EgressInfo.fromPartial(object.egressInfo)
      : undefined;
    message.ingressInfo = (object.ingressInfo !== undefined && object.ingressInfo !== null)
      ? IngressInfo.fromPartial(object.ingressInfo)
      : undefined;
    message.track = (object.track !== undefined && object.track !== null)
      ? TrackInfo.fromPartial(object.track)
      : undefined;
    message.id = object.id ?? "";
    message.createdAt = object.createdAt ?? 0;
    message.numDropped = object.numDropped ?? 0;
    return message;
  },
};

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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
