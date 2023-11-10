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
  event?: string | undefined;
  room?:
    | Room
    | undefined;
  /** set when event is participant_* or track_* */
  participant?:
    | ParticipantInfo
    | undefined;
  /** set when event is egress_* */
  egressInfo?:
    | EgressInfo
    | undefined;
  /** set when event is ingress_* */
  ingressInfo?:
    | IngressInfo
    | undefined;
  /** set when event is track_* */
  track?:
    | TrackInfo
    | undefined;
  /** unique event uuid */
  id?:
    | string
    | undefined;
  /** timestamp in seconds */
  createdAt?: number | undefined;
  numDropped?: number | undefined;
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWebhookEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.event = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.room = Room.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.participant = ParticipantInfo.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.egressInfo = EgressInfo.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.ingressInfo = IngressInfo.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.track = TrackInfo.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.id = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.createdAt = longToNumber(reader.int64() as Long);
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.numDropped = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WebhookEvent {
    return {
      event: isSet(object.event) ? globalThis.String(object.event) : "",
      room: isSet(object.room) ? Room.fromJSON(object.room) : undefined,
      participant: isSet(object.participant) ? ParticipantInfo.fromJSON(object.participant) : undefined,
      egressInfo: isSet(object.egressInfo) ? EgressInfo.fromJSON(object.egressInfo) : undefined,
      ingressInfo: isSet(object.ingressInfo) ? IngressInfo.fromJSON(object.ingressInfo) : undefined,
      track: isSet(object.track) ? TrackInfo.fromJSON(object.track) : undefined,
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      createdAt: isSet(object.createdAt) ? globalThis.Number(object.createdAt) : 0,
      numDropped: isSet(object.numDropped) ? globalThis.Number(object.numDropped) : 0,
    };
  },

  toJSON(message: WebhookEvent): unknown {
    const obj: any = {};
    if (message.event !== undefined && message.event !== "") {
      obj.event = message.event;
    }
    if (message.room !== undefined) {
      obj.room = Room.toJSON(message.room);
    }
    if (message.participant !== undefined) {
      obj.participant = ParticipantInfo.toJSON(message.participant);
    }
    if (message.egressInfo !== undefined) {
      obj.egressInfo = EgressInfo.toJSON(message.egressInfo);
    }
    if (message.ingressInfo !== undefined) {
      obj.ingressInfo = IngressInfo.toJSON(message.ingressInfo);
    }
    if (message.track !== undefined) {
      obj.track = TrackInfo.toJSON(message.track);
    }
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.createdAt !== undefined && message.createdAt !== 0) {
      obj.createdAt = Math.round(message.createdAt);
    }
    if (message.numDropped !== undefined && message.numDropped !== 0) {
      obj.numDropped = Math.round(message.numDropped);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<WebhookEvent>, I>>(base?: I): WebhookEvent {
    return WebhookEvent.fromPartial(base ?? ({} as any));
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
