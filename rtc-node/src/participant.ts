// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import { FfiClient, FfiClientEvent, FfiHandle, FfiRequest } from './ffi_client.js';
import { ParticipantInfo, OwnedParticipant } from './proto/participant_pb.js';
import {
  DataPacketKind,
  PublishDataCallback,
  PublishDataRequest,
  PublishDataResponse,
  PublishTrackCallback,
  PublishTrackRequest,
  PublishTrackResponse,
  TrackPublishOptions,
  UnpublishTrackCallback,
  UnpublishTrackRequest,
  UnpublishTrackResponse,
  UpdateLocalMetadataCallback,
  UpdateLocalMetadataRequest,
  UpdateLocalMetadataResponse,
  UpdateLocalNameCallback,
  UpdateLocalNameRequest,
  UpdateLocalNameResponse,
} from './proto/room_pb.js';
import {
  LocalTrackPublication,
  RemoteTrackPublication,
  TrackPublication,
} from './track_publication.js';
import { LocalTrack } from './track.js';

export abstract class Participant {
  /** @internal */
  info: ParticipantInfo;

  /** @internal */
  ffi_handle: FfiHandle;

  trackPublications = new Map<string, TrackPublication>();

  constructor(owned_info: OwnedParticipant) {
    this.info = owned_info.info;
    this.ffi_handle = new FfiHandle(owned_info.handle.id);
  }

  get sid(): string {
    return this.info.sid;
  }

  get name(): string {
    return this.info.name;
  }

  get identity(): string {
    return this.info.identity;
  }

  get metadata(): string {
    return this.info.metadata;
  }
}

export type DataPublishOptions = {
  /**
   * whether to send this as reliable or lossy.
   * For data that you need delivery guarantee (such as chat messages), use Reliable.
   * For data that should arrive as quickly as possible, but you are ok with dropped
   * packets, use Lossy.
   */
  reliable?: boolean;
  /**
   * the sids of participants who will receive the message, will be sent to every one if empty
   */
  destination?: string[] | RemoteParticipant[];
  /** the topic under which the message gets published */
  topic?: string;
};

export class LocalParticipant extends Participant {
  trackPublications: Map<string, LocalTrackPublication> = new Map();

  async publishData(data: Uint8Array, options: DataPublishOptions) {
    let req = new PublishDataRequest({
      localParticipantHandle: this.ffi_handle.handle,
      dataPtr: FfiClient.instance.retrievePtr(data),
      dataLen: BigInt(data.byteLength),
      kind: options.reliable ? DataPacketKind.KIND_RELIABLE : DataPacketKind.KIND_LOSSY,
      topic: options.topic,
    });

    if (options.destination) {
      const sids = options.destination.map((sid: string | RemoteParticipant) => {
        if (typeof sid == 'string') return sid;
        return sid.sid;
      });
      req.destinationSids = sids;
    }

    let res = FfiClient.instance.request<PublishDataResponse>({
      message: { case: 'publishData', value: req },
    });

    let cb = await FfiClient.instance.waitFor<PublishDataCallback>((ev) => {
      return ev.message.case == 'publishData' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }

  async updateMetadata(metadata: string) {
    let req = new UpdateLocalMetadataRequest({
      localParticipantHandle: this.ffi_handle.handle,
      metadata: metadata,
    });

    let res = FfiClient.instance.request<UpdateLocalMetadataResponse>({
      message: { case: 'updateLocalMetadata', value: req },
    });

    await FfiClient.instance.waitFor<UpdateLocalMetadataCallback>((ev) => {
      return ev.message.case == 'updateLocalMetadata' && ev.message.value.asyncId == res.asyncId;
    });
  }

  async updateName(name: string) {
    let req = new UpdateLocalNameRequest({
      localParticipantHandle: this.ffi_handle.handle,
      name: name,
    });

    let res = FfiClient.instance.request<UpdateLocalNameResponse>({
      message: { case: 'updateLocalName', value: req },
    });

    await FfiClient.instance.waitFor<UpdateLocalNameCallback>((ev) => {
      return ev.message.case == 'updateLocalName' && ev.message.value.asyncId == res.asyncId;
    });
  }

  async publishTrack(
    track: LocalTrack,
    options: TrackPublishOptions,
  ): Promise<LocalTrackPublication> {
    let req = new PublishTrackRequest({
      localParticipantHandle: this.ffi_handle.handle,
      trackHandle: track.ffi_handle.handle,
      options: options,
    });

    let res = FfiClient.instance.request<PublishTrackResponse>({
      message: { case: 'publishTrack', value: req },
    });

    let cb = await FfiClient.instance.waitFor<PublishTrackCallback>((ev) => {
      return ev.message.case == 'publishTrack' && ev.message.value.asyncId == res.asyncId;
    });

    let track_publication = new LocalTrackPublication(cb.publication);
    track_publication.track = track;
    this.trackPublications.set(track_publication.sid, track_publication);

    return track_publication;
  }

  async unpublishTrack(trackSid: string) {
    let req = new UnpublishTrackRequest({
      localParticipantHandle: this.ffi_handle.handle,
      trackSid: trackSid,
    });

    let res = FfiClient.instance.request<UnpublishTrackResponse>({
      message: { case: 'unpublishTrack', value: req },
    });

    await FfiClient.instance.waitFor<UnpublishTrackCallback>((ev) => {
      return ev.message.case == 'unpublishTrack' && ev.message.value.asyncId == res.asyncId;
    });

    let pub = this.trackPublications.get(trackSid);
    pub.track = undefined;
    this.trackPublications.delete(trackSid);
  }
}

export class RemoteParticipant extends Participant {
  trackPublications: Map<string, RemoteTrackPublication> = new Map();

  constructor(owned_info: OwnedParticipant) {
    super(owned_info);
  }
}
