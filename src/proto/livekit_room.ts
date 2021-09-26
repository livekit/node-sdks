/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  TrackInfo,
  DataPacket_Kind,
  Room,
  ParticipantInfo,
  dataPacket_KindFromJSON,
  dataPacket_KindToJSON,
} from "./livekit_models";

export const protobufPackage = "livekit";

export interface CreateRoomRequest {
  /** name of the room */
  name: string;
  /** number of seconds to keep the room open if no one joins */
  emptyTimeout: number;
  /** limit number of participants that can be in a room */
  maxParticipants: number;
  /** override the node room is allocated to, for debugging */
  nodeId: string;
}

export interface ListRoomsRequest {}

export interface ListRoomsResponse {
  rooms: Room[];
}

export interface DeleteRoomRequest {
  /** name of the room */
  room: string;
}

export interface DeleteRoomResponse {}

export interface ListParticipantsRequest {
  /** name of the room */
  room: string;
}

export interface ListParticipantsResponse {
  participants: ParticipantInfo[];
}

export interface RoomParticipantIdentity {
  /** name of the room */
  room: string;
  /** identity of the participant */
  identity: string;
}

export interface RemoveParticipantResponse {}

export interface MuteRoomTrackRequest {
  /** name of the room */
  room: string;
  identity: string;
  /** sid of the track to mute */
  trackSid: string;
  /** set to true to mute, false to unmute */
  muted: boolean;
}

export interface MuteRoomTrackResponse {
  track?: TrackInfo;
}

export interface ParticipantPermission {
  /** allow participant to subscribe to other tracks in the room */
  canSubscribe: boolean;
  /** allow participant to publish new tracks to room */
  canPublish: boolean;
  /** allow participant to publish data */
  canPublishData: boolean;
}

export interface UpdateParticipantRequest {
  room: string;
  identity: string;
  /** metadata to update. skipping updates if left empty */
  metadata: string;
  /** set to update the participant's permissions */
  permission?: ParticipantPermission;
}

export interface UpdateSubscriptionsRequest {
  room: string;
  identity: string;
  /** list of sids of tracks */
  trackSids: string[];
  /** set to true to subscribe, false to unsubscribe from tracks */
  subscribe: boolean;
}

/** empty for now */
export interface UpdateSubscriptionsResponse {}

export interface SendDataRequest {
  room: string;
  data: Uint8Array;
  kind: DataPacket_Kind;
  destinationSids: string[];
}

/**  */
export interface SendDataResponse {}

export interface UpdateRoomMetadataRequest {
  room: string;
  /** metadata to update. skipping updates if left empty */
  metadata: string;
}

const baseCreateRoomRequest: object = {
  name: "",
  emptyTimeout: 0,
  maxParticipants: 0,
  nodeId: "",
};

export const CreateRoomRequest = {
  encode(
    message: CreateRoomRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.emptyTimeout !== 0) {
      writer.uint32(16).uint32(message.emptyTimeout);
    }
    if (message.maxParticipants !== 0) {
      writer.uint32(24).uint32(message.maxParticipants);
    }
    if (message.nodeId !== "") {
      writer.uint32(34).string(message.nodeId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateRoomRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCreateRoomRequest } as CreateRoomRequest;
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
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateRoomRequest {
    const message = { ...baseCreateRoomRequest } as CreateRoomRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.emptyTimeout !== undefined && object.emptyTimeout !== null) {
      message.emptyTimeout = Number(object.emptyTimeout);
    } else {
      message.emptyTimeout = 0;
    }
    if (
      object.maxParticipants !== undefined &&
      object.maxParticipants !== null
    ) {
      message.maxParticipants = Number(object.maxParticipants);
    } else {
      message.maxParticipants = 0;
    }
    if (object.nodeId !== undefined && object.nodeId !== null) {
      message.nodeId = String(object.nodeId);
    } else {
      message.nodeId = "";
    }
    return message;
  },

  toJSON(message: CreateRoomRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.emptyTimeout !== undefined &&
      (obj.emptyTimeout = message.emptyTimeout);
    message.maxParticipants !== undefined &&
      (obj.maxParticipants = message.maxParticipants);
    message.nodeId !== undefined && (obj.nodeId = message.nodeId);
    return obj;
  },

  fromPartial(object: DeepPartial<CreateRoomRequest>): CreateRoomRequest {
    const message = { ...baseCreateRoomRequest } as CreateRoomRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.emptyTimeout !== undefined && object.emptyTimeout !== null) {
      message.emptyTimeout = object.emptyTimeout;
    } else {
      message.emptyTimeout = 0;
    }
    if (
      object.maxParticipants !== undefined &&
      object.maxParticipants !== null
    ) {
      message.maxParticipants = object.maxParticipants;
    } else {
      message.maxParticipants = 0;
    }
    if (object.nodeId !== undefined && object.nodeId !== null) {
      message.nodeId = object.nodeId;
    } else {
      message.nodeId = "";
    }
    return message;
  },
};

