import { AccessToken } from './AccessToken';
import { VideoGrant } from './grants';
import { Room } from './proto/model';
import {
  CreateRoomRequest,
  DeleteRoomRequest,
  ListRoomsRequest,
  ListRoomsResponse,
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
      'RoomService',
      'CreateRoom',
      CreateRoomRequest.toJSON(CreateRoomRequest.fromPartial(options)),
      this.authHeader({ roomCreate: true })
    );
    return Room.fromJSON(data);
  }

  async listRooms(): Promise<Room[]> {
    const data = await this.rpc.request(
      'RoomService',
      'ListRooms',
      ListRoomsRequest.toJSON({}),
      this.authHeader({ roomList: true })
    );
    const res = ListRoomsResponse.fromJSON(data);
    return res.rooms;
  }

  async deleteRoom(room: string): Promise<void> {
    await this.rpc.request(
      'RoomService',
      'DeleteRoom',
      DeleteRoomRequest.toJSON({ room: room }),
      this.authHeader({ roomCreate: true })
    );
  }

  private authHeader(grant: VideoGrant): any {
    const at = new AccessToken(this.apiKey, this.secret, { ttl: '10m' });
    at.addGrant(grant);
    return {
      Authorization: 'Bearer ' + at.toJwt(),
    };
  }
}
