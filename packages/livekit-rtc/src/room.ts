// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { TypedEventEmitter as TypedEmitter } from '@livekit/typed-emitter';
import EventEmitter from 'events';
import { ReadableStream } from 'node:stream/web';
import { ByteStreamReader, TextStreamReader } from './data_streams/stream_reader.js';
import type {
  ByteStreamHandler,
  ByteStreamInfo,
  StreamController,
  TextStreamHandler,
  TextStreamInfo,
} from './data_streams/types.js';
import type { E2EEOptions } from './e2ee.js';
import { E2EEManager, defaultE2EEOptions } from './e2ee.js';
import { FfiClient, FfiClientEvent, FfiHandle } from './ffi_client.js';
import { log } from './log.js';
import type { Participant } from './participant.js';
import { LocalParticipant, RemoteParticipant } from './participant.js';
import { EncryptionState } from './proto/e2ee_pb.js';
import type { FfiEvent } from './proto/ffi_pb.js';
import type { DisconnectReason, OwnedParticipant } from './proto/participant_pb.js';
import type { DataStream_Trailer } from './proto/room_pb.js';
import {
  type ConnectCallback,
  ConnectRequest,
  type ConnectResponse,
  type ConnectionQuality,
  ConnectionState,
  ContinualGatheringPolicy,
  type DataPacketKind,
  type DataStream_Chunk,
  type DataStream_Header,
  type DisconnectResponse,
  RoomOptions as FfiRoomOptions,
  type IceServer,
  IceTransportType,
  type RoomInfo,
} from './proto/room_pb.js';
import { TrackKind } from './proto/track_pb.js';
import type { LocalTrack, RemoteTrack } from './track.js';
import { RemoteAudioTrack, RemoteVideoTrack } from './track.js';
import type { LocalTrackPublication, TrackPublication } from './track_publication.js';
import { RemoteTrackPublication } from './track_publication.js';
import type { ChatMessage } from './types.js';
import { bigIntToNumber } from './utils.js';

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

export const defaultRoomOptions = new FfiRoomOptions({
  autoSubscribe: true,
  dynacast: false,
  e2ee: undefined,
  rtcConfig: undefined,
  adaptiveStream: false,
  joinRetries: 1,
});

export class Room extends (EventEmitter as new () => TypedEmitter<RoomCallbacks>) {
  private info?: RoomInfo;
  private ffiHandle?: FfiHandle;

  private byteStreamControllers = new Map<string, StreamController<DataStream_Chunk>>();
  private textStreamControllers = new Map<string, StreamController<DataStream_Chunk>>();
  private byteStreamHandlers = new Map<string, ByteStreamHandler>();
  private textStreamHandlers = new Map<string, TextStreamHandler>();

  e2eeManager?: E2EEManager;
  connectionState: ConnectionState = ConnectionState.CONN_DISCONNECTED;

  remoteParticipants: Map<string, RemoteParticipant> = new Map();
  localParticipant?: LocalParticipant;

  constructor() {
    super();
  }

  get name(): string | undefined {
    return this.info?.name;
  }

  get metadata(): string | undefined {
    return this.info?.metadata;
  }

  get isConnected(): boolean {
    return this.ffiHandle != undefined && this.connectionState != ConnectionState.CONN_DISCONNECTED;
  }

  async getSid(): Promise<string> {
    if (!this.isConnected) {
      return '';
    }
    if (this.info?.sid && this.info.sid !== '') {
      return this.info.sid;
    }
    return new Promise((resolve, reject) => {
      const handleRoomUpdate = (sid: string) => {
        if (sid !== '') {
          this.off(RoomEvent.RoomSidChanged, handleRoomUpdate);
          resolve(sid);
        }
      };
      this.on(RoomEvent.RoomSidChanged, handleRoomUpdate);
      this.once(RoomEvent.Disconnected, () => {
        this.off(RoomEvent.RoomSidChanged, handleRoomUpdate);
        reject('Room disconnected before room server id was available');
      });
    });
  }

