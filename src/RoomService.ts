import { AccessToken } from './AccessToken';
import { VideoGrant } from './grants';
import { Room } from './proto/model';
import {
  CreateRoomRequest,
  DeleteRoomRequest,
  DeleteRoomResponse,
  ListRoomsRequest,
  ListRoomsResponse,
  RoomService,
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

export function NewRoomService(
  host: string,
  apiKey: string,
  secret: string
): RoomService {
  return new RoomServiceClientImpl(host, apiKey, secret);
}

const livekitPackage = 'livekit';

export class RoomServiceClientImpl implements RoomService {
  private readonly rpc: Rpc;
  private apiKey: string;
  private secret: string;

  constructor(host: string, apiKey: string, secret: string) {
    this.rpc = new TwirpRpc(host, livekitPackage);
    this.apiKey = apiKey;
    this.secret = secret;
  }

  async CreateRoom(request: CreateRoomRequest): Promise<Room> {
    const data = await this.rpc.request(
      'RoomService',
      'CreateRoom',
      CreateRoomRequest.toJSON(request),
      this.authHeader({ roomCreate: true })
    );
    return Room.fromJSON(data);
  }

  async ListRooms(request: ListRoomsRequest): Promise<ListRoomsResponse> {
    const data = await this.rpc.request(
      'RoomService',
      'ListRooms',
      ListRoomsRequest.toJSON(request),
      this.authHeader({ roomList: true })
    );
    return ListRoomsResponse.fromJSON(data);
  }

  async DeleteRoom(request: DeleteRoomRequest): Promise<DeleteRoomResponse> {
    const data = await this.rpc.request(
      'RoomService',
      'DeleteRoom',
      DeleteRoomRequest.toJSON(request),
      this.authHeader({ roomCreate: true })
    );
    return DeleteRoomResponse.fromJSON(data);
  }

  private authHeader(grant: VideoGrant): any {
    const at = new AccessToken(this.apiKey, this.secret, { ttl: '10m' });
    at.addGrant(grant);
    return {
      Authorization: 'Bearer ' + at.toJwt(),
    };
  }
}
