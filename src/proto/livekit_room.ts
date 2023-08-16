/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { AutoTrackEgress, RoomCompositeEgressRequest } from "./livekit_egress";
import {
  DataPacket_Kind,
  dataPacket_KindFromJSON,
  dataPacket_KindToJSON,
  ParticipantInfo,
  ParticipantPermission,
  ParticipantTracks,
  Room,
  TrackInfo,
} from "./livekit_models";

export const protobufPackage = "livekit";

export interface CreateRoomRequest {
  /** name of the room */
  name?: string;
  /** number of seconds to keep the room open if no one joins */
  emptyTimeout?: number;
  /** limit number of participants that can be in a room */
  maxParticipants?: number;
  /** override the node room is allocated to, for debugging */
  nodeId?: string;
  /** metadata of room */
  metadata?: string;
  /** egress */
  egress?: RoomEgress;
  /** minimum playout delay of subscriber */
  minPlayoutDelay?: number;
}

export interface RoomEgress {
  room?: RoomCompositeEgressRequest;
  tracks?: AutoTrackEgress;
}

export interface ListRoomsRequest {
  /** when set, will only return rooms with name match */
  names?: string[];
}

export interface ListRoomsResponse {
  rooms?: Room[];
}

export interface DeleteRoomRequest {
  /** name of the room */
  room?: string;
}

export interface DeleteRoomResponse {
}

export interface ListParticipantsRequest {
  /** name of the room */
  room?: string;
}

export interface ListParticipantsResponse {
  participants?: ParticipantInfo[];
}

export interface RoomParticipantIdentity {
  /** name of the room */
  room?: string;
  /** identity of the participant */
  identity?: string;
}

export interface RemoveParticipantResponse {
}

export interface MuteRoomTrackRequest {
  /** name of the room */
  room?: string;
  identity?: string;
  /** sid of the track to mute */
  trackSid?: string;
  /** set to true to mute, false to unmute */
  muted?: boolean;
}

export interface MuteRoomTrackResponse {
  track?: TrackInfo;
}

export interface UpdateParticipantRequest {
  room?: string;
  identity?: string;
  /** metadata to update. skipping updates if left empty */
  metadata?: string;
  /** set to update the participant's permissions */
  permission?: ParticipantPermission;
  /** display name to update */
  name?: string;
}

export interface UpdateSubscriptionsRequest {
  room?: string;
  identity?: string;
  /** list of sids of tracks */
  trackSids?: string[];
  /** set to true to subscribe, false to unsubscribe from tracks */
  subscribe?: boolean;
  /** list of participants and their tracks */
  participantTracks?: ParticipantTracks[];
}

/** empty for now */
export interface UpdateSubscriptionsResponse {
}

export interface SendDataRequest {
  room?: string;
  data?: Uint8Array;
  kind?: DataPacket_Kind;
  destinationSids?: string[];
  topic?: string | undefined;
}

/**  */
export interface SendDataResponse {
}

export interface UpdateRoomMetadataRequest {
  room?: string;
  /** metadata to update. skipping updates if left empty */
  metadata?: string;
}

function createBaseCreateRoomRequest(): CreateRoomRequest {
  return {
    name: "",
    emptyTimeout: 0,
    maxParticipants: 0,
    nodeId: "",
    metadata: "",
    egress: undefined,
    minPlayoutDelay: 0,
  };
}