const baseListRoomsRequest: object = {};

export const ListRoomsRequest = {
  encode(
    _: ListRoomsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRoomsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListRoomsRequest } as ListRoomsRequest;
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

  fromJSON(_: any): ListRoomsRequest {
    const message = { ...baseListRoomsRequest } as ListRoomsRequest;
    return message;
  },

  toJSON(_: ListRoomsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<ListRoomsRequest>): ListRoomsRequest {
    const message = { ...baseListRoomsRequest } as ListRoomsRequest;
    return message;
  },
};

const baseListRoomsResponse: object = {};

export const ListRoomsResponse = {
  encode(
    message: ListRoomsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.rooms) {
      Room.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRoomsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListRoomsResponse } as ListRoomsResponse;
    message.rooms = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rooms.push(Room.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListRoomsResponse {
    const message = { ...baseListRoomsResponse } as ListRoomsResponse;
    message.rooms = [];
    if (object.rooms !== undefined && object.rooms !== null) {
      for (const e of object.rooms) {
        message.rooms.push(Room.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: ListRoomsResponse): unknown {
    const obj: any = {};
    if (message.rooms) {
      obj.rooms = message.rooms.map((e) => (e ? Room.toJSON(e) : undefined));
    } else {
      obj.rooms = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ListRoomsResponse>): ListRoomsResponse {
    const message = { ...baseListRoomsResponse } as ListRoomsResponse;
    message.rooms = [];
    if (object.rooms !== undefined && object.rooms !== null) {
      for (const e of object.rooms) {
        message.rooms.push(Room.fromPartial(e));
      }
    }
    return message;
  },
};

const baseDeleteRoomRequest: object = { room: "" };

export const DeleteRoomRequest = {
  encode(
    message: DeleteRoomRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteRoomRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDeleteRoomRequest } as DeleteRoomRequest;
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
    const message = { ...baseDeleteRoomRequest } as DeleteRoomRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = String(object.room);
    } else {
      message.room = "";
    }
    return message;
  },

  toJSON(message: DeleteRoomRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    return obj;
  },

  fromPartial(object: DeepPartial<DeleteRoomRequest>): DeleteRoomRequest {
    const message = { ...baseDeleteRoomRequest } as DeleteRoomRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = object.room;
    } else {
      message.room = "";
    }
    return message;
  },
};

const baseDeleteRoomResponse: object = {};

export const DeleteRoomResponse = {
  encode(
    _: DeleteRoomResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteRoomResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDeleteRoomResponse } as DeleteRoomResponse;
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
    const message = { ...baseDeleteRoomResponse } as DeleteRoomResponse;
    return message;
  },

  toJSON(_: DeleteRoomResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<DeleteRoomResponse>): DeleteRoomResponse {
    const message = { ...baseDeleteRoomResponse } as DeleteRoomResponse;
    return message;
  },
};

const baseListParticipantsRequest: object = { room: "" };

export const ListParticipantsRequest = {
  encode(
    message: ListParticipantsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ListParticipantsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseListParticipantsRequest,
    } as ListParticipantsRequest;
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
    const message = {
      ...baseListParticipantsRequest,
    } as ListParticipantsRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = String(object.room);
    } else {
      message.room = "";
    }
    return message;
  },

  toJSON(message: ListParticipantsRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ListParticipantsRequest>
  ): ListParticipantsRequest {
    const message = {
      ...baseListParticipantsRequest,
    } as ListParticipantsRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = object.room;
    } else {
      message.room = "";
    }
    return message;
  },
};

const baseListParticipantsResponse: object = {};

