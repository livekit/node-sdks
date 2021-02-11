/* eslint-disable */
import { Room, ParticipantInfo, TrackInfo } from './model';
import { Writer, Reader } from 'protobufjs/minimal';


export interface CreateRoomRequest {
  name: string;
  /**
   *  number of seconds the room should cleanup after being empty
   */
  emptyTimeout: number;
  maxParticipants: number;
  /**
   *  override the node room is allocated to, for debugging
   */
  nodeId: string;
}

export interface ListRoomsRequest {
}

export interface ListRoomsResponse {
  rooms: Room[];
}

export interface DeleteRoomRequest {
  room: string;
}

export interface DeleteRoomResponse {
}

export interface ListParticipantsRequest {
  room: string;
}

export interface ListParticipantsResponse {
  participants: ParticipantInfo[];
}

export interface RoomParticipantIdentity {
  room: string;
  identity: string;
}

export interface RemoveParticipantResponse {
}

export interface MuteRoomTrackRequest {
  room: string;
  identity: string;
  trackSid: string;
  muted: boolean;
}

export interface MuteRoomTrackResponse {
  track?: TrackInfo;
}

const baseCreateRoomRequest: object = {
  name: "",
  emptyTimeout: 0,
  maxParticipants: 0,
  nodeId: "",
};

const baseListRoomsRequest: object = {
};

const baseListRoomsResponse: object = {
};

const baseDeleteRoomRequest: object = {
  room: "",
};

const baseDeleteRoomResponse: object = {
};

const baseListParticipantsRequest: object = {
  room: "",
};

const baseListParticipantsResponse: object = {
};

const baseRoomParticipantIdentity: object = {
  room: "",
  identity: "",
};

const baseRemoveParticipantResponse: object = {
};

const baseMuteRoomTrackRequest: object = {
  room: "",
  identity: "",
  trackSid: "",
  muted: false,
};

const baseMuteRoomTrackResponse: object = {
};

/**
 *  Room service that can be performed on any node
 *  they are Twirp-based HTTP req/responses
 */
export interface RoomService {

  /**
   *  should be accessible to only internal servers, not external
   */
  CreateRoom(request: CreateRoomRequest): Promise<Room>;

  ListRooms(request: ListRoomsRequest): Promise<ListRoomsResponse>;

  DeleteRoom(request: DeleteRoomRequest): Promise<DeleteRoomResponse>;

  /**
   *  lists participants in a room, requires RoomAdmin
   */
  ListParticipants(request: ListParticipantsRequest): Promise<ListParticipantsResponse>;

  /**
   *  get information on a specific participant, requires RoomAdmin
   */
  GetParticipant(request: RoomParticipantIdentity): Promise<ParticipantInfo>;

  /**
   *  removes a participant from room, requires RoomAdmin
   */
  RemoveParticipant(request: RoomParticipantIdentity): Promise<RemoveParticipantResponse>;

  /**
   *  mute/unmute a participant, requires RoomAdmin
   */
  MutePublishedTrack(request: MuteRoomTrackRequest): Promise<MuteRoomTrackResponse>;

}

export const protobufPackage = 'livekit'

