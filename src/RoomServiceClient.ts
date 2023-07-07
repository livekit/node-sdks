import type { DataPacket_Kind, DeepPartial, TrackInfo } from './proto/livekit_models';
import { ParticipantInfo, ParticipantPermission, Room } from './proto/livekit_models';
import {
  CreateRoomRequest,
  DeleteRoomRequest,
  ListParticipantsRequest,
  ListParticipantsResponse,
  ListRoomsRequest,
  ListRoomsResponse,
  MuteRoomTrackRequest,
  MuteRoomTrackResponse,
  RoomEgress,
  RoomParticipantIdentity,
  SendDataRequest,
  UpdateParticipantRequest,
  UpdateRoomMetadataRequest,
  UpdateSubscriptionsRequest,
} from './proto/livekit_room';
import ServiceBase from './ServiceBase';
import { livekitPackage, Rpc, TwirpRpc } from './TwirpRPC';

/**
 * Options for when creating a room
 */
export interface CreateOptions {
  /**
   * name of the room. required
   */
  name: string;

  /**
   * number of seconds the room should clean up after being empty
   */
  emptyTimeout?: number;

  /**
   * limit to the number of participants in a room at a time
   */
  maxParticipants?: number;

  /**
   * initial room metadata
   */
  metadata?: string;

  /**
   * add egress options
   */
  egress?: RoomEgress;

  /**
   * override the node room is allocated to, for debugging
   * does not work with Cloud
   */
  nodeId?: string;
}

export type SendDataOptions = { destinationSids?: string[]; topic?: string };

const svc = 'RoomService';

/**
 * Client to access Room APIs
 */
export class RoomServiceClient extends ServiceBase {
  private readonly rpc: Rpc;

  /**
   *
   * @param host hostname including protocol. i.e. 'https://cluster.livekit.io'
   * @param apiKey API Key, can be set in env var LIVEKIT_API_KEY
   * @param secret API Secret, can be set in env var LIVEKIT_API_SECRET
   */
  constructor(host: string, apiKey?: string, secret?: string) {
    super(apiKey, secret);
    this.rpc = new TwirpRpc(host, livekitPackage);
  }

  /**
   * Creates a new room. Explicit room creation is not required, since rooms will
   * be automatically created when the first participant joins. This method can be
   * used to customize room settings.
   * @param options
   */
  async createRoom(options: CreateOptions): Promise<Room> {
    const data = await this.rpc.request(
      svc,
      'CreateRoom',
      CreateRoomRequest.toJSON(CreateRoomRequest.fromPartial(options)),
      this.authHeader({ roomCreate: true }),
    );
    return Room.fromJSON(data);
  }

  /**
   * List active rooms
   * @param names when undefined or empty, list all rooms.
   *              otherwise returns rooms with matching names
   * @returns
   */
  async listRooms(names?: string[]): Promise<Room[]> {
    const data = await this.rpc.request(
      svc,
      'ListRooms',
      ListRoomsRequest.toJSON({ names: names ?? [] }),
      this.authHeader({ roomList: true }),
    );
    const res = ListRoomsResponse.fromJSON(data);
    return res.rooms ?? [];
  }

  async deleteRoom(room: string): Promise<void> {
    await this.rpc.request(
      svc,
      'DeleteRoom',
      DeleteRoomRequest.toJSON({ room }),
      this.authHeader({ roomCreate: true }),
    );
  }

  /**
   * Update metadata of a room
   * @param room name of the room
   * @param metadata the new metadata for the room
   */
  async updateRoomMetadata(room: string, metadata: string) {
    const data = await this.rpc.request(
      svc,
      'UpdateRoomMetadata',
      UpdateRoomMetadataRequest.toJSON({ room, metadata }),
      this.authHeader({ roomAdmin: true, room }),
    );
    return Room.fromJSON(data);
  }

  /**
   * List participants in a room
   * @param room name of the room
   */
  async listParticipants(room: string): Promise<ParticipantInfo[]> {
    const data = await this.rpc.request(
      svc,
      'ListParticipants',
      ListParticipantsRequest.toJSON({ room }),
      this.authHeader({ roomAdmin: true, room }),
    );
    const res = ListParticipantsResponse.fromJSON(data);
    return res.participants ?? [];
  }

