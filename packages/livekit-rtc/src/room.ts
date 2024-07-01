// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import EventEmitter from 'events';
import type TypedEmitter from 'typed-emitter';
import type { E2EEOptions } from './e2ee.js';
import { E2EEManager } from './e2ee.js';
import { FfiClient, FfiClientEvent, FfiHandle } from './ffi_client.js';
import type { Participant } from './participant.js';
import { LocalParticipant, RemoteParticipant } from './participant.js';
import { EncryptionState } from './proto/e2ee_pb.js';
import type { FfiEvent } from './proto/ffi_pb.js';
import type { OwnedParticipant } from './proto/participant_pb.js';
import type {
  ConnectCallback,
  ConnectResponse,
  ConnectionQuality,
  DataPacketKind,
  DisconnectResponse,
  IceServer,
  RoomInfo,
} from './proto/room_pb.js';
import {
  ConnectRequest,
  ConnectionState,
  ContinualGatheringPolicy,
  IceTransportType,
} from './proto/room_pb.js';
import { TrackKind } from './proto/track_pb.js';
import type { RemoteTrack } from './track.js';
import { RemoteAudioTrack, RemoteVideoTrack } from './track.js';
import type { LocalTrackPublication, TrackPublication } from './track_publication.js';
import { RemoteTrackPublication } from './track_publication.js';

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

    const req = new ConnectRequest({
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

    const res = FfiClient.instance.request<ConnectResponse>({
      message: {
        case: 'connect',
        value: req,
      },
    });

    const cb = await FfiClient.instance.waitFor<ConnectCallback>((ev: FfiEvent) => {
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

    for (const pt of cb.participants) {
      const rp = this.createRemoteParticipant(pt.participant);

      for (const pub of pt.publications) {
        const publication = new RemoteTrackPublication(pub);
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

    FfiClient.instance.removeListener(FfiClientEvent.FfiEvent, this.onFfiEvent);
    this.removeAllListeners();
  }

  private onFfiEvent = (ffiEvent: FfiEvent) => {
    if (
      ffiEvent.message.case != 'roomEvent' ||
      ffiEvent.message.value.roomHandle != this.ffiHandle.handle
    ) {
      return;
    }

    const ev = ffiEvent.message.value.message;
    if (ev.case == 'participantConnected') {
      const participant = this.createRemoteParticipant(ev.value.info);
      this.remoteParticipants.set(participant.identity, participant);
      this.emit(RoomEvent.ParticipantConnected, participant);
    } else if (ev.case == 'participantDisconnected') {
      const participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      this.remoteParticipants.delete(participant.identity);
      this.emit(RoomEvent.ParticipantDisconnected, participant);
    } else if (ev.case == 'localTrackPublished') {
      const publication = this.localParticipant.trackPublications.get(ev.value.trackSid);
      this.emit(RoomEvent.LocalTrackPublished, publication, this.localParticipant);
    } else if (ev.case == 'localTrackUnpublished') {
      const publication = this.localParticipant.trackPublications.get(ev.value.publicationSid);
      this.localParticipant.trackPublications.delete(ev.value.publicationSid);
      this.emit(RoomEvent.LocalTrackUnpublished, publication, this.localParticipant);
    } else if (ev.case == 'trackPublished') {
      const participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      const publication = new RemoteTrackPublication(ev.value.publication);
      participant.trackPublications.set(publication.sid, publication);
      this.emit(RoomEvent.TrackPublished, publication, participant);
    } else if (ev.case == 'trackUnpublished') {
      const participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      const publication = participant.trackPublications.get(ev.value.publicationSid);
      participant.trackPublications.delete(ev.value.publicationSid);
      this.emit(RoomEvent.TrackUnpublished, publication, participant);
    } else if (ev.case == 'trackSubscribed') {
      const ownedTrack = ev.value.track;
      const participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      const publication = participant.trackPublications.get(ownedTrack.info.sid);
      publication.subscribed = true;
      if (ownedTrack.info.kind == TrackKind.KIND_VIDEO) {
        publication.track = new RemoteVideoTrack(ownedTrack);
      } else if (ownedTrack.info.kind == TrackKind.KIND_AUDIO) {
        publication.track = new RemoteAudioTrack(ownedTrack);
      }

      this.emit(RoomEvent.TrackSubscribed, publication.track, publication, participant);
    } else if (ev.case == 'trackUnsubscribed') {
      const participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      const publication = participant.trackPublications.get(ev.value.trackSid);
      publication.track = undefined;
      publication.subscribed = false;
      this.emit(RoomEvent.TrackUnsubscribed, publication.track, publication, participant);
    } else if (ev.case == 'trackSubscriptionFailed') {
      const participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      this.emit(RoomEvent.TrackSubscriptionFailed, ev.value.trackSid, participant, ev.value.error);
    } else if (ev.case == 'trackMuted') {
      const participant = this.retrieveParticipant(ev.value.participantSid);
      const publication = participant.trackPublications.get(ev.value.trackSid);
      publication.info.muted = true;
      if (publication.track) {
        publication.track.info.muted = true;
      }
      this.emit(RoomEvent.TrackMuted, publication, participant);
    } else if (ev.case == 'trackUnmuted') {
      const participant = this.retrieveParticipant(ev.value.participantSid);
      const publication = participant.trackPublications.get(ev.value.trackSid);
      publication.info.muted = false;
      if (publication.track) {
        publication.track.info.muted = false;
      }
      this.emit(RoomEvent.TrackUnmuted, publication, participant);
    } else if (ev.case == 'activeSpeakersChanged') {
      const activeSpeakers = ev.value.participantSids.map((sid) =>
        this.getRemoteParticipantBySid(sid),
      );
      this.emit(RoomEvent.ActiveSpeakersChanged, activeSpeakers);
    } else if (ev.case == 'roomMetadataChanged') {
      this.info.metadata = ev.value.metadata;
      this.emit(RoomEvent.RoomMetadataChanged, this.info.metadata);
    } else if (ev.case == 'participantMetadataChanged') {
      const participant = this.retrieveParticipant(ev.value.participantSid);
      participant.info.metadata = ev.value.metadata;
      this.emit(RoomEvent.ParticipantMetadataChanged, participant.metadata, participant);
    } else if (ev.case == 'participantNameChanged') {
      const participant = this.retrieveParticipant(ev.value.participantSid);
      participant.info.name = ev.value.name;
      this.emit(RoomEvent.ParticipantNameChanged, participant.name, participant);
    } else if (ev.case == 'connectionQualityChanged') {
      const participant = this.retrieveParticipant(ev.value.participantSid);
      this.emit(RoomEvent.ConnectionQualityChanged, ev.value.quality, participant);
    } else if (ev.case == 'dataReceived') {
      // Can be undefined if the data is sent from a Server SDK
      const participant = this.getRemoteParticipantBySid(ev.value.participantSid);
      const info = ev.value.data;
      const buffer = FfiClient.instance.copyBuffer(info.data.dataPtr, Number(info.data.dataLen));
      new FfiHandle(info.handle.id).dispose();
      this.emit(RoomEvent.DataReceived, buffer, participant, ev.value.kind, ev.value.topic);
    } else if (ev.case == 'e2eeStateChanged') {
      if (ev.value.state == EncryptionState.INTERNAL_ERROR) {
        // throw generic error until Rust SDK is updated to supply the error alongside INTERNAL_ERROR
        this.emit(RoomEvent.EncryptionError, new Error('internal server error'));
      }
    } else if (ev.case == 'connectionStateChanged') {
      this.connectionState = ev.value.state;
      this.emit(RoomEvent.ConnectionStateChanged, this.connectionState);
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
  localTrackPublished: (publication: LocalTrackPublication, participant: LocalParticipant) => void;
  localTrackUnpublished: (
    publication: LocalTrackPublication,
    participant: LocalParticipant,
  ) => void;
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
    trackSid: string,
    participant: RemoteParticipant,
    reason?: string,
  ) => void;
  trackMuted: (publication: TrackPublication, participant: Participant) => void;
  trackUnmuted: (publication: TrackPublication, participant: Participant) => void;
  activeSpeakersChanged: (speakers: Participant[]) => void;
  roomMetadataChanged: (metadata: string) => void;
  participantMetadataChanged: (metadata: string | undefined, participant: Participant) => void;
  participantNameChanged: (name: string, participant: Participant) => void;
  connectionQualityChanged: (quality: ConnectionQuality, participant: Participant) => void;
  dataReceived: (
    payload: Uint8Array,
    participant?: RemoteParticipant,
    kind?: DataPacketKind,
    topic?: string,
  ) => void;
  encryptionError: (error: Error) => void;
  connectionStateChanged: (state: ConnectionState) => void;
  connected: () => void;
  disconnected: (reason?: string) => void;
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
  EncryptionError = 'encryptionError',
  ConnectionStateChanged = 'connectionStateChanged',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Reconnecting = 'reconnecting',
  Reconnected = 'reconnected',
}
