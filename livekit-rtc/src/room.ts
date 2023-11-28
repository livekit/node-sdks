import { FfiClient, FfiClientEvent, FfiHandle } from './ffi_client';
import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { FfiEvent, FfiRequest } from './proto/ffi_pb';
import { LocalParticipant, RemoteParticipant } from './participant';
import {
  ConnectCallback,
  ConnectRequest,
  ConnectResponse,
  ConnectionState,
  ContinualGatheringPolicy,
  IceServer,
  IceTransportType,
  RoomInfo,
} from './proto/room_pb';
import { E2EEManager, E2EEOptions } from './e2ee';
import { OwnedParticipant } from './proto/participant_pb';
import { LocalTrackPublication, RemoteTrackPublication } from './publication';
import { LocalTrack, RemoteAudioTrack, RemoteTrack, RemoteVideoTrack } from './track';
import { TrackKind } from './proto/track_pb';

export type RoomCallbacks = {
  participantConnected: (participant: RemoteParticipant) => void;
  participantDisconnected: (participant: RemoteParticipant) => void;
  localTrackPublished: (publication: LocalTrackPublication, track: LocalTrack) => void;
  localTrackUnpublished: (publication: LocalTrackPublication) => void;
  trackPublished: (publication: RemoteTrackPublication, participant: RemoteParticipant) => void;
  trackUnpublished: (publication: RemoteTrackPublication, participant: RemoteParticipant) => void;
  trackSubscribed: (
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant,
  ) => void;
  trackUnsubscribed: (
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant,
  ) => void;
  trackSubscriptionFailed: (
    participant: RemoteParticipant,
    publicationSid: string,
    error: string,
  ) => void;
  trackMuted: (participant: RemoteParticipant, publication: RemoteTrackPublication) => void;
  trackUnmuted: (participant: RemoteParticipant, publication: RemoteTrackPublication) => void;
};

export enum RoomEvent {
  ParticipantConnected = 'participantConnected',
  ParticipantDisconnected = 'participantDisconnected',
  LocalTrackPublished = 'localTrackPublished',
  LocalTrackUnpublished = 'localTrackUnpublished',
  TrackPublished = 'trackPublished',
  TrackUnpublished = 'trackUnpublished',
  TrackSubscribed = 'trackSubscribed',
  TrackUnsubscribed = 'trackUnsubscribed',
  TrackSubscriptionFailed = 'trackSubscriptionFailed',
  TrackMuted = 'trackMuted',
  TrackUnmuted = 'trackUnmuted',
  ActiveSpeakersChanged = 'activeSpeakersChanged',
  RoomMetadataChanged = 'roomMetadataChanged',
  ParticipantMetadataChanged = 'participantMetadataChanged',
  ParticipantNameChanged = 'participantNameChanged',
  ConnectionQualityChanged = 'connectionQualityChanged',
  DataReceived = 'dataReceived',
  E2EEStateChanged = 'e2eeStateChanged',
  ConenctionStateChanged = 'connectionStateChanged',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Reconnecting = 'reconnecting',
  Reconnected = 'reconnected',
}

export class RtcConfiguration {
  iceTransportType: IceTransportType = IceTransportType.TRANSPORT_ALL;
  continualGatheringPolicy: ContinualGatheringPolicy = ContinualGatheringPolicy.GATHER_CONTINUALLY;
  iceServers: IceServer[] = [];
}

export interface RoomOptions {
  autoSubscribe: boolean;
  dynacast: boolean;
  e2ee?: E2EEOptions;
  rtcConfig?: RtcConfiguration;
}

export class ConnectError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class Room extends (EventEmitter as new () => TypedEmitter<RoomCallbacks>) {
  private info: RoomInfo;
  private ffiHandle?: FfiHandle;
  e2eeManager: E2EEManager;
  connection_state: ConnectionState = ConnectionState.CONN_DISCONNECTED;

  participants: Map<string, RemoteParticipant> = new Map();
  localParticipant?: LocalParticipant;

  constructor() {
    super();
    FfiClient.instance.addListener(FfiClientEvent.FfiEvent, this.onFfiEvent);
  }

  get sid(): string {
    return this.info.sid;
  }

  get name(): string {
    return this.info.name;
  }

  get metadata(): string {
    return this.info.metadata;
  }

  get isConnected(): boolean {
    return (
      this.ffiHandle != undefined && this.connection_state != ConnectionState.CONN_DISCONNECTED
    );
  }

