// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { FfiClient, FfiHandle } from './ffi_client.js';
import type { OwnedParticipant, ParticipantInfo } from './proto/participant_pb.js';
import type {
  PublishDataCallback,
  PublishDataResponse,
  PublishSipDtmfCallback,
  PublishSipDtmfResponse,
  PublishTrackCallback,
  PublishTrackResponse,
  PublishTranscriptionCallback,
  PublishTranscriptionResponse,
  SetLocalAttributesCallback,
  SetLocalAttributesResponse,
  SetLocalMetadataCallback,
  SetLocalMetadataResponse,
  SetLocalNameCallback,
  SetLocalNameResponse,
  TrackPublishOptions,
  UnpublishTrackCallback,
  UnpublishTrackResponse,
} from './proto/room_pb.js';
import {
  TranscriptionSegment as ProtoTranscriptionSegment,
  PublishDataRequest,
  PublishSipDtmfRequest,
  PublishTrackRequest,
  PublishTranscriptionRequest,
  SetLocalAttributesRequest,
  SetLocalMetadataRequest,
  SetLocalNameRequest,
  UnpublishTrackRequest,
} from './proto/room_pb.js';
import { type RpcAck, RpcRequest, type RpcResponse, RPC_ERROR_ACK_TIMEOUT, RPC_ERROR_RESPONSE_TIMEOUT } from './rpc.js';
import type { LocalTrack } from './track.js';
import type { RemoteTrackPublication, TrackPublication } from './track_publication.js';
import { LocalTrackPublication } from './track_publication.js';
import type { Transcription } from './transcription.js';

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

  get attributes(): Record<string, string> {
    return this.info.attributes;
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
   * the identities of participants who will receive the message, will be sent to every one if empty
   */
  destination_identities?: string[];
  /** the topic under which the message gets published */
  topic?: string;
};

export class LocalParticipant extends Participant {
  trackPublications: Map<string, LocalTrackPublication> = new Map();

