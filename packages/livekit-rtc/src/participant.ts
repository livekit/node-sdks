// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { type Mutex } from '@livekit/mutex';
import {
  DisconnectReason,
  type OwnedParticipant,
  type ParticipantInfo,
  ParticipantKind,
  type ParticipantKindDetail,
} from '@livekit/rtc-ffi-bindings';
import {
  type ByteStreamOpenCallback,
  ByteStreamOpenRequest,
  type ByteStreamOpenResponse,
  type ByteStreamWriterCloseCallback,
  ByteStreamWriterCloseRequest,
  type ByteStreamWriterCloseResponse,
  type ByteStreamWriterWriteCallback,
  ByteStreamWriterWriteRequest,
  type ByteStreamWriterWriteResponse,
  ChatMessage as ChatMessageModel,
  EditChatMessageRequest,
  TranscriptionSegment as ProtoTranscriptionSegment,
  type PublishDataCallback,
  PublishDataRequest,
  type PublishDataResponse,
  type PublishSipDtmfCallback,
  PublishSipDtmfRequest,
  type PublishSipDtmfResponse,
  type PublishTrackCallback,
  PublishTrackRequest,
  type PublishTrackResponse,
  type PublishTranscriptionCallback,
  PublishTranscriptionRequest,
  type PublishTranscriptionResponse,
  type SendChatMessageCallback,
  SendChatMessageRequest,
  type SendChatMessageResponse,
  type SetLocalAttributesCallback,
  SetLocalAttributesRequest,
  type SetLocalAttributesResponse,
  type SetLocalMetadataCallback,
  SetLocalMetadataRequest,
  type SetLocalMetadataResponse,
  type SetLocalNameCallback,
  SetLocalNameRequest,
  type SetLocalNameResponse,
  StreamByteOptions,
  type StreamSendFileCallback,
  StreamSendFileRequest,
  type StreamSendFileResponse,
  type StreamSendTextCallback,
  StreamSendTextRequest,
  type StreamSendTextResponse,
  StreamTextOptions,
  type TextStreamOpenCallback,
  TextStreamOpenRequest,
  type TextStreamOpenResponse,
  type TextStreamWriterCloseCallback,
  TextStreamWriterCloseRequest,
  type TextStreamWriterCloseResponse,
  type TextStreamWriterWriteCallback,
  TextStreamWriterWriteRequest,
  type TextStreamWriterWriteResponse,
  type TrackPublishOptions,
  type UnpublishTrackCallback,
  UnpublishTrackRequest,
  type UnpublishTrackResponse,
} from '@livekit/rtc-ffi-bindings';
import type {
  PerformRpcCallback,
  PerformRpcResponse,
  RegisterRpcMethodResponse,
  RpcMethodInvocationResponseResponse,
  UnregisterRpcMethodResponse,
} from '@livekit/rtc-ffi-bindings';
import {
  PerformRpcRequest,
  RegisterRpcMethodRequest,
  RpcMethodInvocationResponseRequest,
  UnregisterRpcMethodRequest,
} from '@livekit/rtc-ffi-bindings';
import type { PathLike } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  type ByteStreamOptions,
  ByteStreamWriter,
  TextStreamWriter,
} from './data_streams/index.js';
import { FfiClient, FfiHandle } from './ffi_client.js';
import { log } from './log.js';
import { type PerformRpcParams, RpcError, type RpcInvocationData } from './rpc.js';
import type { LocalTrack } from './track.js';
import type { RemoteTrackPublication, TrackPublication } from './track_publication.js';
import { LocalTrackPublication } from './track_publication.js';
import type { Transcription } from './transcription.js';
import type { ChatMessage } from './types.js';
import { byteStreamInfoFromProto, textStreamInfoFromProto } from './utils.js';
import { numberToBigInt } from './utils.js';

export abstract class Participant {
  /** @internal */
  info: ParticipantInfo;

  /** @internal */
  ffi_handle: FfiHandle;

  trackPublications = new Map<string, TrackPublication>();

  constructor(owned_info: OwnedParticipant) {
    this.info = owned_info!.info!;
    this.ffi_handle = new FfiHandle(owned_info.handle!.id!);
  }

  get sid(): string | undefined {
    return this.info.sid;
  }

  get name(): string | undefined {
    return this.info.name;
  }

