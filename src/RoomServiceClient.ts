import { AccessToken } from './AccessToken'
import { VideoGrant } from './grants'
import {ParticipantInfo, RecordingInput, RecordingOutput, Room, TrackInfo} from './proto/livekit_models'
import {
  CreateRoomRequest,
  DeleteRoomRequest, EndRecordingRequest,
  ListParticipantsRequest,
  ListParticipantsResponse,
  ListRoomsRequest,
  ListRoomsResponse,
  MuteRoomTrackRequest,
  MuteRoomTrackResponse,
  ParticipantPermission, RecordingResponse, RecordRoomRequest,
  RoomParticipantIdentity,
  UpdateParticipantRequest,
  UpdateSubscriptionsRequest
} from './proto/livekit_room'
import { TwirpRpc } from './TwirpRPC'

interface Rpc {
  request(
    service: string,
    method: string,
    data: any,
    headers?: any
  ): Promise<string>;
}

const livekitPackage = 'livekit';

/**
 * Options for when creating a room
 */
export interface CreateOptions {
  /**
   * name of the room. required
   */
  name: string;

  /**
   *  number of seconds the room should cleanup after being empty
   */
  emptyTimeout?: number;

  /**
   * limit to the number of participants in a room at a time
   */
  maxParticipants?: number;

  /**
   *  override the node room is allocated to, for debugging
   */
  nodeId?: string;
}

const svc = 'RoomService';

/**
 * Client to access Room APIs
 */
export class RoomServiceClient {
  private readonly rpc: Rpc;
  private apiKey?: string;
  private secret?: string;

  /**
   *
   * @param host hostname including protocol. i.e. 'https://cluster.livekit.io'
   * @param apiKey API Key, can be set in env var LIVEKIT_API_KEY
   * @param secret API Secret, can be set in env var LIVEKIT_API_SECRET
   */
  constructor(host: string, apiKey?: string, secret?: string) {
    this.rpc = new TwirpRpc(host, livekitPackage);
    this.apiKey = apiKey;
    this.secret = secret;
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

  /**
   * List participants in a room
   * @param room name of the room
   */
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

  /**
   * Get information on a specific participant, including the tracks that participant
   * has published
   * @param room name of the room
   * @param identity identity of the participant to return
   */
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
      this.authHeader({ roomAdmin: true, room: room })
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

  async updateParticipant(
    room: string,
    identity: string,
    metadata?: string,
    permission?: ParticipantPermission
  ): Promise<ParticipantInfo> {
    const req: UpdateParticipantRequest = {
      room,
      identity,
      metadata: metadata || '',
      permission,
    };
    const data = await this.rpc.request(
      svc,
      'UpdateParticipant',
      UpdateParticipantRequest.toJSON(req),
      this.authHeader({ roomAdmin: true, room: room })
    );
    return ParticipantInfo.fromJSON(data);
  }

  async updateSubscriptions(
    room: string,
    identity: string,
    trackSids: string[],
    subscribe: boolean
  ): Promise<void> {
    const req = UpdateSubscriptionsRequest.toJSON({
      room,
      identity,
      trackSids,
      subscribe,
    });
    await this.rpc.request(
      svc,
      'UpdateSubscriptions',
      req,
      this.authHeader({ roomAdmin: true, room: room })
    );
  }

  async startRecording(
    input: RecordingInput,
    output: RecordingOutput
  ): Promise<string> {
    const req = RecordRoomRequest.toJSON({
      input,
      output,
    });
    const data = await this.rpc.request(
      svc,
      'RecordRoom',
      req,
    );
    return RecordingResponse.fromJSON(data).recordingId!;
  }

  async endRecording(recordingId: string): Promise<void> {
    const req = EndRecordingRequest.toJSON({
      recordingId: recordingId,
    });
    await this.rpc.request(
      svc,
      'EndRoomRecording',
      req,
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