export const ListParticipantsResponse = {
  encode(
    message: ListParticipantsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.participants) {
      ParticipantInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ListParticipantsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseListParticipantsResponse,
    } as ListParticipantsResponse;
    message.participants = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.participants.push(
            ParticipantInfo.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListParticipantsResponse {
    const message = {
      ...baseListParticipantsResponse,
    } as ListParticipantsResponse;
    message.participants = [];
    if (object.participants !== undefined && object.participants !== null) {
      for (const e of object.participants) {
        message.participants.push(ParticipantInfo.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: ListParticipantsResponse): unknown {
    const obj: any = {};
    if (message.participants) {
      obj.participants = message.participants.map((e) =>
        e ? ParticipantInfo.toJSON(e) : undefined
      );
    } else {
      obj.participants = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<ListParticipantsResponse>
  ): ListParticipantsResponse {
    const message = {
      ...baseListParticipantsResponse,
    } as ListParticipantsResponse;
    message.participants = [];
    if (object.participants !== undefined && object.participants !== null) {
      for (const e of object.participants) {
        message.participants.push(ParticipantInfo.fromPartial(e));
      }
    }
    return message;
  },
};

const baseRoomParticipantIdentity: object = { room: "", identity: "" };

export const RoomParticipantIdentity = {
  encode(
    message: RoomParticipantIdentity,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    if (message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RoomParticipantIdentity {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseRoomParticipantIdentity,
    } as RoomParticipantIdentity;
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
    const message = {
      ...baseRoomParticipantIdentity,
    } as RoomParticipantIdentity;
    if (object.room !== undefined && object.room !== null) {
      message.room = String(object.room);
    } else {
      message.room = "";
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = String(object.identity);
    } else {
      message.identity = "";
    }
    return message;
  },

  toJSON(message: RoomParticipantIdentity): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.identity !== undefined && (obj.identity = message.identity);
    return obj;
  },

  fromPartial(
    object: DeepPartial<RoomParticipantIdentity>
  ): RoomParticipantIdentity {
    const message = {
      ...baseRoomParticipantIdentity,
    } as RoomParticipantIdentity;
    if (object.room !== undefined && object.room !== null) {
      message.room = object.room;
    } else {
      message.room = "";
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = object.identity;
    } else {
      message.identity = "";
    }
    return message;
  },
};

const baseRemoveParticipantResponse: object = {};

export const RemoveParticipantResponse = {
  encode(
    _: RemoveParticipantResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RemoveParticipantResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseRemoveParticipantResponse,
    } as RemoveParticipantResponse;
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
    const message = {
      ...baseRemoveParticipantResponse,
    } as RemoveParticipantResponse;
    return message;
  },

  toJSON(_: RemoveParticipantResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<RemoveParticipantResponse>
  ): RemoveParticipantResponse {
    const message = {
      ...baseRemoveParticipantResponse,
    } as RemoveParticipantResponse;
    return message;
  },
};

const baseMuteRoomTrackRequest: object = {
  room: "",
  identity: "",
  trackSid: "",
  muted: false,
};

export const MuteRoomTrackRequest = {
  encode(
    message: MuteRoomTrackRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    if (message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    if (message.trackSid !== "") {
      writer.uint32(26).string(message.trackSid);
    }
    if (message.muted === true) {
      writer.uint32(32).bool(message.muted);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MuteRoomTrackRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMuteRoomTrackRequest } as MuteRoomTrackRequest;
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
    const message = { ...baseMuteRoomTrackRequest } as MuteRoomTrackRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = String(object.room);
    } else {
      message.room = "";
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = String(object.identity);
    } else {
      message.identity = "";
    }
    if (object.trackSid !== undefined && object.trackSid !== null) {
      message.trackSid = String(object.trackSid);
    } else {
      message.trackSid = "";
    }
    if (object.muted !== undefined && object.muted !== null) {
      message.muted = Boolean(object.muted);
    } else {
      message.muted = false;
    }
    return message;
  },

  toJSON(message: MuteRoomTrackRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.identity !== undefined && (obj.identity = message.identity);
    message.trackSid !== undefined && (obj.trackSid = message.trackSid);
    message.muted !== undefined && (obj.muted = message.muted);
    return obj;
  },

  fromPartial(object: DeepPartial<MuteRoomTrackRequest>): MuteRoomTrackRequest {
    const message = { ...baseMuteRoomTrackRequest } as MuteRoomTrackRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = object.room;
    } else {
      message.room = "";
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = object.identity;
    } else {
      message.identity = "";
    }
    if (object.trackSid !== undefined && object.trackSid !== null) {
      message.trackSid = object.trackSid;
    } else {
      message.trackSid = "";
    }
    if (object.muted !== undefined && object.muted !== null) {
      message.muted = object.muted;
    } else {
      message.muted = false;
    }
    return message;
  },
};

const baseMuteRoomTrackResponse: object = {};

export const MuteRoomTrackResponse = {
  encode(
    message: MuteRoomTrackResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.track !== undefined) {
      TrackInfo.encode(message.track, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MuteRoomTrackResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMuteRoomTrackResponse } as MuteRoomTrackResponse;
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
    const message = { ...baseMuteRoomTrackResponse } as MuteRoomTrackResponse;
    if (object.track !== undefined && object.track !== null) {
      message.track = TrackInfo.fromJSON(object.track);
    } else {
      message.track = undefined;
    }
    return message;
  },

  toJSON(message: MuteRoomTrackResponse): unknown {
    const obj: any = {};
    message.track !== undefined &&
      (obj.track = message.track ? TrackInfo.toJSON(message.track) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MuteRoomTrackResponse>
  ): MuteRoomTrackResponse {
    const message = { ...baseMuteRoomTrackResponse } as MuteRoomTrackResponse;
    if (object.track !== undefined && object.track !== null) {
      message.track = TrackInfo.fromPartial(object.track);
    } else {
      message.track = undefined;
    }
    return message;
  },
};

const baseParticipantPermission: object = {
  canSubscribe: false,
  canPublish: false,
  canPublishData: false,
};

export const ParticipantPermission = {
  encode(
    message: ParticipantPermission,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.canSubscribe === true) {
      writer.uint32(8).bool(message.canSubscribe);
    }
    if (message.canPublish === true) {
      writer.uint32(16).bool(message.canPublish);
    }
    if (message.canPublishData === true) {
      writer.uint32(24).bool(message.canPublishData);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ParticipantPermission {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseParticipantPermission } as ParticipantPermission;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.canSubscribe = reader.bool();
          break;
        case 2:
          message.canPublish = reader.bool();
          break;
        case 3:
          message.canPublishData = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ParticipantPermission {
    const message = { ...baseParticipantPermission } as ParticipantPermission;
    if (object.canSubscribe !== undefined && object.canSubscribe !== null) {
      message.canSubscribe = Boolean(object.canSubscribe);
    } else {
      message.canSubscribe = false;
    }
    if (object.canPublish !== undefined && object.canPublish !== null) {
      message.canPublish = Boolean(object.canPublish);
    } else {
      message.canPublish = false;
    }
    if (object.canPublishData !== undefined && object.canPublishData !== null) {
      message.canPublishData = Boolean(object.canPublishData);
    } else {
      message.canPublishData = false;
    }
    return message;
  },

  toJSON(message: ParticipantPermission): unknown {
    const obj: any = {};
    message.canSubscribe !== undefined &&
      (obj.canSubscribe = message.canSubscribe);
    message.canPublish !== undefined && (obj.canPublish = message.canPublish);
    message.canPublishData !== undefined &&
      (obj.canPublishData = message.canPublishData);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ParticipantPermission>
  ): ParticipantPermission {
    const message = { ...baseParticipantPermission } as ParticipantPermission;
    if (object.canSubscribe !== undefined && object.canSubscribe !== null) {
      message.canSubscribe = object.canSubscribe;
    } else {
      message.canSubscribe = false;
    }
    if (object.canPublish !== undefined && object.canPublish !== null) {
      message.canPublish = object.canPublish;
    } else {
      message.canPublish = false;
    }
    if (object.canPublishData !== undefined && object.canPublishData !== null) {
      message.canPublishData = object.canPublishData;
    } else {
      message.canPublishData = false;
    }
    return message;
  },
};

const baseUpdateParticipantRequest: object = {
  room: "",
  identity: "",
  metadata: "",
};

export const UpdateParticipantRequest = {
  encode(
    message: UpdateParticipantRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    if (message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    if (message.metadata !== "") {
      writer.uint32(26).string(message.metadata);
    }
    if (message.permission !== undefined) {
      ParticipantPermission.encode(
        message.permission,
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UpdateParticipantRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateParticipantRequest,
    } as UpdateParticipantRequest;
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
          message.permission = ParticipantPermission.decode(
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

  fromJSON(object: any): UpdateParticipantRequest {
    const message = {
      ...baseUpdateParticipantRequest,
    } as UpdateParticipantRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = String(object.room);
    } else {
      message.room = "";
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = String(object.identity);
    } else {
      message.identity = "";
    }
    if (object.metadata !== undefined && object.metadata !== null) {
      message.metadata = String(object.metadata);
    } else {
      message.metadata = "";
    }
    if (object.permission !== undefined && object.permission !== null) {
      message.permission = ParticipantPermission.fromJSON(object.permission);
    } else {
      message.permission = undefined;
    }
    return message;
  },

  toJSON(message: UpdateParticipantRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.identity !== undefined && (obj.identity = message.identity);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.permission !== undefined &&
      (obj.permission = message.permission
        ? ParticipantPermission.toJSON(message.permission)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateParticipantRequest>
  ): UpdateParticipantRequest {
    const message = {
      ...baseUpdateParticipantRequest,
    } as UpdateParticipantRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = object.room;
    } else {
      message.room = "";
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = object.identity;
    } else {
      message.identity = "";
    }
    if (object.metadata !== undefined && object.metadata !== null) {
      message.metadata = object.metadata;
    } else {
      message.metadata = "";
    }
    if (object.permission !== undefined && object.permission !== null) {
      message.permission = ParticipantPermission.fromPartial(object.permission);
    } else {
      message.permission = undefined;
    }
    return message;
  },
};

const baseUpdateSubscriptionsRequest: object = {
  room: "",
  identity: "",
  trackSids: "",
  subscribe: false,
};

export const UpdateSubscriptionsRequest = {
  encode(
    message: UpdateSubscriptionsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    if (message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    for (const v of message.trackSids) {
      writer.uint32(26).string(v!);
    }
    if (message.subscribe === true) {
      writer.uint32(32).bool(message.subscribe);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UpdateSubscriptionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateSubscriptionsRequest,
    } as UpdateSubscriptionsRequest;
    message.trackSids = [];
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
          message.trackSids.push(reader.string());
          break;
        case 4:
          message.subscribe = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateSubscriptionsRequest {
    const message = {
      ...baseUpdateSubscriptionsRequest,
    } as UpdateSubscriptionsRequest;
    message.trackSids = [];
    if (object.room !== undefined && object.room !== null) {
      message.room = String(object.room);
    } else {
      message.room = "";
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = String(object.identity);
    } else {
      message.identity = "";
    }
    if (object.trackSids !== undefined && object.trackSids !== null) {
      for (const e of object.trackSids) {
        message.trackSids.push(String(e));
      }
    }
    if (object.subscribe !== undefined && object.subscribe !== null) {
      message.subscribe = Boolean(object.subscribe);
    } else {
      message.subscribe = false;
    }
    return message;
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
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateSubscriptionsRequest>
  ): UpdateSubscriptionsRequest {
    const message = {
      ...baseUpdateSubscriptionsRequest,
    } as UpdateSubscriptionsRequest;
    message.trackSids = [];
    if (object.room !== undefined && object.room !== null) {
      message.room = object.room;
    } else {
      message.room = "";
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = object.identity;
    } else {
      message.identity = "";
    }
    if (object.trackSids !== undefined && object.trackSids !== null) {
      for (const e of object.trackSids) {
        message.trackSids.push(e);
      }
    }
    if (object.subscribe !== undefined && object.subscribe !== null) {
      message.subscribe = object.subscribe;
    } else {
      message.subscribe = false;
    }
    return message;
  },
};

const baseUpdateSubscriptionsResponse: object = {};

export const UpdateSubscriptionsResponse = {
  encode(
    _: UpdateSubscriptionsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UpdateSubscriptionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateSubscriptionsResponse,
    } as UpdateSubscriptionsResponse;
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
    const message = {
      ...baseUpdateSubscriptionsResponse,
    } as UpdateSubscriptionsResponse;
    return message;
  },

  toJSON(_: UpdateSubscriptionsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<UpdateSubscriptionsResponse>
  ): UpdateSubscriptionsResponse {
    const message = {
      ...baseUpdateSubscriptionsResponse,
    } as UpdateSubscriptionsResponse;
    return message;
  },
};

const baseSendDataRequest: object = { room: "", kind: 0, destinationSids: "" };

export const SendDataRequest = {
  encode(
    message: SendDataRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    if (message.data.length !== 0) {
      writer.uint32(18).bytes(message.data);
    }
    if (message.kind !== 0) {
      writer.uint32(24).int32(message.kind);
    }
    for (const v of message.destinationSids) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendDataRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSendDataRequest } as SendDataRequest;
    message.destinationSids = [];
    message.data = new Uint8Array();
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
          message.destinationSids.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SendDataRequest {
    const message = { ...baseSendDataRequest } as SendDataRequest;
    message.destinationSids = [];
    message.data = new Uint8Array();
    if (object.room !== undefined && object.room !== null) {
      message.room = String(object.room);
    } else {
      message.room = "";
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = bytesFromBase64(object.data);
    }
    if (object.kind !== undefined && object.kind !== null) {
      message.kind = dataPacket_KindFromJSON(object.kind);
    } else {
      message.kind = 0;
    }
    if (
      object.destinationSids !== undefined &&
      object.destinationSids !== null
    ) {
      for (const e of object.destinationSids) {
        message.destinationSids.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: SendDataRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.data !== undefined &&
      (obj.data = base64FromBytes(
        message.data !== undefined ? message.data : new Uint8Array()
      ));
    message.kind !== undefined &&
      (obj.kind = dataPacket_KindToJSON(message.kind));
    if (message.destinationSids) {
      obj.destinationSids = message.destinationSids.map((e) => e);
    } else {
      obj.destinationSids = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<SendDataRequest>): SendDataRequest {
    const message = { ...baseSendDataRequest } as SendDataRequest;
    message.destinationSids = [];
    if (object.room !== undefined && object.room !== null) {
      message.room = object.room;
    } else {
      message.room = "";
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = object.data;
    } else {
      message.data = new Uint8Array();
    }
    if (object.kind !== undefined && object.kind !== null) {
      message.kind = object.kind;
    } else {
      message.kind = 0;
    }
    if (
      object.destinationSids !== undefined &&
      object.destinationSids !== null
    ) {
      for (const e of object.destinationSids) {
        message.destinationSids.push(e);
      }
    }
    return message;
  },
};

const baseSendDataResponse: object = {};

export const SendDataResponse = {
  encode(
    _: SendDataResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendDataResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSendDataResponse } as SendDataResponse;
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
    const message = { ...baseSendDataResponse } as SendDataResponse;
    return message;
  },

  toJSON(_: SendDataResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<SendDataResponse>): SendDataResponse {
    const message = { ...baseSendDataResponse } as SendDataResponse;
    return message;
  },
};

const baseUpdateRoomMetadataRequest: object = { room: "", metadata: "" };

export const UpdateRoomMetadataRequest = {
  encode(
    message: UpdateRoomMetadataRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.room !== "") {
      writer.uint32(10).string(message.room);
    }
    if (message.metadata !== "") {
      writer.uint32(18).string(message.metadata);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UpdateRoomMetadataRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateRoomMetadataRequest,
    } as UpdateRoomMetadataRequest;
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
    const message = {
      ...baseUpdateRoomMetadataRequest,
    } as UpdateRoomMetadataRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = String(object.room);
    } else {
      message.room = "";
    }
    if (object.metadata !== undefined && object.metadata !== null) {
      message.metadata = String(object.metadata);
    } else {
      message.metadata = "";
    }
    return message;
  },

  toJSON(message: UpdateRoomMetadataRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateRoomMetadataRequest>
  ): UpdateRoomMetadataRequest {
    const message = {
      ...baseUpdateRoomMetadataRequest,
    } as UpdateRoomMetadataRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = object.room;
    } else {
      message.room = "";
    }
    if (object.metadata !== undefined && object.metadata !== null) {
      message.metadata = object.metadata;
    } else {
      message.metadata = "";
    }
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
  ListParticipants(
    request: ListParticipantsRequest
  ): Promise<ListParticipantsResponse>;
  /** Get information on a specific participant, Requires `roomAdmin` */
  GetParticipant(request: RoomParticipantIdentity): Promise<ParticipantInfo>;
  /** Removes a participant from room. Requires `roomAdmin` */
  RemoveParticipant(
    request: RoomParticipantIdentity
  ): Promise<RemoveParticipantResponse>;
  /** Mute/unmute a participant's track, Requires `roomAdmin` */
  MutePublishedTrack(
    request: MuteRoomTrackRequest
  ): Promise<MuteRoomTrackResponse>;
  /** Update participant metadata, will cause updates to be broadcasted to everyone in the room. Requires `roomAdmin` */
  UpdateParticipant(
    request: UpdateParticipantRequest
  ): Promise<ParticipantInfo>;
  /** Subscribes or unsubscribe a participant from tracks. Requires `roomAdmin` */
  UpdateSubscriptions(
    request: UpdateSubscriptionsRequest
  ): Promise<UpdateSubscriptionsResponse>;
  /** Send data over data channel to participants in a room, Requires `roomAdmin` */
  SendData(request: SendDataRequest): Promise<SendDataResponse>;
  /** Update room metadata, will cause updates to be broadcasted to everyone in the room, Requires `roomAdmin` */
  UpdateRoomMetadata(request: UpdateRoomMetadataRequest): Promise<Room>;
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

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
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
