// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { FfiClient, FfiHandle } from './ffi_client.js';
import type { OwnedParticipant, ParticipantInfo, ParticipantKind } from './proto/participant_pb.js';
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
import type {
  PublishRpcAckCallback,
  PublishRpcAckResponse,
  PublishRpcRequestCallback,
  PublishRpcRequestResponse,
  PublishRpcResponseCallback,
  PublishRpcResponseResponse,
} from './proto/rpc_pb.js';
import {
  PublishRpcAckRequest,
  PublishRpcRequestRequest,
  PublishRpcResponseRequest,
} from './proto/rpc_pb.js';
import { MAX_PAYLOAD_BYTES, RpcAck, RpcError, RpcRequest, RpcResponse, byteLength } from './rpc.js';
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

  get kind(): ParticipantKind {
    return this.info.kind;
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
  private rpcHandlers: Map<
    string,
    (request: RpcRequest, sender: RemoteParticipant) => Promise<string | RpcError>
  > = new Map();

  trackPublications: Map<string, LocalTrackPublication> = new Map();

  private pendingAcks = new Map<
    string,
    { resolve: (ack: RpcAck) => void; participantIdentity: string }
  >();
  private pendingResponses = new Map<
    string,
    { resolve: (response: RpcResponse) => void; participantIdentity: string }
  >();

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

  async publishRpcRequest(
    destinationIdentity: string,
    requestId: string,
    method: string,
    payload: string,
    responseTimeoutMs: number,
  ) {
    const req = new PublishRpcRequestRequest({
      localParticipantHandle: this.ffi_handle.handle,
      destinationIdentity,
      requestId,
      method,
      payload,
      responseTimeoutMs,
    });

    const res = FfiClient.instance.request<PublishRpcRequestResponse>({
      message: { case: 'publishRpcRequest', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PublishRpcRequestCallback>((ev) => {
      return ev.message.case == 'publishRpcRequest' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }
  async publishRpcResponse(
    destinationIdentity: string,
    requestId: string,
    payload: string | null,
    error: RpcError | null,
  ) {
    const req = new PublishRpcResponseRequest({
      localParticipantHandle: this.ffi_handle.handle,
      destinationIdentity,
      requestId,
      value: error ? { case: 'error', value: error } : { case: 'payload', value: payload },
    });

    const res = FfiClient.instance.request<PublishRpcResponseResponse>({
      message: { case: 'publishRpcResponse', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PublishRpcResponseCallback>((ev) => {
      return ev.message.case == 'publishRpcResponse' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }

  async publishRpcAck(destinationIdentity: string, requestId: string) {
    const req = new PublishRpcAckRequest({
      localParticipantHandle: this.ffi_handle.handle,
      destinationIdentity,
      requestId,
    });

    const res = FfiClient.instance.request<PublishRpcAckResponse>({
      message: { case: 'publishRpcAck', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PublishRpcAckCallback>((ev) => {
      return ev.message.case == 'publishRpcAck' && ev.message.value.asyncId == res.asyncId;
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

  /**
   * Initiate an RPC request to a remote participant.
   * @param recipientIdentity - The `identity` of the destination participant
   * @param method - The method name to call
   * @param payload - The method payload
   * @param connectionTimeoutMs - Timeout for establishing initial connection
   * @param responseTimeoutMs - Timeout for receiving a response after initial connection
   * @returns A promise that resolves with the response payload or rejects with an error.
   * @throws Error on failure. Details in `message`.
   */
  performRpcRequest(
    recipientIdentity: string,
    method: string,
    payload: string,
    connectionTimeoutMs: number = 5000,
    responseTimeoutMs: number = 10000,
  ): Promise<string> {
    const maxRoundTripLatencyMs = 2000;

    return new Promise((resolve, reject) => {
      if (byteLength(payload) > MAX_PAYLOAD_BYTES) {
        reject(RpcError.builtIn('REQUEST_PAYLOAD_TOO_LARGE'));
        return;
      }

      const id = crypto.randomUUID();
      this.publishRpcRequest(
        recipientIdentity,
        id,
        method,
        payload,
        responseTimeoutMs - maxRoundTripLatencyMs,
      );

      const ackTimeoutId = setTimeout(() => {
        this.pendingAcks.delete(id);
        reject(RpcError.builtIn('CONNECTION_TIMEOUT'));
        this.pendingResponses.delete(id);
        clearTimeout(responseTimeoutId);
      }, connectionTimeoutMs);

      this.pendingAcks.set(id, {
        resolve: () => {
          clearTimeout(ackTimeoutId);
        },
        participantIdentity: recipientIdentity,
      });

      const responseTimeoutId = setTimeout(() => {
        this.pendingResponses.delete(id);
        reject(RpcError.builtIn('RESPONSE_TIMEOUT'));
      }, responseTimeoutMs);

      this.pendingResponses.set(id, {
        resolve: (response) => {
          if (this.pendingAcks.has(id)) {
            console.error('RPC response received before ack', id);
            this.pendingAcks.delete(id);
            clearTimeout(ackTimeoutId);
          }
          clearTimeout(responseTimeoutId);
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.payload);
          }
        },
        participantIdentity: recipientIdentity,
      });
    });
  }

  /**
   * Etablishes the participant as a receiver for RPC calls of the specified method.
   * Will overwrite any existing callback for the specified method.
   *
   * @param method - The name of the indicated RPC method
   * @param callback - Will be called when an RPC request for this method is received, with the request and the sender. Respond with a string.
   */
  registerRpcMethod(
    method: string,
    handler: (request: RpcRequest, sender: RemoteParticipant) => Promise<string>,
  ) {
    this.rpcHandlers.set(method, handler);
  }

  /**
   * Unregisters a previously registered RPC method.
   *
   * @param method - The name of the RPC method to unregister
   */
  unregisterRpcMethod(method: string) {
    this.rpcHandlers.delete(method);
  }

  /** @internal */
  handleIncomingRpcAck(rpcAck: RpcAck) {
    const handler = this.pendingAcks.get(rpcAck.requestId);
    if (handler) {
      handler.resolve(rpcAck);
      this.pendingAcks.delete(rpcAck.requestId);
    } else {
      console.error('Ack received for unexpected RPC request', rpcAck.requestId);
    }
  }

  /** @internal */
  handleIncomingRpcResponse(rpcResponse: RpcResponse) {
    const handler = this.pendingResponses.get(rpcResponse.requestId);
    if (handler) {
      handler.resolve(rpcResponse);
      this.pendingResponses.delete(rpcResponse.requestId);
    } else {
      console.error('Response received for unexpected RPC request', rpcResponse.requestId);
    }
  }

  /** @internal */
  async handleIncomingRpcRequest(request: RpcRequest, sender: RemoteParticipant) {
    this.publishRpcAck(sender.identity, request.id);

    const sendResponse = (response: RpcResponse) => {
      this.publishRpcResponse(sender.identity, request.id, response.payload, response.error);
    };

    const handler = this.rpcHandlers.get(request.method);

    if (!handler) {
      this.publishRpcResponse(
        sender.identity,
        request.id,
        undefined,
        RpcError.builtIn('UNSUPPORTED_METHOD'),
      );
      return;
    }

    let error: RpcError | null = null;
    let payload: string | null = null;
    
    try {
      const response = await handler(request, sender);
      if (typeof response === 'string') {
        if (byteLength(response) > MAX_PAYLOAD_BYTES) {
          error = RpcError.builtIn('RESPONSE_PAYLOAD_TOO_LARGE');
          console.warn(`RPC Response payload too large for ${request.method}`);
        } else {
          payload = response;
        }
      } else if (response instanceof RpcError) {
        error = response;
      } else {
        console.warn(`unexpected handler response for ${request.method}: ${response}`);
        error = RpcError.builtIn('MALFORMED_RESPONSE');
      }
    } catch (error) {
      if (error instanceof RpcError) {
        error = error;
      } else {
        console.warn(
          `Uncaught error returned by RPC handler for ${request.method}. Returning UNCAUGHT_ERROR instead.`,
          error,
        );
        error = RpcError.builtIn('UNCAUGHT_ERROR');
      }
    }

    this.publishRpcResponse(sender.identity, request.id, payload, error);
  }

  /** @internal */
  handleParticipantDisconnected(participantIdentity: string) {
    for (const [id, { participantIdentity: pendingIdentity }] of this.pendingAcks) {
      if (pendingIdentity === participantIdentity) {
        this.pendingAcks.delete(id);
      }
    }

    for (const [id, { participantIdentity: pendingIdentity, resolve }] of this.pendingResponses) {
      if (pendingIdentity === participantIdentity) {
        resolve(
          new RpcResponse({
            requestId: id,
            error: RpcError.builtIn('RECIPIENT_DISCONNECTED'),
          }),
        );
        this.pendingResponses.delete(id);
      }
    }
  }
}

export class RemoteParticipant extends Participant {
  trackPublications: Map<string, RemoteTrackPublication> = new Map();

  constructor(owned_info: OwnedParticipant) {
    super(owned_info);
  }
}