export const CreateRoomRequest = {
  encode(message: CreateRoomRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== undefined && message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.emptyTimeout !== undefined && message.emptyTimeout !== 0) {
      writer.uint32(16).uint32(message.emptyTimeout);
    }
    if (message.maxParticipants !== undefined && message.maxParticipants !== 0) {
      writer.uint32(24).uint32(message.maxParticipants);
    }
    if (message.nodeId !== undefined && message.nodeId !== "") {
      writer.uint32(34).string(message.nodeId);
    }
    if (message.metadata !== undefined && message.metadata !== "") {
      writer.uint32(42).string(message.metadata);
    }
    if (message.egress !== undefined) {
      RoomEgress.encode(message.egress, writer.uint32(50).fork()).ldelim();
    }
    if (message.minPlayoutDelay !== undefined && message.minPlayoutDelay !== 0) {
      writer.uint32(56).uint32(message.minPlayoutDelay);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateRoomRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateRoomRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.emptyTimeout = reader.uint32();
          break;
        case 3:
          message.maxParticipants = reader.uint32();
          break;
        case 4:
          message.nodeId = reader.string();
          break;
        case 5:
          message.metadata = reader.string();
          break;
        case 6:
          message.egress = RoomEgress.decode(reader, reader.uint32());
          break;
        case 7:
          message.minPlayoutDelay = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateRoomRequest {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      emptyTimeout: isSet(object.emptyTimeout) ? Number(object.emptyTimeout) : 0,
      maxParticipants: isSet(object.maxParticipants) ? Number(object.maxParticipants) : 0,
      nodeId: isSet(object.nodeId) ? String(object.nodeId) : "",
      metadata: isSet(object.metadata) ? String(object.metadata) : "",
      egress: isSet(object.egress) ? RoomEgress.fromJSON(object.egress) : undefined,
      minPlayoutDelay: isSet(object.minPlayoutDelay) ? Number(object.minPlayoutDelay) : 0,
    };
  },

  toJSON(message: CreateRoomRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.emptyTimeout !== undefined && (obj.emptyTimeout = Math.round(message.emptyTimeout));
    message.maxParticipants !== undefined && (obj.maxParticipants = Math.round(message.maxParticipants));
    message.nodeId !== undefined && (obj.nodeId = message.nodeId);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.egress !== undefined && (obj.egress = message.egress ? RoomEgress.toJSON(message.egress) : undefined);
    message.minPlayoutDelay !== undefined && (obj.minPlayoutDelay = Math.round(message.minPlayoutDelay));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreateRoomRequest>, I>>(object: I): CreateRoomRequest {
    const message = createBaseCreateRoomRequest();
    message.name = object.name ?? "";
    message.emptyTimeout = object.emptyTimeout ?? 0;
    message.maxParticipants = object.maxParticipants ?? 0;
    message.nodeId = object.nodeId ?? "";
    message.metadata = object.metadata ?? "";
    message.egress = (object.egress !== undefined && object.egress !== null)
      ? RoomEgress.fromPartial(object.egress)
      : undefined;
    message.minPlayoutDelay = object.minPlayoutDelay ?? 0;
    return message;
  },
};

function createBaseRoomEgress(): RoomEgress {
  return { room: undefined, tracks: undefined };
}

export const RoomEgress = {
  encode(message: RoomEgress, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.room !== undefined) {
      RoomCompositeEgressRequest.encode(message.room, writer.uint32(10).fork()).ldelim();
    }
    if (message.tracks !== undefined) {
      AutoTrackEgress.encode(message.tracks, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RoomEgress {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRoomEgress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = RoomCompositeEgressRequest.decode(reader, reader.uint32());
          break;
        case 2:
          message.tracks = AutoTrackEgress.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RoomEgress {
    return {
      room: isSet(object.room) ? RoomCompositeEgressRequest.fromJSON(object.room) : undefined,
      tracks: isSet(object.tracks) ? AutoTrackEgress.fromJSON(object.tracks) : undefined,
    };
  },

  toJSON(message: RoomEgress): unknown {
    const obj: any = {};
    message.room !== undefined &&
      (obj.room = message.room ? RoomCompositeEgressRequest.toJSON(message.room) : undefined);
    message.tracks !== undefined && (obj.tracks = message.tracks ? AutoTrackEgress.toJSON(message.tracks) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RoomEgress>, I>>(object: I): RoomEgress {
    const message = createBaseRoomEgress();
    message.room = (object.room !== undefined && object.room !== null)
      ? RoomCompositeEgressRequest.fromPartial(object.room)
      : undefined;
    message.tracks = (object.tracks !== undefined && object.tracks !== null)
      ? AutoTrackEgress.fromPartial(object.tracks)
      : undefined;
    return message;
  },
};

function createBaseListRoomsRequest(): ListRoomsRequest {
  return { names: [] };
}

export const ListRoomsRequest = {
  encode(message: ListRoomsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.names !== undefined && message.names.length !== 0) {
      for (const v of message.names) {
        writer.uint32(10).string(v!);
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRoomsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListRoomsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.names!.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListRoomsRequest {
    return { names: Array.isArray(object?.names) ? object.names.map((e: any) => String(e)) : [] };
  },

  toJSON(message: ListRoomsRequest): unknown {
    const obj: any = {};
    if (message.names) {
      obj.names = message.names.map((e) => e);
    } else {
      obj.names = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListRoomsRequest>, I>>(object: I): ListRoomsRequest {
    const message = createBaseListRoomsRequest();
    message.names = object.names?.map((e) => e) || [];
    return message;
  },
};

function createBaseListRoomsResponse(): ListRoomsResponse {
  return { rooms: [] };
}

export const ListRoomsResponse = {
  encode(message: ListRoomsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rooms !== undefined && message.rooms.length !== 0) {
      for (const v of message.rooms) {
        Room.encode(v!, writer.uint32(10).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRoomsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListRoomsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rooms!.push(Room.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListRoomsResponse {
    return { rooms: Array.isArray(object?.rooms) ? object.rooms.map((e: any) => Room.fromJSON(e)) : [] };
  },

  toJSON(message: ListRoomsResponse): unknown {
    const obj: any = {};
    if (message.rooms) {
      obj.rooms = message.rooms.map((e) => e ? Room.toJSON(e) : undefined);
    } else {
      obj.rooms = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListRoomsResponse>, I>>(object: I): ListRoomsResponse {
    const message = createBaseListRoomsResponse();
    message.rooms = object.rooms?.map((e) => Room.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDeleteRoomRequest(): DeleteRoomRequest {
  return { room: "" };
}

export const DeleteRoomRequest = {
  encode(message: DeleteRoomRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.room !== undefined && message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteRoomRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteRoomRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteRoomRequest {
    return { room: isSet(object.room) ? String(object.room) : "" };
  },

  toJSON(message: DeleteRoomRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeleteRoomRequest>, I>>(object: I): DeleteRoomRequest {
    const message = createBaseDeleteRoomRequest();
    message.room = object.room ?? "";
    return message;
  },
};

function createBaseDeleteRoomResponse(): DeleteRoomResponse {
  return {};
}

export const DeleteRoomResponse = {
  encode(_: DeleteRoomResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteRoomResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteRoomResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): DeleteRoomResponse {
    return {};
  },

  toJSON(_: DeleteRoomResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeleteRoomResponse>, I>>(_: I): DeleteRoomResponse {
    const message = createBaseDeleteRoomResponse();
    return message;
  },
};

function createBaseListParticipantsRequest(): ListParticipantsRequest {
  return { room: "" };
}

export const ListParticipantsRequest = {
  encode(message: ListParticipantsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.room !== undefined && message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListParticipantsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListParticipantsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListParticipantsRequest {
    return { room: isSet(object.room) ? String(object.room) : "" };
  },

  toJSON(message: ListParticipantsRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListParticipantsRequest>, I>>(object: I): ListParticipantsRequest {
    const message = createBaseListParticipantsRequest();
    message.room = object.room ?? "";
    return message;
  },
};

function createBaseListParticipantsResponse(): ListParticipantsResponse {
  return { participants: [] };
}

export const ListParticipantsResponse = {
  encode(message: ListParticipantsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.participants !== undefined && message.participants.length !== 0) {
      for (const v of message.participants) {
        ParticipantInfo.encode(v!, writer.uint32(10).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListParticipantsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListParticipantsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.participants!.push(ParticipantInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListParticipantsResponse {
    return {
      participants: Array.isArray(object?.participants)
        ? object.participants.map((e: any) => ParticipantInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ListParticipantsResponse): unknown {
    const obj: any = {};
    if (message.participants) {
      obj.participants = message.participants.map((e) => e ? ParticipantInfo.toJSON(e) : undefined);
    } else {
      obj.participants = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListParticipantsResponse>, I>>(object: I): ListParticipantsResponse {
    const message = createBaseListParticipantsResponse();
    message.participants = object.participants?.map((e) => ParticipantInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseRoomParticipantIdentity(): RoomParticipantIdentity {
  return { room: "", identity: "" };
}

export const RoomParticipantIdentity = {
  encode(message: RoomParticipantIdentity, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.room !== undefined && message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    if (message.identity !== undefined && message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RoomParticipantIdentity {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRoomParticipantIdentity();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = reader.string();
          break;
        case 2:
          message.identity = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RoomParticipantIdentity {
    return {
      room: isSet(object.room) ? String(object.room) : "",
      identity: isSet(object.identity) ? String(object.identity) : "",
    };
  },

  toJSON(message: RoomParticipantIdentity): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.identity !== undefined && (obj.identity = message.identity);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RoomParticipantIdentity>, I>>(object: I): RoomParticipantIdentity {
    const message = createBaseRoomParticipantIdentity();
    message.room = object.room ?? "";
    message.identity = object.identity ?? "";
    return message;
  },
};

function createBaseRemoveParticipantResponse(): RemoveParticipantResponse {
  return {};
}

export const RemoveParticipantResponse = {
  encode(_: RemoveParticipantResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveParticipantResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveParticipantResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): RemoveParticipantResponse {
    return {};
  },

  toJSON(_: RemoveParticipantResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveParticipantResponse>, I>>(_: I): RemoveParticipantResponse {
    const message = createBaseRemoveParticipantResponse();
    return message;
  },
};

function createBaseMuteRoomTrackRequest(): MuteRoomTrackRequest {
  return { room: "", identity: "", trackSid: "", muted: false };
}

export const MuteRoomTrackRequest = {
  encode(message: MuteRoomTrackRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.room !== undefined && message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    if (message.identity !== undefined && message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    if (message.trackSid !== undefined && message.trackSid !== "") {
      writer.uint32(26).string(message.trackSid);
    }
    if (message.muted === true) {
      writer.uint32(32).bool(message.muted);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MuteRoomTrackRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMuteRoomTrackRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = reader.string();
          break;
        case 2:
          message.identity = reader.string();
          break;
        case 3:
          message.trackSid = reader.string();
          break;
        case 4:
          message.muted = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MuteRoomTrackRequest {
    return {
      room: isSet(object.room) ? String(object.room) : "",
      identity: isSet(object.identity) ? String(object.identity) : "",
      trackSid: isSet(object.trackSid) ? String(object.trackSid) : "",
      muted: isSet(object.muted) ? Boolean(object.muted) : false,
    };
  },

  toJSON(message: MuteRoomTrackRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.identity !== undefined && (obj.identity = message.identity);
    message.trackSid !== undefined && (obj.trackSid = message.trackSid);
    message.muted !== undefined && (obj.muted = message.muted);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MuteRoomTrackRequest>, I>>(object: I): MuteRoomTrackRequest {
    const message = createBaseMuteRoomTrackRequest();
    message.room = object.room ?? "";
    message.identity = object.identity ?? "";
    message.trackSid = object.trackSid ?? "";
    message.muted = object.muted ?? false;
    return message;
  },
};

function createBaseMuteRoomTrackResponse(): MuteRoomTrackResponse {
  return { track: undefined };
}

export const MuteRoomTrackResponse = {
  encode(message: MuteRoomTrackResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.track !== undefined) {
      TrackInfo.encode(message.track, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MuteRoomTrackResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMuteRoomTrackResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.track = TrackInfo.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MuteRoomTrackResponse {
    return { track: isSet(object.track) ? TrackInfo.fromJSON(object.track) : undefined };
  },

  toJSON(message: MuteRoomTrackResponse): unknown {
    const obj: any = {};
    message.track !== undefined && (obj.track = message.track ? TrackInfo.toJSON(message.track) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MuteRoomTrackResponse>, I>>(object: I): MuteRoomTrackResponse {
    const message = createBaseMuteRoomTrackResponse();
    message.track = (object.track !== undefined && object.track !== null)
      ? TrackInfo.fromPartial(object.track)
      : undefined;
    return message;
  },
};

function createBaseUpdateParticipantRequest(): UpdateParticipantRequest {
  return { room: "", identity: "", metadata: "", permission: undefined, name: "" };
}

export const UpdateParticipantRequest = {
  encode(message: UpdateParticipantRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.room !== undefined && message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    if (message.identity !== undefined && message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    if (message.metadata !== undefined && message.metadata !== "") {
      writer.uint32(26).string(message.metadata);
    }
    if (message.permission !== undefined) {
      ParticipantPermission.encode(message.permission, writer.uint32(34).fork()).ldelim();
    }
    if (message.name !== undefined && message.name !== "") {
      writer.uint32(42).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateParticipantRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateParticipantRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = reader.string();
          break;
        case 2:
          message.identity = reader.string();
          break;
        case 3:
          message.metadata = reader.string();
          break;
        case 4:
          message.permission = ParticipantPermission.decode(reader, reader.uint32());
          break;
        case 5:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateParticipantRequest {
    return {
      room: isSet(object.room) ? String(object.room) : "",
      identity: isSet(object.identity) ? String(object.identity) : "",
      metadata: isSet(object.metadata) ? String(object.metadata) : "",
      permission: isSet(object.permission) ? ParticipantPermission.fromJSON(object.permission) : undefined,
      name: isSet(object.name) ? String(object.name) : "",
    };
  },

  toJSON(message: UpdateParticipantRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.identity !== undefined && (obj.identity = message.identity);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.permission !== undefined &&
      (obj.permission = message.permission ? ParticipantPermission.toJSON(message.permission) : undefined);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateParticipantRequest>, I>>(object: I): UpdateParticipantRequest {
    const message = createBaseUpdateParticipantRequest();
    message.room = object.room ?? "";
    message.identity = object.identity ?? "";
    message.metadata = object.metadata ?? "";
    message.permission = (object.permission !== undefined && object.permission !== null)
      ? ParticipantPermission.fromPartial(object.permission)
      : undefined;
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseUpdateSubscriptionsRequest(): UpdateSubscriptionsRequest {
  return { room: "", identity: "", trackSids: [], subscribe: false, participantTracks: [] };
}

export const UpdateSubscriptionsRequest = {
  encode(message: UpdateSubscriptionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.room !== undefined && message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    if (message.identity !== undefined && message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    if (message.trackSids !== undefined && message.trackSids.length !== 0) {
      for (const v of message.trackSids) {
        writer.uint32(26).string(v!);
      }
    }
    if (message.subscribe === true) {
      writer.uint32(32).bool(message.subscribe);
    }
    if (message.participantTracks !== undefined && message.participantTracks.length !== 0) {
      for (const v of message.participantTracks) {
        ParticipantTracks.encode(v!, writer.uint32(42).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateSubscriptionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateSubscriptionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = reader.string();
          break;
        case 2:
          message.identity = reader.string();
          break;
        case 3:
          message.trackSids!.push(reader.string());
          break;
        case 4:
          message.subscribe = reader.bool();
          break;
        case 5:
          message.participantTracks!.push(ParticipantTracks.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateSubscriptionsRequest {
    return {
      room: isSet(object.room) ? String(object.room) : "",
      identity: isSet(object.identity) ? String(object.identity) : "",
      trackSids: Array.isArray(object?.trackSids) ? object.trackSids.map((e: any) => String(e)) : [],
      subscribe: isSet(object.subscribe) ? Boolean(object.subscribe) : false,
      participantTracks: Array.isArray(object?.participantTracks)
        ? object.participantTracks.map((e: any) => ParticipantTracks.fromJSON(e))
        : [],
    };
  },

  toJSON(message: UpdateSubscriptionsRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.identity !== undefined && (obj.identity = message.identity);
    if (message.trackSids) {
      obj.trackSids = message.trackSids.map((e) => e);
    } else {
      obj.trackSids = [];
    }
    message.subscribe !== undefined && (obj.subscribe = message.subscribe);
    if (message.participantTracks) {
      obj.participantTracks = message.participantTracks.map((e) => e ? ParticipantTracks.toJSON(e) : undefined);
    } else {
      obj.participantTracks = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateSubscriptionsRequest>, I>>(object: I): UpdateSubscriptionsRequest {
    const message = createBaseUpdateSubscriptionsRequest();
    message.room = object.room ?? "";
    message.identity = object.identity ?? "";
    message.trackSids = object.trackSids?.map((e) => e) || [];
    message.subscribe = object.subscribe ?? false;
    message.participantTracks = object.participantTracks?.map((e) => ParticipantTracks.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUpdateSubscriptionsResponse(): UpdateSubscriptionsResponse {
  return {};
}

export const UpdateSubscriptionsResponse = {
  encode(_: UpdateSubscriptionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateSubscriptionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateSubscriptionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpdateSubscriptionsResponse {
    return {};
  },

  toJSON(_: UpdateSubscriptionsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateSubscriptionsResponse>, I>>(_: I): UpdateSubscriptionsResponse {
    const message = createBaseUpdateSubscriptionsResponse();
    return message;
  },
};

function createBaseSendDataRequest(): SendDataRequest {
  return { room: "", data: new Uint8Array(), kind: 0, destinationSids: [], topic: undefined };
}

export const SendDataRequest = {
  encode(message: SendDataRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.room !== undefined && message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    if (message.data !== undefined && message.data.length !== 0) {
      writer.uint32(18).bytes(message.data);
    }
    if (message.kind !== undefined && message.kind !== 0) {
      writer.uint32(24).int32(message.kind);
    }
    if (message.destinationSids !== undefined && message.destinationSids.length !== 0) {
      for (const v of message.destinationSids) {
        writer.uint32(34).string(v!);
      }
    }
    if (message.topic !== undefined) {
      writer.uint32(42).string(message.topic);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendDataRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendDataRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = reader.string();
          break;
        case 2:
          message.data = reader.bytes();
          break;
        case 3:
          message.kind = reader.int32() as any;
          break;
        case 4:
          message.destinationSids!.push(reader.string());
          break;
        case 5:
          message.topic = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SendDataRequest {
    return {
      room: isSet(object.room) ? String(object.room) : "",
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
      kind: isSet(object.kind) ? dataPacket_KindFromJSON(object.kind) : 0,
      destinationSids: Array.isArray(object?.destinationSids) ? object.destinationSids.map((e: any) => String(e)) : [],
      topic: isSet(object.topic) ? String(object.topic) : undefined,
    };
  },

  toJSON(message: SendDataRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.data !== undefined &&
      (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
    message.kind !== undefined && (obj.kind = dataPacket_KindToJSON(message.kind));
    if (message.destinationSids) {
      obj.destinationSids = message.destinationSids.map((e) => e);
    } else {
      obj.destinationSids = [];
    }
    message.topic !== undefined && (obj.topic = message.topic);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SendDataRequest>, I>>(object: I): SendDataRequest {
    const message = createBaseSendDataRequest();
    message.room = object.room ?? "";
    message.data = object.data ?? new Uint8Array();
    message.kind = object.kind ?? 0;
    message.destinationSids = object.destinationSids?.map((e) => e) || [];
    message.topic = object.topic ?? undefined;
    return message;
  },
};

function createBaseSendDataResponse(): SendDataResponse {
  return {};
}

export const SendDataResponse = {
  encode(_: SendDataResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendDataResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendDataResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): SendDataResponse {
    return {};
  },

  toJSON(_: SendDataResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SendDataResponse>, I>>(_: I): SendDataResponse {
    const message = createBaseSendDataResponse();
    return message;
  },
};

function createBaseUpdateRoomMetadataRequest(): UpdateRoomMetadataRequest {
  return { room: "", metadata: "" };
}

export const UpdateRoomMetadataRequest = {
  encode(message: UpdateRoomMetadataRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.room !== undefined && message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    if (message.metadata !== undefined && message.metadata !== "") {
      writer.uint32(18).string(message.metadata);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateRoomMetadataRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateRoomMetadataRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = reader.string();
          break;
        case 2:
          message.metadata = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateRoomMetadataRequest {
    return {
      room: isSet(object.room) ? String(object.room) : "",
      metadata: isSet(object.metadata) ? String(object.metadata) : "",
    };
  },

  toJSON(message: UpdateRoomMetadataRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateRoomMetadataRequest>, I>>(object: I): UpdateRoomMetadataRequest {
    const message = createBaseUpdateRoomMetadataRequest();
    message.room = object.room ?? "";
    message.metadata = object.metadata ?? "";
    return message;
  },
};

/**
 * Room service that can be performed on any node
 * they are Twirp-based HTTP req/responses
 */
export interface RoomService {
  /**
   * Creates a room with settings. Requires `roomCreate` permission.
   * This method is optional; rooms are automatically created when clients connect to them for the first time.
   */
  CreateRoom(request: CreateRoomRequest): Promise<Room>;
  /** List rooms that are active on the server. Requires `roomList` permission. */
  ListRooms(request: ListRoomsRequest): Promise<ListRoomsResponse>;
  /**
   * Deletes an existing room by name or id. Requires `roomCreate` permission.
   * DeleteRoom will disconnect all participants that are currently in the room.
   */
  DeleteRoom(request: DeleteRoomRequest): Promise<DeleteRoomResponse>;
  /** Lists participants in a room, Requires `roomAdmin` */
  ListParticipants(request: ListParticipantsRequest): Promise<ListParticipantsResponse>;
  /** Get information on a specific participant, Requires `roomAdmin` */
  GetParticipant(request: RoomParticipantIdentity): Promise<ParticipantInfo>;
  /** Removes a participant from room. Requires `roomAdmin` */
  RemoveParticipant(request: RoomParticipantIdentity): Promise<RemoveParticipantResponse>;
  /** Mute/unmute a participant's track, Requires `roomAdmin` */
  MutePublishedTrack(request: MuteRoomTrackRequest): Promise<MuteRoomTrackResponse>;
  /** Update participant metadata, will cause updates to be broadcasted to everyone in the room. Requires `roomAdmin` */
  UpdateParticipant(request: UpdateParticipantRequest): Promise<ParticipantInfo>;
  /** Subscribes or unsubscribe a participant from tracks. Requires `roomAdmin` */
  UpdateSubscriptions(request: UpdateSubscriptionsRequest): Promise<UpdateSubscriptionsResponse>;
  /** Send data over data channel to participants in a room, Requires `roomAdmin` */
  SendData(request: SendDataRequest): Promise<SendDataResponse>;
  /** Update room metadata, will cause updates to be broadcasted to everyone in the room, Requires `roomAdmin` */
  UpdateRoomMetadata(request: UpdateRoomMetadataRequest): Promise<Room>;
}

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

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