  async connect(url: string, token: string, options: RoomOptions) {
    let req = new ConnectRequest({
      url: url,
      token: token,
      options: options,
    });

    let res = FfiClient.instance.request<ConnectResponse>(
      new FfiRequest({
        message: {
          case: 'connect',
          value: req,
        },
      }),
    );

    let cb = await FfiClient.instance.waitFor<ConnectCallback>((ev: FfiEvent) => {
      return ev.message.case == 'connect' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new ConnectError(cb.error);
    }

    this.ffiHandle = new FfiHandle(cb.room.handle.id);
    this.e2eeManager = new E2EEManager(this.ffiHandle.handle, options.e2ee);

    this.info = cb.room.info;
    this.connection_state = ConnectionState.CONN_CONNECTED;
    this.localParticipant = new LocalParticipant(cb.localParticipant);

    for (let pt of cb.participants) {
      let rp = this.createRemoteParticipant(pt.participant);

      for (let pub of pt.publications) {
        let publication = new RemoteTrackPublication(pub);
        rp.tracks.set(publication.sid, publication);
      }
    }

    FfiClient.instance.on(FfiClientEvent.FfiEvent, this.onFfiEvent);
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    let req = new FfiRequest({
      message: {
        case: 'disconnect',
        value: {
          roomHandle: this.ffiHandle.handle,
        },
      },
    });

    FfiClient.instance.request(req);
  }

  onFfiEvent(ffiEvent: FfiEvent) {
    if (
      ffiEvent.message.case != 'roomEvent' ||
      ffiEvent.message.value.roomHandle != this.ffiHandle.handle
    ) {
      return;
    }

    let ev = ffiEvent.message.value.message;

    if (ev.case == 'participantConnected') {
      let rp = this.createRemoteParticipant(ev.value.info);
      this.participants.set(rp.sid, rp);
      this.emit(RoomEvent.ParticipantConnected, rp);
    } else if (ev.case == 'participantDisconnected') {
      let rp = this.participants.get(ev.value.participantSid);
      this.participants.delete(ev.value.participantSid);
      this.emit(RoomEvent.ParticipantDisconnected, rp);
    } else if (ev.case == 'localTrackPublished') {
      let lp = this.localParticipant.tracks.get(ev.value.trackSid);
      this.emit(RoomEvent.LocalTrackPublished, lp, lp.track);
    } else if (ev.case == 'localTrackUnpublished') {
      let lp = this.localParticipant.tracks.get(ev.value.publicationSid);
      this.localParticipant.tracks.delete(ev.value.publicationSid);
      this.emit(RoomEvent.LocalTrackUnpublished, lp);
    } else if (ev.case == 'trackPublished') {
      let rp = this.participants.get(ev.value.participantSid);
      let rpub = new RemoteTrackPublication(ev.value.publication);
      rp.tracks.set(rpub.sid, rpub);
      this.emit(RoomEvent.TrackPublished, rpub, rp);
    } else if (ev.case == 'trackUnpublished') {
      let rp = this.participants.get(ev.value.participantSid);
      let rpub = rp.tracks.get(ev.value.publicationSid);
      rp.tracks.delete(ev.value.publicationSid);
      this.emit(RoomEvent.TrackUnpublished, rpub, rp);
    } else if (ev.case == 'trackSubscribed') {
      let ownedTrack = ev.value.track;
      let trackInfo = ownedTrack.info;
      let rp = this.participants.get(ev.value.participantSid);
      let rpub = rp.tracks.get(trackInfo.sid);
      rpub.subscribed = true;
      if (trackInfo.kind == TrackKind.KIND_VIDEO) {
        rpub.track = new RemoteVideoTrack(ownedTrack);
      } else if (trackInfo.kind == TrackKind.KIND_AUDIO) {
        rpub.track = new RemoteAudioTrack(ownedTrack);
      }

      this.emit(RoomEvent.TrackSubscribed, rpub.track, rpub, rp);
    } else if (ev.case == 'trackUnsubscribed') {
      let rp = this.participants.get(ev.value.participantSid);
      let rpub = rp.tracks.get(ev.value.trackSid);
      rpub.track = undefined;
      rpub.subscribed = false;
      this.emit(RoomEvent.TrackUnsubscribed, rpub.track, rpub, rp);
    } else if (ev.case == 'trackSubscriptionFailed') {
      let sid = ev.value.participantSid;
      let rp = this.participants.get(sid);
      let error = ev.value.error;
      this.emit(RoomEvent.TrackSubscriptionFailed, rp, ev.value.trackSid, error);
    } else if (ev.case == 'trackMuted') {
      let rp = this.participants.get(ev.value.participantSid);
      let rpub = rp.tracks.get(ev.value.trackSid);
      rpub.info.muted = true;
      if (rpub.track) {
        rpub.track.info.muted = true;
      }
      this.emit(RoomEvent.TrackMuted, rp, rpub);
    } else if (ev.case == 'trackUnmuted') {
      let rp = this.participants.get(ev.value.participantSid);
      let rpub = rp.tracks.get(ev.value.trackSid);
      rpub.info.muted = false;
      if (rpub.track) {
        rpub.track.info.muted = false;
      }
      this.emit(RoomEvent.TrackUnmuted, rp, rpub);
    }
  }

  private createRemoteParticipant(ownedInfo: OwnedParticipant) {
    if (this.participants.has(ownedInfo.info.sid)) {
      throw new Error('Participant already exists');
    }

    let participant = new RemoteParticipant(ownedInfo);
    this.participants.set(ownedInfo.info.sid, participant);
    return participant;
  }
}
