// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import { FfiClient, FfiClientEvent, FfiHandle } from './ffi_client.js';
import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { FfiEvent } from './proto/ffi_pb.js';
import { LocalParticipant, Participant, RemoteParticipant } from './participant.js';
import {
  ConnectCallback,
  ConnectRequest,
  ConnectResponse,
  ConnectionQuality,
  ConnectionState,
  ContinualGatheringPolicy,
  DataPacketKind,
  DisconnectResponse,
  IceServer,
  IceTransportType,
  RoomInfo,
} from './proto/room_pb.js';
import { E2EEManager, E2EEOptions, defaultE2EEOptions } from './e2ee.js';
import { OwnedParticipant } from './proto/participant_pb.js';
import {
  LocalTrackPublication,
  RemoteTrackPublication,
  TrackPublication,
} from './track_publication.js';
import { LocalTrack, RemoteAudioTrack, RemoteTrack, RemoteVideoTrack } from './track.js';
import { TrackKind } from './proto/track_pb.js';
import { EncryptionState } from './proto/e2ee_pb.js';

export interface RtcConfiguration {
  iceTransportType: IceTransportType;
  continualGatheringPolicy: ContinualGatheringPolicy;
  iceServers: IceServer[];
}

export const defaultRtcConfiguration: RtcConfiguration = {
  iceTransportType: IceTransportType.TRANSPORT_ALL,
  continualGatheringPolicy: ContinualGatheringPolicy.GATHER_CONTINUALLY,
  iceServers: [],
};

export interface RoomOptions {
  autoSubscribe: boolean;
  dynacast: boolean;
  e2ee?: E2EEOptions;
  rtcConfig?: RtcConfiguration;
}

export const defaultRoomOptions: RoomOptions = {
  autoSubscribe: true,
  dynacast: false,
  e2ee: undefined,
  rtcConfig: undefined,
};

export class Room extends (EventEmitter as new () => TypedEmitter<RoomCallbacks>) {
  private info: RoomInfo;
  private ffiHandle?: FfiHandle;

  e2eeManager: E2EEManager;
  connectionState: ConnectionState = ConnectionState.CONN_DISCONNECTED;

  remoteParticipants: Map<string, RemoteParticipant> = new Map();
  localParticipant?: LocalParticipant;

  constructor() {
    super();
  }

  get name(): string {
    return this.info.name;
  }

  get metadata(): string {
    return this.info.metadata;
  }

  get isConnected(): boolean {
    return this.ffiHandle != undefined && this.connectionState != ConnectionState.CONN_DISCONNECTED;
  }

  async getSid(): Promise<string> {
    return this.info.sid; // TODO update this to handle async room updates once rust protocol has been updated
  }