  async publishData(data: Uint8Array, options: DataPublishOptions) {
    const req = new PublishDataRequest({
      localParticipantHandle: this.ffi_handle.handle,
      dataPtr: FfiClient.instance.retrievePtr(data),
      dataLen: BigInt(data.byteLength),
      reliable: options.reliable,
      topic: options.topic,
      destinationIdentities: options.destination_identities,
    });

    const res = FfiClient.instance.request<PublishDataResponse>({
      message: { case: 'publishData', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PublishDataCallback>((ev) => {
      return ev.message.case == 'publishData' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }

  async publishDtmf(code: number, digit: string) {
    const req = new PublishSipDtmfRequest({
      localParticipantHandle: this.ffi_handle.handle,
      code,
      digit,
    });

    const res = FfiClient.instance.request<PublishSipDtmfResponse>({
      message: { case: 'publishSipDtmf', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PublishSipDtmfCallback>((ev) => {
      return ev.message.case == 'publishSipDtmf' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }

  async publishTranscription(transcription: Transcription) {
    const req = new PublishTranscriptionRequest({
      localParticipantHandle: this.ffi_handle.handle,
      participantIdentity: transcription.participantIdentity,
      segments: transcription.segments.map(
        (s) =>
          new ProtoTranscriptionSegment({
            id: s.id,
            text: s.text,
            startTime: s.startTime,
            endTime: s.endTime,
            final: s.final,
            language: s.language,
          }),
      ),
      trackId: transcription.trackSid,
    });

    const res = FfiClient.instance.request<PublishTranscriptionResponse>({
      message: { case: 'publishTranscription', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PublishTranscriptionCallback>((ev) => {
      return ev.message.case == 'publishTranscription' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }

  async updateMetadata(metadata: string) {
    const req = new SetLocalMetadataRequest({
      localParticipantHandle: this.ffi_handle.handle,
      metadata: metadata,
    });

    const res = FfiClient.instance.request<SetLocalMetadataResponse>({
      message: { case: 'setLocalMetadata', value: req },
    });

    await FfiClient.instance.waitFor<SetLocalMetadataCallback>((ev) => {
      return ev.message.case == 'setLocalMetadata' && ev.message.value.asyncId == res.asyncId;
    });
  }

  async updateName(name: string) {
    const req = new SetLocalNameRequest({
      localParticipantHandle: this.ffi_handle.handle,
      name: name,
    });

    const res = FfiClient.instance.request<SetLocalNameResponse>({
      message: { case: 'setLocalName', value: req },
    });

    await FfiClient.instance.waitFor<SetLocalNameCallback>((ev) => {
      return ev.message.case == 'setLocalName' && ev.message.value.asyncId == res.asyncId;
    });
  }

  async setAttributes(attributes: Record<string, string>) {
    const req = new SetLocalAttributesRequest({
      localParticipantHandle: this.ffi_handle.handle,
      attributes: attributes,
    });

    const res = FfiClient.instance.request<SetLocalAttributesResponse>({
      message: { case: 'setLocalAttributes', value: req },
    });

    await FfiClient.instance.waitFor<SetLocalAttributesCallback>((ev) => {
      return ev.message.case == 'setLocalAttributes' && ev.message.value.asyncId == res.asyncId;
    });
  }

  async publishTrack(
    track: LocalTrack,
    options: TrackPublishOptions,
  ): Promise<LocalTrackPublication> {
    const req = new PublishTrackRequest({
      localParticipantHandle: this.ffi_handle.handle,
      trackHandle: track.ffi_handle.handle,
      options: options,
    });

    const res = FfiClient.instance.request<PublishTrackResponse>({
      message: { case: 'publishTrack', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PublishTrackCallback>((ev) => {
      return ev.message.case == 'publishTrack' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }

    const track_publication = new LocalTrackPublication(cb.publication);
    track_publication.track = track;
    this.trackPublications.set(track_publication.sid, track_publication);

    return track_publication;
  }

  async unpublishTrack(trackSid: string) {
    const req = new UnpublishTrackRequest({
      localParticipantHandle: this.ffi_handle.handle,
      trackSid: trackSid,
    });

    const res = FfiClient.instance.request<UnpublishTrackResponse>({
      message: { case: 'unpublishTrack', value: req },
    });

    const cb = await FfiClient.instance.waitFor<UnpublishTrackCallback>((ev) => {
      return ev.message.case == 'unpublishTrack' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }

    const pub = this.trackPublications.get(trackSid);
    pub.track = undefined;
    this.trackPublications.delete(trackSid);
  }

  private pendingAcks = new Map<string, (ack: RpcAck) => void>();
  private pendingResponses = new Map<string, (response: RpcResponse) => void>();

  /**
   * Performs an RPC request to a remote participant.
   * @param recipientIdentity The identity of the recipient participant.
   * @param method The RPC method to call.
   * @param payload The payload to send with the RPC request.
   * @param ackTimeout The timeout for receiving an acknowledgment (in milliseconds).
   * @param responseTimeout The timeout for receiving a response (in milliseconds).
   * @returns A promise that resolves with the response payload or rejects with an error.
   * @throws {code: number, data: string} upon failure
   */
  performRpcRequest(
    recipientIdentity: string,
    method: string,
    payload: string,
    ackTimeout: number = 5000,
    responseTimeout: number = 10000,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();

      const request = new RpcRequest();
      request.id = id;
      request.method = method;
      request.payload = payload;

      const jsonString = JSON.stringify(request);
      // TODO: This implementation is only a prototype
      //       The final version will use a native DataPacket
      this.publishData(new TextEncoder().encode(jsonString), {
        reliable: true,
        destination_identities: [recipientIdentity],
        topic: 'lk-rpc-request',
      });
      
      const ackTimeoutId = setTimeout(() => {
        this.pendingAcks.delete(id);
        reject({ code: RPC_ERROR_ACK_TIMEOUT });
        this.pendingResponses.delete(id);
        clearTimeout(responseTimeoutId);
      }, ackTimeout);

      this.pendingAcks.set(id, () => {
        clearTimeout(ackTimeoutId);
      });

      const responseTimeoutId = setTimeout(() => {
        this.pendingResponses.delete(id);
        reject({ code: RPC_ERROR_RESPONSE_TIMEOUT });
      }, responseTimeout);

      this.pendingResponses.set(id, (response) => {
        if (this.pendingAcks.has(id)) {
          console.error('RPC response received before ack', id);
          this.pendingAcks.delete(id);
          clearTimeout(ackTimeoutId);
        }
        clearTimeout(responseTimeoutId);
        if (response.errorCode !== 0 || response.errorData) {
          reject({
            code: response.errorCode,
            data: response.errorData
          });
        } else {
          resolve(response.payload);
        }
      });
    });
  }
  /** @internal */
  handleIncomingRpcAck(rpcAck: RpcAck) {
    const handler = this.pendingAcks.get(rpcAck.requestId);
    if (handler) {
      handler(rpcAck);
      this.pendingAcks.delete(rpcAck.requestId);
    }
  }

  /** @internal */
  handleIncomingRpcResponse(rpcResponse: RpcResponse) {
    const handler = this.pendingResponses.get(rpcResponse.requestId);
    if (handler) {
      handler(rpcResponse);
      this.pendingResponses.delete(rpcResponse.requestId);
    }
  }
}

export class RemoteParticipant extends Participant {
  trackPublications: Map<string, RemoteTrackPublication> = new Map();

  constructor(owned_info: OwnedParticipant) {
    super(owned_info);
  }
}