  /**
   * Get information on a specific participant, including the tracks that participant
   * has published
   * @param room name of the room
   * @param identity identity of the participant to return
   */
  async getParticipant(room: string, identity: string): Promise<ParticipantInfo> {
    const data = await this.rpc.request(
      svc,
      'GetParticipant',
      RoomParticipantIdentity.toJSON({ room, identity }),
      this.authHeader({ roomAdmin: true, room }),
    );

    return ParticipantInfo.fromJSON(data);
  }

  /**
   * Removes a participant in the room. This will disconnect the participant
   * and will emit a Disconnected event for that participant.
   * Even after being removed, the participant can still re-join the room.
   * @param room
   * @param identity
   */
  async removeParticipant(room: string, identity: string): Promise<void> {
    await this.rpc.request(
      svc,
      'RemoveParticipant',
      RoomParticipantIdentity.toJSON({ room, identity }),
      this.authHeader({ roomAdmin: true, room }),
    );
  }

  /**
   * Mutes a track that the participant has published.
   * @param room
   * @param identity
   * @param trackSid sid of the track to be muted
   * @param muted true to mute, false to unmute
   */
  async mutePublishedTrack(
    room: string,
    identity: string,
    trackSid: string,
    muted: boolean,
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
      this.authHeader({ roomAdmin: true, room }),
    );
    const res = MuteRoomTrackResponse.fromJSON(data);
    return res.track!;
  }

  /**
   * Updates a participant's metadata or permissions
   * @param room
   * @param identity
   * @param metadata optional, metadata to update
   * @param permission optional, new permissions to assign to participant
   * @param name optional, new name for participant
   */
  async updateParticipant(
    room: string,
    identity: string,
    metadata?: string,
    permission?: DeepPartial<ParticipantPermission>,
    name?: string,
  ): Promise<ParticipantInfo> {
    const req: UpdateParticipantRequest = {
      room,
      identity,
      metadata: metadata || '',
      name: name || '',
    };
    if (permission) {
      req.permission = ParticipantPermission.fromPartial(permission);
    }
    const data = await this.rpc.request(
      svc,
      'UpdateParticipant',
      UpdateParticipantRequest.toJSON(req),
      this.authHeader({ roomAdmin: true, room }),
    );
    return ParticipantInfo.fromJSON(data);
  }

  /**
   * Updates a participant's subscription to tracks
   * @param room
   * @param identity
   * @param trackSids
   * @param subscribe true to subscribe, false to unsubscribe
   */
  async updateSubscriptions(
    room: string,
    identity: string,
    trackSids: string[],
    subscribe: boolean,
  ): Promise<void> {
    const req = UpdateSubscriptionsRequest.toJSON({
      room,
      identity,
      trackSids,
      subscribe,
      participantTracks: [],
    });
    await this.rpc.request(
      svc,
      'UpdateSubscriptions',
      req,
      this.authHeader({ roomAdmin: true, room }),
    );
  }

  /**
   * Sends data message to participants in the room
   * @param room
   * @param data opaque payload to send
   * @param kind delivery reliability
   * @param options optionally specify a topic and destinationSids (when destinationSids is empty, message is sent to everyone)
   */
  async sendData(
    room: string,
    data: Uint8Array,
    kind: DataPacket_Kind,
    options: SendDataOptions,
  ): Promise<void>;
  /**
   * Sends data message to participants in the room
   * @param room
   * @param data opaque payload to send
   * @param kind delivery reliability
   * @param destinationSids optional. when empty, message is sent to everyone
   */
  async sendData(
    room: string,
    data: Uint8Array,
    kind: DataPacket_Kind,
    destinationSids?: string[],
  ): Promise<void>;
  async sendData(
    room: string,
    data: Uint8Array,
    kind: DataPacket_Kind,
    options: SendDataOptions | string[] = {},
  ): Promise<void> {
    const destinationSids = Array.isArray(options) ? options : options.destinationSids;
    const topic = Array.isArray(options) ? undefined : options.topic;
    const req = SendDataRequest.toJSON({
      room,
      data,
      kind,
      destinationSids: destinationSids ?? [],
      topic,
    });
    await this.rpc.request(svc, 'SendData', req, this.authHeader({ roomAdmin: true, room }));
  }
}