  async connect(url: string, token: string, opts?: RoomOptions) {
    const options = { ...defaultRoomOptions, ...opts };
    const e2eeOptions = { ...defaultE2EEOptions, ...options.e2ee };

    const req = new ConnectRequest({
      url: url,
      token: token,
      options,
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

    switch (cb.message.case) {
      case 'result':
        this.ffiHandle = new FfiHandle(cb.message.value.room!.handle!.id!);
        this.e2eeManager = options.e2ee && new E2EEManager(this.ffiHandle.handle, e2eeOptions);

        this.info = cb.message.value.room!.info;
        this.connectionState = ConnectionState.CONN_CONNECTED;
        this.localParticipant = new LocalParticipant(cb.message.value.localParticipant!);

        for (const pt of cb.message.value.participants) {
          const rp = this.createRemoteParticipant(pt.participant!);

          for (const pub of pt.publications) {
            const publication = new RemoteTrackPublication(pub);
            rp.trackPublications.set(publication.sid!, publication);
          }
        }

        FfiClient.instance.on(FfiClientEvent.FfiEvent, this.onFfiEvent);
        break;
      case 'error':
      default:
        throw new ConnectError(cb.message.value || '');
    }
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    FfiClient.instance.request<DisconnectResponse>({
      message: {
        case: 'disconnect',
        value: {
          roomHandle: this.ffiHandle?.handle,
        },
      },
    });

    FfiClient.instance.removeListener(FfiClientEvent.FfiEvent, this.onFfiEvent);
    this.removeAllListeners();
  }

  registerTextStreamHandler(topic: string, callback: TextStreamHandler) {
    if (this.textStreamHandlers.has(topic)) {
      throw new Error(`A text stream handler for topic "${topic}" has already been set.`);
    }
    this.textStreamHandlers.set(topic, callback);
  }

  unregisterTextStreamHandler(topic: string) {
    this.textStreamHandlers.delete(topic);
  }

  registerByteStreamHandler(topic: string, callback: ByteStreamHandler) {
    if (this.byteStreamHandlers.has(topic)) {
      throw new Error(`A byte stream handler for topic "${topic}" has already been set.`);
    }
    this.byteStreamHandlers.set(topic, callback);
  }

  unregisterByteStreamHandler(topic: string) {
    this.byteStreamHandlers.delete(topic);
  }

  private onFfiEvent = (ffiEvent: FfiEvent) => {
    if (!this.localParticipant || !this.ffiHandle || !this.info) {
      throw TypeError('cannot handle ffi events before connectCallback');
    }

    if (ffiEvent.message.case == 'rpcMethodInvocation') {
      if (
        ffiEvent.message.value.localParticipantHandle == this.localParticipant.ffi_handle.handle
      ) {
        this.localParticipant.handleRpcMethodInvocation(
          ffiEvent.message.value.invocationId!,
          ffiEvent.message.value.method!,
          ffiEvent.message.value.requestId!,
          ffiEvent.message.value.callerIdentity!,
          ffiEvent.message.value.payload!,
          ffiEvent.message.value.responseTimeoutMs!,
        );
      }
      return;
    } else if (
      ffiEvent.message.case != 'roomEvent' ||
      ffiEvent.message.value.roomHandle != this.ffiHandle.handle
    ) {
      return;
    }

    const ev = ffiEvent.message.value.message;
    if (ev.case == 'participantConnected') {
      const participant = this.createRemoteParticipant(ev.value.info!);
      this.remoteParticipants.set(participant.identity!, participant);
      this.emit(RoomEvent.ParticipantConnected, participant);
    } else if (ev.case == 'participantDisconnected') {
      const participant = this.remoteParticipants.get(ev.value.participantIdentity!);
      this.remoteParticipants.delete(participant!.identity);
      participant!.info.disconnectReason = ev.value.disconnectReason;
      this.emit(RoomEvent.ParticipantDisconnected, participant!);
    } else if (ev.case == 'localTrackPublished') {
      const publication = this.localParticipant!.trackPublications.get(ev.value.trackSid!);
      this.emit(RoomEvent.LocalTrackPublished, publication!, this.localParticipant!);
    } else if (ev.case == 'localTrackUnpublished') {
      const publication = this.localParticipant!.trackPublications.get(ev.value.publicationSid!);
      this.localParticipant!.trackPublications.delete(ev.value.publicationSid!);
      this.emit(RoomEvent.LocalTrackUnpublished, publication!, this.localParticipant!);
    } else if (ev.case == 'localTrackSubscribed') {
      const publication = this.localParticipant!.trackPublications.get(ev.value.trackSid!);
      publication!.resolveFirstSubscription();
      this.emit(RoomEvent.LocalTrackSubscribed, publication!.track!);
    } else if (ev.case == 'trackPublished') {
      const participant = this.remoteParticipants.get(ev.value.participantIdentity!);
      const publication = new RemoteTrackPublication(ev.value.publication!);
      participant!.trackPublications.set(publication.sid!, publication);
      this.emit(RoomEvent.TrackPublished, publication, participant!);
    } else if (ev.case == 'trackUnpublished') {
      const participant = this.requireRemoteParticipant(ev.value.participantIdentity!);
      const publication = participant.trackPublications.get(ev.value.publicationSid!);
      participant.trackPublications.delete(ev.value.publicationSid!);
      if (publication) {
        this.emit(RoomEvent.TrackUnpublished, publication, participant);
      }
    } else if (ev.case == 'trackSubscribed') {
      const ownedTrack = ev.value.track!;
      const trackInfo = ownedTrack.info!;
      const { participant, publication } = this.requirePublicationOfRemoteParticipant(
        ev.value.participantIdentity!,
        trackInfo.sid!,
      );
      publication.subscribed = true;
      if (trackInfo.kind == TrackKind.KIND_VIDEO) {
        publication.track = new RemoteVideoTrack(ownedTrack);
      } else if (trackInfo.kind == TrackKind.KIND_AUDIO) {
        publication.track = new RemoteAudioTrack(ownedTrack);
      }

      this.emit(RoomEvent.TrackSubscribed, publication.track!, publication, participant);
    } else if (ev.case == 'trackUnsubscribed') {
      const { participant, publication } = this.requirePublicationOfRemoteParticipant(
        ev.value.participantIdentity!,
        ev.value.trackSid!,
      );
      const track = publication.track!;
      publication.track = undefined;
      publication.subscribed = false;
      this.emit(RoomEvent.TrackUnsubscribed, track, publication, participant);
    } else if (ev.case == 'trackSubscriptionFailed') {
      const participant = this.requireRemoteParticipant(ev.value.participantIdentity!);
      this.emit(RoomEvent.TrackSubscriptionFailed, ev.value.trackSid!, participant, ev.value.error);
    } else if (ev.case == 'trackMuted') {
      const { participant, publication } = this.requirePublicationOfParticipant(
        ev.value.participantIdentity!,
        ev.value.trackSid!,
      );
      publication.info!.muted = true;
      if (publication.track) {
        publication.track.info!.muted = true;
      }
      this.emit(RoomEvent.TrackMuted, publication, participant);
    } else if (ev.case == 'trackUnmuted') {
      const { participant, publication } = this.requirePublicationOfParticipant(
        ev.value.participantIdentity!,
        ev.value.trackSid!,
      );
      publication.info!.muted = false;
      if (publication.track) {
        publication.track.info!.muted = false;
      }
      this.emit(RoomEvent.TrackUnmuted, publication, participant);
    } else if (ev.case == 'activeSpeakersChanged') {
      const activeSpeakers = ev.value.participantIdentities.map((identity) =>
        this.requireParticipantByIdentity(identity),
      );
      this.emit(RoomEvent.ActiveSpeakersChanged, activeSpeakers);
    } else if (ev.case == 'roomMetadataChanged') {
      this.info!.metadata = ev.value.metadata;
      this.emit(RoomEvent.RoomMetadataChanged, this.info!.metadata!);
    } else if (ev.case == 'participantMetadataChanged') {
      const participant = this.requireParticipantByIdentity(ev.value.participantIdentity!);
      participant.info.metadata = ev.value.metadata;
      this.emit(RoomEvent.ParticipantMetadataChanged, participant.metadata, participant);
    } else if (ev.case == 'participantNameChanged') {
      const participant = this.requireParticipantByIdentity(ev.value.participantIdentity!);
      participant.info.name = ev.value.name;
      this.emit(RoomEvent.ParticipantNameChanged, participant.name!, participant);
    } else if (ev.case == 'participantAttributesChanged') {
      const participant = this.requireParticipantByIdentity(ev.value.participantIdentity!);
      participant.info.attributes = ev.value.attributes.reduce(
        (acc, value) => {
          acc[value.key!] = value.value!;
          return acc;
        },
        {} as Record<string, string>,
      );
      if (Object.keys(ev.value.changedAttributes).length > 0) {
        const changedAttributes = ev.value.changedAttributes.reduce(
          (acc, value) => {
            acc[value.key!] = value.value!;
            return acc;
          },
          {} as Record<string, string>,
        );
        this.emit(RoomEvent.ParticipantAttributesChanged, changedAttributes, participant);
      }
    } else if (ev.case == 'connectionQualityChanged') {
      const participant = this.requireParticipantByIdentity(ev.value.participantIdentity!);
      this.emit(RoomEvent.ConnectionQualityChanged, ev.value.quality!, participant);
    } else if (ev.case == 'chatMessage') {
      const participant = this.retrieveParticipantByIdentity(ev.value.participantIdentity!);
      const { id, message: messageText, timestamp, editTimestamp, generated } = ev.value.message!;
      const message: ChatMessage = {
        id: id!,
        message: messageText!,
        timestamp: Number(timestamp),
        editTimestamp: Number(editTimestamp),
        generated,
      };
      this.emit(RoomEvent.ChatMessage, message, participant);
    } else if (ev.case == 'dataPacketReceived') {
      // Can be undefined if the data is sent from a Server SDK
      const participant = this.remoteParticipants.get(ev.value.participantIdentity!);
      const dataPacket = ev.value.value;
      switch (dataPacket.case) {
        case 'user':
          const buffer = FfiClient.instance.copyBuffer(
            dataPacket.value.data!.data!.dataPtr!,
            Number(dataPacket.value.data!.data!.dataLen),
          );
          new FfiHandle(dataPacket.value.data!.handle!.id!).dispose();
          this.emit(
            RoomEvent.DataReceived,
            buffer,
            participant,
            ev.value.kind,
            dataPacket.value.topic,
          );
          break;
        case 'sipDtmf':
          const { code, digit } = dataPacket.value;
          this.emit(RoomEvent.DtmfReceived, code!, digit!, participant!);
          break;
        default:
          break;
      }
    } else if (ev.case == 'e2eeStateChanged') {
      if (ev.value.state == EncryptionState.INTERNAL_ERROR) {
        // throw generic error until Rust SDK is updated to supply the error alongside INTERNAL_ERROR
        this.emit(RoomEvent.EncryptionError, new Error('internal server error'));
      }
    } else if (ev.case == 'connectionStateChanged') {
      this.connectionState = ev.value.state!;
      this.emit(RoomEvent.ConnectionStateChanged, this.connectionState);
      /*} else if (ev.case == 'connected') {
      this.emit(RoomEvent.Connected);*/
    } else if (ev.case == 'disconnected') {
      this.emit(RoomEvent.Disconnected, ev.value.reason!);
    } else if (ev.case == 'reconnecting') {
      this.emit(RoomEvent.Reconnecting);
    } else if (ev.case == 'reconnected') {
      this.emit(RoomEvent.Reconnected);
    } else if (ev.case == 'roomSidChanged') {
      this.emit(RoomEvent.RoomSidChanged, ev.value.sid!);
    } else if (ev.case === 'streamHeaderReceived' && ev.value.header) {
      this.handleStreamHeader(ev.value.header, ev.value.participantIdentity!);
    } else if (ev.case === 'streamChunkReceived' && ev.value.chunk) {
      this.handleStreamChunk(ev.value.chunk);
    } else if (ev.case === 'streamTrailerReceived' && ev.value.trailer) {
      this.handleStreamTrailer(ev.value.trailer);
    }
  };

  private retrieveParticipantByIdentity(identity: string): Participant | undefined {
    if (this.localParticipant?.identity === identity) {
      return this.localParticipant;
    } else {
      return this.remoteParticipants.get(identity);
    }
  }

  private requireParticipantByIdentity(identity: string): Participant {
    if (this.localParticipant?.identity === identity) {
      return this.localParticipant;
    } else if (this.remoteParticipants.has(identity)) {
      return this.remoteParticipants.get(identity)!;
    } else {
      throw new TypeError(`participant ${identity} not found`);
    }
  }

  private requireRemoteParticipant(identity: string) {
    const participant = this.remoteParticipants.get(identity);
    if (!participant) {
      throw new TypeError(`participant ${identity} not found`);
    }
    return participant;
  }

  private requirePublicationOfParticipant(identity: string, trackSid: string) {
    const participant = this.requireParticipantByIdentity(identity);
    const publication = participant.trackPublications.get(trackSid);
    if (!publication) {
      throw new TypeError(`publication ${trackSid} not found`);
    }
    return { participant, publication };
  }

  private requirePublicationOfRemoteParticipant(identity: string, trackSid: string) {
    const participant = this.requireRemoteParticipant(identity);
    const publication = participant.trackPublications.get(trackSid);
    if (!publication) {
      throw new TypeError(`publication ${trackSid} not found`);
    }
    return { participant, publication };
  }

  private createRemoteParticipant(ownedInfo: OwnedParticipant) {
    if (this.remoteParticipants.has(ownedInfo.info!.identity!)) {
      throw new Error('Participant already exists');
    }

    const participant = new RemoteParticipant(ownedInfo);
    this.remoteParticipants.set(ownedInfo.info!.identity!, participant);
    return participant;
  }

  private handleStreamHeader(streamHeader: DataStream_Header, participantIdentity: string) {
    if (streamHeader.contentHeader.case === 'byteHeader') {
      const streamHandlerCallback = this.byteStreamHandlers.get(streamHeader.topic ?? '');

      if (!streamHandlerCallback) {
        log.debug('ignoring incoming byte stream due to no handler for topic', streamHeader.topic);
        return;
      }
      let streamController: ReadableStreamDefaultController<DataStream_Chunk>;
      const stream = new ReadableStream({
        start: (controller) => {
          streamController = controller;
          this.byteStreamControllers.set(streamHeader.streamId!, {
            header: streamHeader,
            controller: streamController,
            startTime: Date.now(),
          });
        },
      });
      const info: ByteStreamInfo = {
        streamId: streamHeader.streamId!,
        name: streamHeader.contentHeader.value.name ?? 'unknown',
        mimeType: streamHeader.mimeType!,
        totalSize: streamHeader.totalLength ? Number(streamHeader.totalLength) : undefined,
        topic: streamHeader.topic!,
        timestamp: bigIntToNumber(streamHeader.timestamp!),
        attributes: streamHeader.attributes,
      };
      streamHandlerCallback(
        new ByteStreamReader(info, stream, bigIntToNumber(streamHeader.totalLength)),
        { identity: participantIdentity },
      );
    } else if (streamHeader.contentHeader.case === 'textHeader') {
      const streamHandlerCallback = this.textStreamHandlers.get(streamHeader.topic ?? '');

      if (!streamHandlerCallback) {
        log.debug('ignoring incoming text stream due to no handler for topic', streamHeader.topic);
        return;
      }
      let streamController: ReadableStreamDefaultController<DataStream_Chunk>;
      const stream = new ReadableStream<DataStream_Chunk>({
        start: (controller) => {
          streamController = controller;
          this.textStreamControllers.set(streamHeader.streamId!, {
            header: streamHeader,
            controller: streamController,
            startTime: Date.now(),
          });
        },
      });
      const info: TextStreamInfo = {
        streamId: streamHeader.streamId!,
        mimeType: streamHeader.mimeType!,
        totalSize: streamHeader.totalLength ? Number(streamHeader.totalLength) : undefined,
        topic: streamHeader.topic!,
        timestamp: Number(streamHeader.timestamp),
        attributes: streamHeader.attributes,
      };
      streamHandlerCallback(
        new TextStreamReader(info, stream, bigIntToNumber(streamHeader.totalLength)),
        { identity: participantIdentity },
      );
    }
  }

  private handleStreamChunk(chunk: DataStream_Chunk) {
    const fileBuffer = this.byteStreamControllers.get(chunk.streamId!);
    if (fileBuffer) {
      if (chunk.content!.length > 0) {
        fileBuffer.controller.enqueue(chunk);
      }
    }
    const textBuffer = this.textStreamControllers.get(chunk.streamId!);
    if (textBuffer) {
      if (chunk.content!.length > 0) {
        textBuffer.controller.enqueue(chunk);
      }
    }
  }

  private handleStreamTrailer(trailer: DataStream_Trailer) {
    const streamId = trailer.streamId!;
    const fileBuffer = this.byteStreamControllers.get(streamId);
    if (fileBuffer) {
      fileBuffer.controller.close();
      this.byteStreamControllers.delete(streamId);
    }
    const textBuffer = this.textStreamControllers.get(streamId);
    if (textBuffer) {
      textBuffer.controller.close();
      this.byteStreamControllers.delete(streamId);
    }
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
  localTrackSubscribed: (track: LocalTrack) => void;
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
  roomInfoUpdated: (info: RoomInfo) => void;
  participantMetadataChanged: (metadata: string | undefined, participant: Participant) => void;
  participantNameChanged: (name: string, participant: Participant) => void;
  participantAttributesChanged: (
    changedAttributes: Record<string, string>,
    participant: Participant,
  ) => void;
  connectionQualityChanged: (quality: ConnectionQuality, participant: Participant) => void;
  dataReceived: (
    payload: Uint8Array,
    participant?: RemoteParticipant,
    kind?: DataPacketKind,
    topic?: string,
  ) => void;
  chatMessage: (message: ChatMessage, participant?: Participant) => void;
  dtmfReceived: (code: number, digit: string, participant: RemoteParticipant) => void;
  encryptionError: (error: Error) => void;
  connectionStateChanged: (state: ConnectionState) => void;
  connected: () => void;
  disconnected: (reason: DisconnectReason) => void;
  reconnecting: () => void;
  reconnected: () => void;
  roomSidChanged: (sid: string) => void;
};

export enum RoomEvent {
  ParticipantConnected = 'participantConnected',
  ParticipantDisconnected = 'participantDisconnected',
  LocalTrackPublished = 'localTrackPublished',
  LocalTrackUnpublished = 'localTrackUnpublished',
  LocalTrackSubscribed = 'localTrackSubscribed',
  TrackPublished = 'trackPublished',
  TrackUnpublished = 'trackUnpublished',
  TrackSubscribed = 'trackSubscribed',
  TrackUnsubscribed = 'trackUnsubscribed',
  TrackSubscriptionFailed = 'trackSubscriptionFailed',
  TrackMuted = 'trackMuted',
  TrackUnmuted = 'trackUnmuted',
  ActiveSpeakersChanged = 'activeSpeakersChanged',
  RoomMetadataChanged = 'roomMetadataChanged',
  RoomSidChanged = 'roomSidChanged',
  ParticipantMetadataChanged = 'participantMetadataChanged',
  ParticipantNameChanged = 'participantNameChanged',
  ParticipantAttributesChanged = 'participantAttributesChanged',
  ConnectionQualityChanged = 'connectionQualityChanged',
  DataReceived = 'dataReceived',
  ChatMessage = 'chatMessage',
  DtmfReceived = 'dtmfReceived',
  EncryptionError = 'encryptionError',
  ConnectionStateChanged = 'connectionStateChanged',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Reconnecting = 'reconnecting',
  Reconnected = 'reconnected',
}