export const CreateRoomRequest = {
  encode(message: CreateRoomRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(16).uint32(message.emptyTimeout);
    writer.uint32(24).uint32(message.maxParticipants);
    writer.uint32(34).string(message.nodeId);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): CreateRoomRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
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
    if (object.maxParticipants !== undefined && object.maxParticipants !== null) {
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
    if (object.maxParticipants !== undefined && object.maxParticipants !== null) {
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
  toJSON(message: CreateRoomRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.emptyTimeout !== undefined && (obj.emptyTimeout = message.emptyTimeout);
    message.maxParticipants !== undefined && (obj.maxParticipants = message.maxParticipants);
    message.nodeId !== undefined && (obj.nodeId = message.nodeId);
    return obj;
  },
};

export const ListRoomsRequest = {
  encode(_: ListRoomsRequest, writer: Writer = Writer.create()): Writer {
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ListRoomsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
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
  fromPartial(_: DeepPartial<ListRoomsRequest>): ListRoomsRequest {
    const message = { ...baseListRoomsRequest } as ListRoomsRequest;
    return message;
  },
  toJSON(_: ListRoomsRequest): unknown {
    const obj: any = {};
    return obj;
  },
};

export const ListRoomsResponse = {
  encode(message: ListRoomsResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.rooms) {
      Room.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ListRoomsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
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
  toJSON(message: ListRoomsResponse): unknown {
    const obj: any = {};
    if (message.rooms) {
      obj.rooms = message.rooms.map(e => e ? Room.toJSON(e) : undefined);
    } else {
      obj.rooms = [];
    }
    return obj;
  },
};

export const DeleteRoomRequest = {
  encode(message: DeleteRoomRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.room);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): DeleteRoomRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
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
  fromPartial(object: DeepPartial<DeleteRoomRequest>): DeleteRoomRequest {
    const message = { ...baseDeleteRoomRequest } as DeleteRoomRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = object.room;
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
};

export const DeleteRoomResponse = {
  encode(_: DeleteRoomResponse, writer: Writer = Writer.create()): Writer {
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): DeleteRoomResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
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
  fromPartial(_: DeepPartial<DeleteRoomResponse>): DeleteRoomResponse {
    const message = { ...baseDeleteRoomResponse } as DeleteRoomResponse;
    return message;
  },
  toJSON(_: DeleteRoomResponse): unknown {
    const obj: any = {};
    return obj;
  },
};

export const ListParticipantsRequest = {
  encode(message: ListParticipantsRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.room);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ListParticipantsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListParticipantsRequest } as ListParticipantsRequest;
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
    const message = { ...baseListParticipantsRequest } as ListParticipantsRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = String(object.room);
    } else {
      message.room = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<ListParticipantsRequest>): ListParticipantsRequest {
    const message = { ...baseListParticipantsRequest } as ListParticipantsRequest;
    if (object.room !== undefined && object.room !== null) {
      message.room = object.room;
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
};

export const ListParticipantsResponse = {
  encode(message: ListParticipantsResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.participants) {
      ParticipantInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ListParticipantsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListParticipantsResponse } as ListParticipantsResponse;
    message.participants = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.participants.push(ParticipantInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ListParticipantsResponse {
    const message = { ...baseListParticipantsResponse } as ListParticipantsResponse;
    message.participants = [];
    if (object.participants !== undefined && object.participants !== null) {
      for (const e of object.participants) {
        message.participants.push(ParticipantInfo.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<ListParticipantsResponse>): ListParticipantsResponse {
    const message = { ...baseListParticipantsResponse } as ListParticipantsResponse;
    message.participants = [];
    if (object.participants !== undefined && object.participants !== null) {
      for (const e of object.participants) {
        message.participants.push(ParticipantInfo.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: ListParticipantsResponse): unknown {
    const obj: any = {};
    if (message.participants) {
      obj.participants = message.participants.map(e => e ? ParticipantInfo.toJSON(e) : undefined);
    } else {
      obj.participants = [];
    }
    return obj;
  },
};

export const RoomParticipantIdentity = {
  encode(message: RoomParticipantIdentity, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.room);
    writer.uint32(18).string(message.identity);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): RoomParticipantIdentity {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRoomParticipantIdentity } as RoomParticipantIdentity;
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
    const message = { ...baseRoomParticipantIdentity } as RoomParticipantIdentity;
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
  fromPartial(object: DeepPartial<RoomParticipantIdentity>): RoomParticipantIdentity {
    const message = { ...baseRoomParticipantIdentity } as RoomParticipantIdentity;
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
  toJSON(message: RoomParticipantIdentity): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.identity !== undefined && (obj.identity = message.identity);
    return obj;
  },
};

export const RemoveParticipantResponse = {
  encode(_: RemoveParticipantResponse, writer: Writer = Writer.create()): Writer {
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): RemoveParticipantResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRemoveParticipantResponse } as RemoveParticipantResponse;
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
    const message = { ...baseRemoveParticipantResponse } as RemoveParticipantResponse;
    return message;
  },
  fromPartial(_: DeepPartial<RemoveParticipantResponse>): RemoveParticipantResponse {
    const message = { ...baseRemoveParticipantResponse } as RemoveParticipantResponse;
    return message;
  },
  toJSON(_: RemoveParticipantResponse): unknown {
    const obj: any = {};
    return obj;
  },
};

export const MuteRoomTrackRequest = {
  encode(message: MuteRoomTrackRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.room);
    writer.uint32(18).string(message.identity);
    writer.uint32(26).string(message.trackSid);
    writer.uint32(32).bool(message.muted);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): MuteRoomTrackRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
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
  toJSON(message: MuteRoomTrackRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.identity !== undefined && (obj.identity = message.identity);
    message.trackSid !== undefined && (obj.trackSid = message.trackSid);
    message.muted !== undefined && (obj.muted = message.muted);
    return obj;
  },
};

export const MuteRoomTrackResponse = {
  encode(message: MuteRoomTrackResponse, writer: Writer = Writer.create()): Writer {
    if (message.track !== undefined && message.track !== undefined) {
      TrackInfo.encode(message.track, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): MuteRoomTrackResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
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
  fromPartial(object: DeepPartial<MuteRoomTrackResponse>): MuteRoomTrackResponse {
    const message = { ...baseMuteRoomTrackResponse } as MuteRoomTrackResponse;
    if (object.track !== undefined && object.track !== null) {
      message.track = TrackInfo.fromPartial(object.track);
    } else {
      message.track = undefined;
    }
    return message;
  },
  toJSON(message: MuteRoomTrackResponse): unknown {
    const obj: any = {};
    message.track !== undefined && (obj.track = message.track ? TrackInfo.toJSON(message.track) : undefined);
    return obj;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;