  async connect(url: string, token: string, opts?: RoomOptions) {
    const options = { ...defaultRoomOptions, ...opts };

    let req = new ConnectRequest({
      url: url,
      token: token,
      options: {
        autoSubscribe: options.autoSubscribe,
        dynacast: options.dynacast,
        e2ee: {
          encryptionType: options.e2ee?.encryptionType,
          keyProviderOptions: {
            failureTolerance: options.e2ee?.keyProviderOptions?.failureTolerance,
            ratchetSalt: options.e2ee?.keyProviderOptions?.ratchetSalt,
            ratchetWindowSize: options.e2ee?.keyProviderOptions?.ratchetWindowSize,
            sharedKey: options.e2ee?.keyProviderOptions?.sharedKey,
          },
        },
      },
    });

    let res = FfiClient.instance.request<ConnectResponse>({
      message: {
        case: 'connect',
        value: req,
      },
    });

    let cb = await FfiClient.instance.waitFor<ConnectCallback>((ev: FfiEvent) => {
      return ev.message.case == 'connect' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new ConnectError(cb.error);
    }

    this.ffiHandle = new FfiHandle(cb.room.handle.id);
    this.e2eeManager = new E2EEManager(this.ffiHandle.handle, options.e2ee);

    this.info = cb.room.info;
    this.connectionState = ConnectionState.CONN_CONNECTED;
    this.localParticipant = new LocalParticipant(cb.localParticipant);

    for (let pt of cb.participants) {
      let rp = this.createRemoteParticipant(pt.participant);

      for (let pub of pt.publications) {
        let publication = new RemoteTrackPublication(pub);
        rp.trackPublications.set(publication.sid, publication);
      }
    }

    FfiClient.instance.on(FfiClientEvent.FfiEvent, this.onFfiEvent);
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    FfiClient.instance.request<DisconnectResponse>({
      message: {
        case: 'disconnect',
        value: {
          roomHandle: this.ffiHandle.handle,
        },
      },
    });
  }

  private onFfiEvent = (ffiEvent: FfiEvent) => {
    if (
      ffiEvent.message.case != 'roomEvent' ||
      ffiEvent.message.value.roomHandle != this.ffiHandle.handle
    ) {
      return;
    }

    let ev = ffiEvent.message.value.message;
    if (ev.case == 'participantConnected') {
      let participant = this.createRemoteParticipant(ev.value.info);
      this.remoteParticipants.set(participant.identity, participant);
      this.emit(RoomEvent.ParticipantConnected, participant);
    } else if (ev.case == 'participantDisconnected') {
      let participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      this.remoteParticipants.delete(participant.identity);
      this.emit(RoomEvent.ParticipantDisconnected, participant);
    } else if (ev.case == 'localTrackPublished') {
      let publication = this.localParticipant.trackPublications.get(ev.value.trackSid);
      this.emit(RoomEvent.LocalTrackPublished, publication, publication.track);
    } else if (ev.case == 'localTrackUnpublished') {
      let publication = this.localParticipant.trackPublications.get(ev.value.publicationSid);
      this.localParticipant.trackPublications.delete(ev.value.publicationSid);
      this.emit(RoomEvent.LocalTrackUnpublished, publication);
    } else if (ev.case == 'trackPublished') {
      let participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      let publication = new RemoteTrackPublication(ev.value.publication);
      participant.trackPublications.set(publication.sid, publication);
      this.emit(RoomEvent.TrackPublished, publication, participant);
    } else if (ev.case == 'trackUnpublished') {
      let participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      let publication = participant.trackPublications.get(ev.value.publicationSid);
      participant.trackPublications.delete(ev.value.publicationSid);
      this.emit(RoomEvent.TrackUnpublished, publication, participant);
    } else if (ev.case == 'trackSubscribed') {
      let ownedTrack = ev.value.track;
      let participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      let publication = participant.trackPublications.get(ownedTrack.info.sid);
      publication.subscribed = true;
      if (ownedTrack.info.kind == TrackKind.KIND_VIDEO) {
        publication.track = new RemoteVideoTrack(ownedTrack);
      } else if (ownedTrack.info.kind == TrackKind.KIND_AUDIO) {
        publication.track = new RemoteAudioTrack(ownedTrack);
      }

      this.emit(RoomEvent.TrackSubscribed, publication.track, publication, participant);
    } else if (ev.case == 'trackUnsubscribed') {
      let participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      let publication = participant.trackPublications.get(ev.value.trackSid);
      publication.track = undefined;
      publication.subscribed = false;
      this.emit(RoomEvent.TrackUnsubscribed, publication.track, publication, participant);
    } else if (ev.case == 'trackSubscriptionFailed') {
      let participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      this.emit(RoomEvent.TrackSubscriptionFailed, participant, ev.value.trackSid, ev.value.error);
    } else if (ev.case == 'trackMuted') {
      let participant = this.retrieveParticipant(ev.value.participantSid);
      let publication = participant.trackPublications.get(ev.value.trackSid);
      publication.info.muted = true;
      if (publication.track) {
        publication.track.info.muted = true;
      }
      this.emit(RoomEvent.TrackMuted, participant, publication);
    } else if (ev.case == 'trackUnmuted') {
      let participant = this.retrieveParticipant(ev.value.participantSid);
      let publication = participant.trackPublications.get(ev.value.trackSid);
      publication.info.muted = false;
      if (publication.track) {
        publication.track.info.muted = false;
      }
      this.emit(RoomEvent.TrackUnmuted, participant, publication);
    } else if (ev.case == 'activeSpeakersChanged') {
      let activeSpeakers = ev.value.participantSids.map((sid) =>
        this.getRemoteParticipantBySid(sid),
      );
      this.emit(RoomEvent.ActiveSpeakersChanged, activeSpeakers);
    } else if (ev.case == 'roomMetadataChanged') {
      let oldMetadata = this.info.metadata;
      this.info.metadata = ev.value.metadata;
      this.emit(RoomEvent.RoomMetadataChanged, oldMetadata, this.info.metadata);
    } else if (ev.case == 'participantMetadataChanged') {
      let participant = this.retrieveParticipant(ev.value.participantSid);
      let oldMetadata = participant.metadata;
      participant.info.metadata = ev.value.metadata;
      this.emit(
        RoomEvent.ParticipantMetadataChanged,
        participant,
        oldMetadata,
        participant.metadata,
      );
    } else if (ev.case == 'participantNameChanged') {
      let participant = this.retrieveParticipant(ev.value.participantSid);
      let oldName = participant.name;
      participant.info.name = ev.value.name;
      this.emit(RoomEvent.ParticipantNameChanged, participant, oldName, participant.name);
    } else if (ev.case == 'connectionQualityChanged') {
      let participant = this.retrieveParticipant(ev.value.participantSid);
      this.emit(RoomEvent.ConnectionQualityChanged, participant, ev.value.quality);
    } else if (ev.case == 'dataReceived') {
      // Can be undefined if the data is sent from a Server SDK
      let participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      let info = ev.value.data;
      let buffer = FfiClient.instance.copyBuffer(info.data.dataPtr, Number(info.data.dataLen));
      new FfiHandle(info.handle.id).dispose();
      this.emit(RoomEvent.DataReceived, buffer, ev.value.kind, participant);
    } else if (ev.case == 'e2eeStateChanged') {
      let participant = this.retrieveParticipant(ev.value.participantSid);
      this.emit(RoomEvent.E2EEStateChanged, participant, ev.value.state);
    } else if (ev.case == 'connectionStateChanged') {
      this.connectionState = ev.value.state;
      this.emit(RoomEvent.ConenctionStateChanged, this.connectionState);
      /*} else if (ev.case == 'connected') {
      this.emit(RoomEvent.Connected);*/
    } else if (ev.case == 'disconnected') {
      this.emit(RoomEvent.Disconnected);
    } else if (ev.case == 'reconnecting') {
      this.emit(RoomEvent.Reconnecting);
    } else if (ev.case == 'reconnected') {
      this.emit(RoomEvent.Reconnected);
    }
  };

  getRemoteParticipantBySid(sid: string) {
    return Array.from(this.remoteParticipants.values()).find((p) => p.sid === sid);
  }

  private retrieveParticipant(sid: string): Participant {
    if (this.localParticipant.sid === sid) {
      return this.localParticipant;
    } else {
      return this.getRemoteParticipantBySid(sid);
    }
  }

  private createRemoteParticipant(ownedInfo: OwnedParticipant) {
    if (this.remoteParticipants.has(ownedInfo.info.identity)) {
      throw new Error('Participant already exists');
    }

    const participant = new RemoteParticipant(ownedInfo);
    this.remoteParticipants.set(ownedInfo.info.identity, participant);
    return participant;
  }
}

export class ConnectError extends Error {
  constructor(message: string) {
    super(message);
  }
}

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
  trackMuted: (participant: Participant, publication: TrackPublication) => void;
  trackUnmuted: (participant: Participant, publication: TrackPublication) => void;
  activeSpeakersChanged: (speakers: RemoteParticipant[]) => void;
  roomMetadataChanged: (oldMetadata: string, metadata: string) => void;
  participantMetadataChanged: (
    participant: Participant,
    oldMetadata: string,
    metadata: string,
  ) => void;
  participantNameChanged: (participant: Participant, oldName: string, name: string) => void;
  connectionQualityChanged: (participant: Participant, quality: ConnectionQuality) => void;
  dataReceived: (data: Uint8Array, kind: DataPacketKind, participant?: RemoteParticipant) => void;
  e2eeStateChanged: (participant: Participant, state: EncryptionState) => void;
  connectionStateChanged: (state: ConnectionState) => void;
  connected: () => void;
  disconnected: () => void;
  reconnecting: () => void;
  reconnected: () => void;
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