  get identity(): string {
    return this.info.identity ?? '';
  }

  get metadata(): string {
    return this.info.metadata ?? '';
  }

  get attributes(): Record<string, string> {
    return this.info.attributes ?? {};
  }

  get kind(): ParticipantKind {
    return this.info.kind ?? ParticipantKind.STANDARD;
  }

  get kindDetails(): ParticipantKindDetail[] {
    return this.info.kindDetails ?? [];
  }

  get disconnectReason(): DisconnectReason | undefined {
    if (this.info.disconnectReason === DisconnectReason.UNKNOWN_REASON) {
      return undefined;
    }
    return this.info.disconnectReason;
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
  private rpcHandlers: Map<string, (data: RpcInvocationData) => Promise<string>> = new Map();

  private ffiEventLock: Mutex;

  // Signal that fires when the owning Room disconnects, used to cancel
  // pending FfiClient.waitFor() listeners so they don't leak.
  private disconnectSignal: AbortSignal;

  trackPublications: Map<string, LocalTrackPublication> = new Map();

  constructor(info: OwnedParticipant, ffiEventLock: Mutex, disconnectSignal: AbortSignal) {
    super(info);
    this.ffiEventLock = ffiEventLock;
    this.disconnectSignal = disconnectSignal;
  }

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

    const cb = await FfiClient.instance.waitFor<PublishDataCallback>(
      (ev) => ev.message.case == 'publishData' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

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

    const cb = await FfiClient.instance.waitFor<PublishSipDtmfCallback>(
      (ev) => ev.message.case == 'publishSipDtmf' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

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

    const cb = await FfiClient.instance.waitFor<PublishTranscriptionCallback>(
      (ev) => ev.message.case == 'publishTranscription' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

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

    await FfiClient.instance.waitFor<SetLocalMetadataCallback>(
      (ev) => ev.message.case == 'setLocalMetadata' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );
  }

  /**
   * Returns a `StreamWriter` instance that allows to write individual chunks of text to a stream.
   * Well suited for TTS and/or streaming LLM output. If you want to simply send a text then use sendText() instead
   */
  async streamText(options?: {
    topic?: string;
    attributes?: Record<string, string>;
    destinationIdentities?: Array<string>;
    streamId?: string;
    senderIdentity?: string;
  }): Promise<TextStreamWriter> {
    const req = new TextStreamOpenRequest({
      localParticipantHandle: this.ffi_handle.handle,
      options: new StreamTextOptions({
        topic: options?.topic ?? '',
        attributes: options?.attributes,
        destinationIdentities: options?.destinationIdentities,
        id: options?.streamId,
        senderIdentity: options?.senderIdentity ?? this.identity,
      }),
    });

    const res = FfiClient.instance.request<TextStreamOpenResponse>({
      message: { case: 'textStreamOpen', value: req },
    });

    const cb = await FfiClient.instance.waitFor<TextStreamOpenCallback>(
      (ev) => ev.message.case == 'textStreamOpen' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

    if (cb.result.case !== 'writer') {
      throw new Error(cb.result.case === 'error' ? cb.result.value.description : 'unknown error');
    }

    const writerHandle = cb.result.value.handle!.id!;
    const info = textStreamInfoFromProto(cb.result.value.info!);
    const writeText = this.textStreamWriterWrite;
    const closeWriter = this.textStreamWriterClose;

    const writableStream = new WritableStream<string>({
      // Implement the sink
      async write(text) {
        await writeText(new TextStreamWriterWriteRequest({ writerHandle, text }));
      },
      async close() {
        await closeWriter(new TextStreamWriterCloseRequest({ writerHandle }));
      },
      // Close the stream with the error reason so the remote side's stream
      // controller is closed instead of waiting for data that won't arrive.
      async abort(err) {
        log.error(err, 'Sink Error');
        try {
          await closeWriter(
            new TextStreamWriterCloseRequest({
              writerHandle,
              reason: err instanceof Error ? err.message : String(err ?? ''),
            }),
          );
        } catch {
          // Best-effort: the connection may already be gone.
        }
      },
    });

    const writer = new TextStreamWriter(writableStream, info);

    return writer;
  }

  async sendText(
    text: string,
    options?: {
      topic?: string;
      attributes?: Record<string, string>;
      destinationIdentities?: Array<string>;
      streamId?: string;
      /**
       * Whether the payload may be compressed on the wire. Defaults to true;
       * compression is only applied when it actually reduces the payload size
       * and every recipient supports it.
       */
      compress?: boolean;
    },
  ) {
    const req = new StreamSendTextRequest({
      localParticipantHandle: this.ffi_handle.handle,
      options: new StreamTextOptions({
        topic: options?.topic ?? '',
        attributes: options?.attributes,
        destinationIdentities: options?.destinationIdentities,
        id: options?.streamId,
        senderIdentity: this.identity,
        compress: options?.compress,
      }),
      text,
    });

    const res = FfiClient.instance.request<StreamSendTextResponse>({
      message: { case: 'sendText', value: req },
    });

    const cb = await FfiClient.instance.waitFor<StreamSendTextCallback>(
      (ev) => ev.message.case == 'sendText' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

    if (cb.result.case !== 'info') {
      throw new Error(cb.result.case === 'error' ? cb.result.value.description : 'unknown error');
    }

    return textStreamInfoFromProto(cb.result.value);
  }

  async streamBytes(options?: {
    name?: string;
    topic?: string;
    attributes?: Record<string, string>;
    destinationIdentities?: Array<string>;
    streamId?: string;
    mimeType?: string;
    totalSize?: number;
  }) {
    const req = new ByteStreamOpenRequest({
      localParticipantHandle: this.ffi_handle.handle,
      options: new StreamByteOptions({
        topic: options?.topic ?? '',
        attributes: options?.attributes,
        destinationIdentities: options?.destinationIdentities,
        id: options?.streamId,
        name: options?.name ?? 'unknown',
        mimeType: options?.mimeType ?? 'application/octet-stream',
        totalLength: numberToBigInt(options?.totalSize),
        senderIdentity: this.identity,
      }),
    });

    const res = FfiClient.instance.request<ByteStreamOpenResponse>({
      message: { case: 'byteStreamOpen', value: req },
    });

    const cb = await FfiClient.instance.waitFor<ByteStreamOpenCallback>(
      (ev) => ev.message.case == 'byteStreamOpen' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

    if (cb.result.case !== 'writer') {
      throw new Error(cb.result.case === 'error' ? cb.result.value.description : 'unknown error');
    }

    const writerHandle = cb.result.value.handle!.id!;
    const info = byteStreamInfoFromProto(cb.result.value.info!);
    const writeBytes = this.byteStreamWriterWrite;
    const closeWriter = this.byteStreamWriterClose;

    const writableStream = new WritableStream<Uint8Array>({
      async write(chunk) {
        await writeBytes(new ByteStreamWriterWriteRequest({ writerHandle, bytes: chunk }));
      },
      async close() {
        await closeWriter(new ByteStreamWriterCloseRequest({ writerHandle }));
      },
      // Close the stream with the error reason so the remote side's stream
      // controller is closed instead of waiting for data that won't arrive.
      async abort(err) {
        log.error(err, 'Sink error');
        try {
          await closeWriter(
            new ByteStreamWriterCloseRequest({
              writerHandle,
              reason: err instanceof Error ? err.message : String(err ?? ''),
            }),
          );
        } catch {
          // Best-effort: the connection may already be gone.
        }
      },
    });

    const byteWriter = new ByteStreamWriter(writableStream, info);

    return byteWriter;
  }

  /** Sends a file provided as PathLike to specified recipients */
  async sendFile(path: PathLike, options?: ByteStreamOptions) {
    const filePath = path instanceof URL ? fileURLToPath(path) : path.toString();

    const req = new StreamSendFileRequest({
      localParticipantHandle: this.ffi_handle.handle,
      options: new StreamByteOptions({
        topic: options?.topic ?? '',
        attributes: options?.attributes,
        destinationIdentities: options?.destinationIdentities,
        name: options?.name ?? 'unknown',
        mimeType: options?.mimeType ?? 'application/octet-stream',
        senderIdentity: this.identity,
        compress: options?.compress,
      }),
      filePath,
    });

    const res = FfiClient.instance.request<StreamSendFileResponse>({
      message: { case: 'sendFile', value: req },
    });

    const cb = await FfiClient.instance.waitFor<StreamSendFileCallback>(
      (ev) => ev.message.case == 'sendFile' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

    if (cb.result.case === 'error') {
      throw new Error(cb.result.value.description);
    }
  }

  private textStreamWriterWrite = async (req: TextStreamWriterWriteRequest) => {
    const res = FfiClient.instance.request<TextStreamWriterWriteResponse>({
      message: { case: 'textStreamWrite', value: req },
    });

    const cb = await FfiClient.instance.waitFor<TextStreamWriterWriteCallback>(
      (ev) =>
        ev.message.case == 'textStreamWriterWrite' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

    if (cb.error) {
      throw new Error(cb.error.description);
    }
  };

  private textStreamWriterClose = async (req: TextStreamWriterCloseRequest) => {
    const res = FfiClient.instance.request<TextStreamWriterCloseResponse>({
      message: { case: 'textStreamClose', value: req },
    });

    const cb = await FfiClient.instance.waitFor<TextStreamWriterCloseCallback>(
      (ev) =>
        ev.message.case == 'textStreamWriterClose' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

    if (cb.error) {
      throw new Error(cb.error.description);
    }
  };

  private byteStreamWriterWrite = async (req: ByteStreamWriterWriteRequest) => {
    const res = FfiClient.instance.request<ByteStreamWriterWriteResponse>({
      message: { case: 'byteStreamWrite', value: req },
    });

    const cb = await FfiClient.instance.waitFor<ByteStreamWriterWriteCallback>(
      (ev) =>
        ev.message.case == 'byteStreamWriterWrite' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

    if (cb.error) {
      throw new Error(cb.error.description);
    }
  };

  private byteStreamWriterClose = async (req: ByteStreamWriterCloseRequest) => {
    const res = FfiClient.instance.request<ByteStreamWriterCloseResponse>({
      message: { case: 'byteStreamClose', value: req },
    });

    const cb = await FfiClient.instance.waitFor<ByteStreamWriterCloseCallback>(
      (ev) =>
        ev.message.case == 'byteStreamWriterClose' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

    if (cb.error) {
      throw new Error(cb.error.description);
    }
  };

  /**
   * Sends a chat message to participants in the room
   *
   * @param text - The text content of the chat message.
   * @param destinationIdentities - An optional array of recipient identities to whom the message will be sent. If omitted, the message is broadcast to all participants.
   * @param senderIdentity - An optional identity of the sender. If omitted, the default sender identity is used.
   *
   */
  async sendChatMessage(
    text: string,
    destinationIdentities?: Array<string>,
    senderIdentity?: string,
  ): Promise<ChatMessage> {
    const req = new SendChatMessageRequest({
      localParticipantHandle: this.ffi_handle.handle,
      message: text,
      destinationIdentities,
      senderIdentity,
    });

    const res = FfiClient.instance.request<SendChatMessageResponse>({
      message: { case: 'sendChatMessage', value: req },
    });

    const cb = await FfiClient.instance.waitFor<SendChatMessageCallback>(
      (ev) => ev.message.case == 'chatMessage' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

    switch (cb.message.case) {
      case 'chatMessage':
        const { id, timestamp, editTimestamp, message } = cb.message.value!;
        return {
          id: id!,
          timestamp: Number(timestamp),
          editTimestamp: Number(editTimestamp),
          message: message!,
        };
      case 'error':
      default:
        throw new Error(cb.message.value);
    }
  }

  /**
   * @experimental
   */
  async editChatMessage(
    editText: string,
    originalMessage: ChatMessage,
    destinationIdentities?: Array<string>,
    senderIdentity?: string,
  ): Promise<ChatMessage> {
    const req = new EditChatMessageRequest({
      localParticipantHandle: this.ffi_handle.handle,
      editText,
      originalMessage: new ChatMessageModel({
        ...originalMessage,
        timestamp: BigInt(originalMessage.timestamp),
        editTimestamp: originalMessage.editTimestamp
          ? BigInt(originalMessage.editTimestamp)
          : undefined,
      }),
      destinationIdentities,
      senderIdentity,
    });

    const res = FfiClient.instance.request<SendChatMessageResponse>({
      message: { case: 'editChatMessage', value: req },
    });

    const cb = await FfiClient.instance.waitFor<SendChatMessageCallback>(
      (ev) => ev.message.case == 'chatMessage' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );

    switch (cb.message.case) {
      case 'chatMessage':
        const { id, timestamp, editTimestamp, message } = cb.message.value!;
        return {
          id: id!,
          timestamp: Number(timestamp),
          editTimestamp: Number(editTimestamp),
          message: message!,
        };
      case 'error':
      default:
        throw new Error(cb.message.value);
    }
  }

  async updateName(name: string) {
    const req = new SetLocalNameRequest({
      localParticipantHandle: this.ffi_handle.handle,
      name: name,
    });

    const res = FfiClient.instance.request<SetLocalNameResponse>({
      message: { case: 'setLocalName', value: req },
    });

    await FfiClient.instance.waitFor<SetLocalNameCallback>(
      (ev) => ev.message.case == 'setLocalName' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );
  }

  async setAttributes(attributes: Record<string, string>) {
    const req = new SetLocalAttributesRequest({
      localParticipantHandle: this.ffi_handle.handle,
      attributes: Object.entries(attributes).map(([key, value]) => ({ key, value })),
    });

    const res = FfiClient.instance.request<SetLocalAttributesResponse>({
      message: { case: 'setLocalAttributes', value: req },
    });

    await FfiClient.instance.waitFor<SetLocalAttributesCallback>(
      (ev) => ev.message.case == 'setLocalAttributes' && ev.message.value.asyncId == res.asyncId,
      { signal: this.disconnectSignal },
    );
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

    const unlock = await this.ffiEventLock.lock();

    const res = FfiClient.instance.request<PublishTrackResponse>({
      message: { case: 'publishTrack', value: req },
    });

    try {
      const cb = await FfiClient.instance.waitFor<PublishTrackCallback>(
        (ev) => ev.message.case == 'publishTrack' && ev.message.value.asyncId == res.asyncId,
        { signal: this.disconnectSignal },
      );

      switch (cb.message.case) {
        case 'publication':
          const track_publication = new LocalTrackPublication(cb.message.value!);
          track_publication.track = track;
          // Stamp the server-assigned publication
          // SID onto the track so track.sid == publication.sid. Both
          // Track.pushProcessorMetadataToStream and the localTrackRepublished
          // handler look up the local publication by this SID; without it they
          // depend on createAudioTrack's provisional SID happening to match.
          if (track.info && track_publication.sid) {
            track.info.sid = track_publication.sid;
          }
          this.trackPublications.set(track_publication.sid!, track_publication);

          return track_publication;
        case 'error':
        default:
          throw new Error(cb.message.value);
      }
    } finally {
      unlock();
    }
  }

  async unpublishTrack(trackSid: string, stopOnUnpublish?: boolean) {
    const unlock = await this.ffiEventLock.lock();
    try {
      const req = new UnpublishTrackRequest({
        localParticipantHandle: this.ffi_handle.handle,
        trackSid: trackSid,
        stopOnUnpublish: stopOnUnpublish ?? true,
      });

      const res = FfiClient.instance.request<UnpublishTrackResponse>({
        message: { case: 'unpublishTrack', value: req },
      });

      const cb = await FfiClient.instance.waitFor<UnpublishTrackCallback>(
        (ev) => ev.message.case == 'unpublishTrack' && ev.message.value.asyncId == res.asyncId,
        { signal: this.disconnectSignal },
      );

      if (cb.error) {
        throw new Error(cb.error);
      }

      const pub = this.trackPublications.get(trackSid);
      if (pub) {
        // Clear the processor's room context here too: this path races the
        // localTrackUnpublished room event, and whichever loses finds the
        // publication already gone and skips its own setRoom(null). Calling it
        // from both paths guarantees the processor is cleared (and the
        // tokenRefreshed listener detached); setRoom(null) is idempotent, so a
        // double-clear when this path wins is safe.
        if (pub.track) {
          pub.track.setRoom(null);
        }
        pub.track = undefined;
      }
      this.trackPublications.delete(trackSid);
    } finally {
      unlock();
    }
  }

  /**
   * Initiate an RPC call to a remote participant.
   * @param params - Parameters for initiating the RPC call, see {@link PerformRpcParams}
   * @returns A promise that resolves with the response payload or rejects with an error.
   * @throws Error on failure. Details in `message`.
   */
  async performRpc({
    destinationIdentity,
    method,
    payload,
    responseTimeout,
  }: PerformRpcParams): Promise<string> {
    const req = new PerformRpcRequest({
      localParticipantHandle: this.ffi_handle.handle,
      destinationIdentity,
      method,
      payload,
      responseTimeoutMs: responseTimeout,
    });

    const res = FfiClient.instance.request<PerformRpcResponse>({
      message: { case: 'performRpc', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PerformRpcCallback>(
      (ev) => ev.message.case === 'performRpc' && ev.message.value.asyncId === res.asyncId,
      { signal: this.disconnectSignal },
    );

    if (cb.error) {
      throw RpcError.fromProto(cb.error);
    }

    return cb.payload!;
  }

  /**
   * Establishes the participant as a receiver for calls of the specified RPC method.
   * Will overwrite any existing callback for the same method.
   *
   * @param method - The name of the indicated RPC method
   * @param handler - Will be invoked when an RPC request for this method is received
   * @returns A promise that resolves when the method is successfully registered
   *
   * @example
   * ```typescript
   * room.localParticipant?.registerRpcMethod(
   *   'greet',
   *   async (data: RpcInvocationData) => {
   *     console.log(`Received greeting from ${data.callerIdentity}: ${data.payload}`);
   *     return `Hello, ${data.callerIdentity}!`;
   *   }
   * );
   * ```
   *
   * See {@link RpcInvocationData} for more details on invocation params.
   *
   * The handler should return a Promise that resolves to a string.
   * If unable to respond within `responseTimeout`, the request will result in an error on the caller's side.
   *
   * You may throw errors of type `RpcError` with a string `message` in the handler,
   * and they will be received on the caller's side with the message intact.
   * Other errors thrown in your handler will not be transmitted as-is, and will instead arrive to the caller as `1500` ("Application Error").
   */
  registerRpcMethod(method: string, handler: (data: RpcInvocationData) => Promise<string>) {
    this.rpcHandlers.set(method, handler);

    const req = new RegisterRpcMethodRequest({
      localParticipantHandle: this.ffi_handle.handle,
      method,
    });

    FfiClient.instance.request<RegisterRpcMethodResponse>({
      message: { case: 'registerRpcMethod', value: req },
    });
  }

  /**
   * Unregisters a previously registered RPC method.
   *
   * @param method - The name of the RPC method to unregister
   */
  unregisterRpcMethod(method: string) {
    this.rpcHandlers.delete(method);

    const req = new UnregisterRpcMethodRequest({
      localParticipantHandle: this.ffi_handle.handle,
      method,
    });

    FfiClient.instance.request<UnregisterRpcMethodResponse>({
      message: { case: 'unregisterRpcMethod', value: req },
    });
  }

  /** @internal */
  async handleRpcMethodInvocation(
    invocationId: bigint,
    method: string,
    requestId: string,
    callerIdentity: string,
    payload: string,
    responseTimeout: number,
  ) {
    let responseError: RpcError | null = null;
    let responsePayload: string | null = null;

    const handler = this.rpcHandlers.get(method);

    if (!handler) {
      responseError = RpcError.builtIn('UNSUPPORTED_METHOD');
    } else {
      try {
        responsePayload = await handler({ requestId, callerIdentity, payload, responseTimeout });
      } catch (error) {
        if (error instanceof RpcError) {
          responseError = error;
        } else {
          console.warn(
            `Uncaught error returned by RPC handler for ${method}. Returning APPLICATION_ERROR instead.`,
            error,
          );
          responseError = RpcError.builtIn('APPLICATION_ERROR');
        }
      }
    }

    const req = new RpcMethodInvocationResponseRequest({
      localParticipantHandle: this.ffi_handle.handle,
      invocationId,
      error: responseError ? responseError.toProto() : undefined,
      payload: responsePayload ?? undefined,
    });

    const res = FfiClient.instance.request<RpcMethodInvocationResponseResponse>({
      message: { case: 'rpcMethodInvocationResponse', value: req },
    });

    if (res.error) {
      console.warn(`error sending rpc method invocation response: ${res.error}`);
    }
  }
}

export class RemoteParticipant extends Participant {
  trackPublications: Map<string, RemoteTrackPublication> = new Map();

  constructor(owned_info: OwnedParticipant) {
    super(owned_info);
  }
}
