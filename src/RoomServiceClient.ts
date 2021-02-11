import { AccessToken } from './AccessToken';
import { VideoGrant } from './grants';
import { ParticipantInfo, Room, TrackInfo } from './proto/model';
import {
  CreateRoomRequest,
  DeleteRoomRequest,
  ListParticipantsRequest,
  ListParticipantsResponse,
  ListRoomsRequest,
  ListRoomsResponse,
  MuteRoomTrackRequest,
  MuteRoomTrackResponse,
  RoomParticipantIdentity,
} from './proto/room';
import { TwirpRpc } from './TwirpRPC';

interface Rpc {
  request(
    service: string,
    method: string,
    data: any,
    headers?: any
  ): Promise<string>;
}

const livekitPackage = 'livekit';

export interface CreateOptions {
  name: string;
  /**
   *  number of seconds the room should cleanup after being empty
   */
  emptyTimeout?: number;
  maxParticipants?: number;
  /**
   *  override the node room is allocated to, for debugging
   */
  nodeId?: string;
}

const svc = 'RoomService';

export class RoomServiceClient {
  private readonly rpc: Rpc;
  private apiKey?: string;
  private secret?: string;

  constructor(host: string, apiKey?: string, secret?: string) {
    this.rpc = new TwirpRpc(host, livekitPackage);
    this.apiKey = apiKey;
    this.secret = secret;
  }

  async createRoom(options: CreateOptions): Promise<Room> {
    const data = await this.rpc.request(
      svc,
      'CreateRoom',
      CreateRoomRequest.toJSON(CreateRoomRequest.fromPartial(options)),
      this.authHeader({ roomCreate: true })
    );
    return Room.fromJSON(data);
  }

  async listRooms(): Promise<Room[]> {
    const data = await this.rpc.request(
      svc,
      'ListRooms',
      ListRoomsRequest.toJSON({}),
      this.authHeader({ roomList: true })
    );
    const res = ListRoomsResponse.fromJSON(data);
    return res.rooms;
  }

  async deleteRoom(room: string): Promise<void> {
    await this.rpc.request(
      svc,
      'DeleteRoom',
      DeleteRoomRequest.toJSON({ room }),
      this.authHeader({ roomCreate: true })
    );
  }

  async listParticipants(room: string): Promise<ParticipantInfo[]> {
    const data = await this.rpc.request(
      svc,
      'ListParticipants',
      ListParticipantsRequest.toJSON({ room }),
      this.authHeader({ roomAdmin: true, room: room })
    );
    const res = ListParticipantsResponse.fromJSON(data);
    return res.participants;
  }

  async getParticipant(
    room: string,
    identity: string
  ): Promise<ParticipantInfo> {
    const data = await this.rpc.request(
      svc,
      'GetParticipant',
      RoomParticipantIdentity.toJSON({ room, identity }),
      this.authHeader({ roomAdmin: true, room: room })
    );

    return ParticipantInfo.fromJSON(data);
  }

  async removeParticipant(room: string, identity: string): Promise<void> {
    await this.rpc.request(
      svc,
      'RemoveParticipant',
      RoomParticipantIdentity.toJSON({ room, identity }),
      this.authHeader({ roomAdmin: true, room: room })
    );
  }

  async mutePublishedTrack(
    room: string,
    identity: string,
    trackSid: string,
    muted: boolean
  ): Promise<TrackInfo> {
    const req = MuteRoomTrackRequest.toJSON({
      room,
      identity,
      trackSid,
      muted,
    });
    const data = await this.rpc.request(
      svc,
      'MutePublishedTrack',
      req,
      this.authHeader({ roomAdmin: true, room: room })
    );
    const res = MuteRoomTrackResponse.fromJSON(data);
    return res.track!;
  }

  private authHeader(grant: VideoGrant): any {
    const at = new AccessToken(this.apiKey, this.secret, { ttl: '10m' });
    at.addGrant(grant);
    return {
      Authorization: 'Bearer ' + at.toJwt(),
    };
  }
}
