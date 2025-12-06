// SPDX-FileCopyrightText: 2025 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type {
  ConnectTwilioCallRequest_TwilioCallDirection,
  RoomAgentDispatch,
  SessionDescription,
} from '@livekit/protocol';
import {
  AcceptWhatsAppCallRequest,
  AcceptWhatsAppCallResponse,
  ConnectTwilioCallRequest,
  ConnectTwilioCallResponse,
  ConnectWhatsAppCallRequest,
  ConnectWhatsAppCallResponse,
  DialWhatsAppCallRequest,
  DialWhatsAppCallResponse,
  DisconnectWhatsAppCallRequest,
  DisconnectWhatsAppCallResponse,
} from '@livekit/protocol';
import type { ClientOptions } from './ClientOptions.js';
import { ServiceBase } from './ServiceBase.js';
import { type Rpc, TwirpRpc, livekitPackage } from './TwirpRPC.js';

const svc = 'Connector';

// WhatsApp types
export interface DialWhatsAppCallOptions {
  /** Required - The identifier of the WhatsApp phone number that is initiating the call */
  whatsappPhoneNumberId: string;
  /** Required - The number of the user that is supposed to receive the call */
  whatsappToPhoneNumber: string;
  /** Required - The API key of the business that is initiating the call */
  whatsappApiKey: string;
  /** Required - WhatsApp Cloud API version, eg: 23.0, 24.0, etc. */
  whatsappCloudApiVersion: string;
  /** Optional - An arbitrary string you can pass in that is useful for tracking and logging purposes */
  whatsappBizOpaqueCallbackData?: string;
  /** Optional - What LiveKit room should this participant be connected to */
  roomName?: string;
  /** Optional - Agents to dispatch the call to */
  agents?: RoomAgentDispatch[];
  /** Optional - Identity of the participant in LiveKit room */
  participantIdentity?: string;
  /** Optional - Name of the participant in LiveKit room */
  participantName?: string;
  /** Optional - User-defined metadata. Will be attached to a created Participant in the room. */
  participantMetadata?: string;
  /** Optional - User-defined attributes. Will be attached to a created Participant in the room. */
  participantAttributes?: { [key: string]: string };
  /** Optional - Country where the call terminates as ISO 3166-1 alpha-2 */
  destinationCountry?: string;
}

export interface AcceptWhatsAppCallOptions {
  /** Required - The identifier of the WhatsApp phone number that is connecting the call */
  whatsappPhoneNumberId: string;
  /** Required - The API key of the business that is connecting the call */
  whatsappApiKey: string;
  /** Required - WhatsApp Cloud API version, eg: 23.0, 24.0, etc. */
  whatsappCloudApiVersion: string;
  /** Required - Call ID sent by Meta */
  whatsappCallId: string;
  /** Optional - An arbitrary string you can pass in that is useful for tracking and logging purposes */
  whatsappBizOpaqueCallbackData?: string;
  /** Required - The call accept webhook comes with SDP from Meta */
  sdp: SessionDescription;
  /** Optional - What LiveKit room should this participant be connected to */
  roomName?: string;
  /** Optional - Agents to dispatch the call to */
  agents?: RoomAgentDispatch[];
  /** Optional - Identity of the participant in LiveKit room */
  participantIdentity?: string;
  /** Optional - Name of the participant in LiveKit room */
  participantName?: string;
  /** Optional - User-defined metadata. Will be attached to a created Participant in the room. */
  participantMetadata?: string;
  /** Optional - User-defined attributes. Will be attached to a created Participant in the room. */
  participantAttributes?: { [key: string]: string };
  /** Optional - Country where the call terminates as ISO 3166-1 alpha-2 */
  destinationCountry?: string;
}

// Twilio types
export interface ConnectTwilioCallOptions {
  /** The direction of the call */
  twilioCallDirection: ConnectTwilioCallRequest_TwilioCallDirection;
  /** What LiveKit room should this call be connected to */
  roomName: string;
  /** Optional agents to dispatch the call to */
  agents?: RoomAgentDispatch[];
  /** Optional identity of the participant in LiveKit room */
  participantIdentity?: string;
  /** Optional name of the participant in LiveKit room */
  participantName?: string;
  /** Optional user-defined metadata. Will be attached to a created Participant in the room. */
  participantMetadata?: string;
  /** Optional user-defined attributes. Will be attached to a created Participant in the room. */
  participantAttributes?: { [key: string]: string };
  /** Country where the call terminates as ISO 3166-1 alpha-2 */
  destinationCountry?: string;
}

/**
 * Client to access Connector APIs for WhatsApp and Twilio integrations
 */
export class ConnectorClient extends ServiceBase {
  private readonly rpc: Rpc;

  /**
   * @param host - hostname including protocol. i.e. 'https://<project>.livekit.cloud'
   * @param apiKey - API Key, can be set in env var LIVEKIT_API_KEY
   * @param secret - API Secret, can be set in env var LIVEKIT_API_SECRET
   * @param options - client options
   */
  constructor(host: string, apiKey?: string, secret?: string, options?: ClientOptions) {
    super(apiKey, secret);
    const rpcOptions = options?.requestTimeout
      ? { requestTimeout: options.requestTimeout }
      : undefined;
    this.rpc = new TwirpRpc(host, livekitPackage, rpcOptions);
  }

  /**
   * Initiate an outbound WhatsApp call
   *
   * @param options - WhatsApp call options
   * @returns Promise containing the WhatsApp call ID and room name
   */
  async dialWhatsAppCall(options: DialWhatsAppCallOptions): Promise<DialWhatsAppCallResponse> {
    const whatsappBizOpaqueCallbackData = options.whatsappBizOpaqueCallbackData || '';
    const roomName = options.roomName || '';
    const participantIdentity = options.participantIdentity || '';
    const participantName = options.participantName || '';
    const participantMetadata = options.participantMetadata || '';
    const destinationCountry = options.destinationCountry || '';

    const req = new DialWhatsAppCallRequest({
      whatsappPhoneNumberId: options.whatsappPhoneNumberId,
      whatsappToPhoneNumber: options.whatsappToPhoneNumber,
      whatsappApiKey: options.whatsappApiKey,
      whatsappCloudApiVersion: options.whatsappCloudApiVersion,
      whatsappBizOpaqueCallbackData,
      roomName,
      agents: options.agents,
      participantIdentity,
      participantName,
      participantMetadata,
      participantAttributes: options.participantAttributes,
      destinationCountry,
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'DialWhatsAppCall',
      req,
      await this.authHeader({ roomCreate: true }),
    );
    return DialWhatsAppCallResponse.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * Accept an inbound WhatsApp call
   *
   * @param options - WhatsApp call accept options
   * @returns Promise containing the room name
   */
  async acceptWhatsAppCall(
    options: AcceptWhatsAppCallOptions,
  ): Promise<AcceptWhatsAppCallResponse> {
    const whatsappBizOpaqueCallbackData = options.whatsappBizOpaqueCallbackData || '';
    const roomName = options.roomName || '';
    const participantIdentity = options.participantIdentity || '';
    const participantName = options.participantName || '';
    const participantMetadata = options.participantMetadata || '';
    const destinationCountry = options.destinationCountry || '';

    const req = new AcceptWhatsAppCallRequest({
      whatsappPhoneNumberId: options.whatsappPhoneNumberId,
      whatsappApiKey: options.whatsappApiKey,
      whatsappCloudApiVersion: options.whatsappCloudApiVersion,
      whatsappCallId: options.whatsappCallId,
      whatsappBizOpaqueCallbackData,
      sdp: options.sdp,
      roomName,
      agents: options.agents,
      participantIdentity,
      participantName,
      participantMetadata,
      participantAttributes: options.participantAttributes,
      destinationCountry,
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'AcceptWhatsAppCall',
      req,
      await this.authHeader({ roomCreate: true }),
    );
    return AcceptWhatsAppCallResponse.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * Connect an established WhatsApp call (used for business-initiated calls)
   *
   * @param whatsappCallId - Call ID sent by Meta
   * @param sdp - Session description from Meta
   */
  async connectWhatsAppCall(
    whatsappCallId: string,
    sdp: SessionDescription,
  ): Promise<ConnectWhatsAppCallResponse> {
    const req = new ConnectWhatsAppCallRequest({
      whatsappCallId,
      sdp,
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'ConnectWhatsAppCall',
      req,
      await this.authHeader({ roomCreate: true }),
    );
    return ConnectWhatsAppCallResponse.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * Disconnect an active WhatsApp call
   *
   * @param whatsappCallId - Call ID sent by Meta
   * @param whatsappApiKey - The API key of the business that is disconnecting the call
   */
  async disconnectWhatsAppCall(
    whatsappCallId: string,
    whatsappApiKey: string,
  ): Promise<DisconnectWhatsAppCallResponse> {
    const req = new DisconnectWhatsAppCallRequest({
      whatsappCallId,
      whatsappApiKey,
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'DisconnectWhatsAppCall',
      req,
      await this.authHeader({ roomCreate: true }),
    );
    return DisconnectWhatsAppCallResponse.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * Connect a Twilio call to a LiveKit room
   *
   * @param options - Twilio call connection options
   * @returns Promise containing the WebSocket connect URL for Twilio media stream
   */
  async connectTwilioCall(options: ConnectTwilioCallOptions): Promise<ConnectTwilioCallResponse> {
    const participantIdentity = options.participantIdentity || '';
    const participantName = options.participantName || '';
    const participantMetadata = options.participantMetadata || '';
    const destinationCountry = options.destinationCountry || '';

    const req = new ConnectTwilioCallRequest({
      twilioCallDirection: options.twilioCallDirection,
      roomName: options.roomName,
      agents: options.agents,
      participantIdentity,
      participantName,
      participantMetadata,
      participantAttributes: options.participantAttributes,
      destinationCountry,
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'ConnectTwilioCall',
      req,
      await this.authHeader({ roomCreate: true }),
    );
    return ConnectTwilioCallResponse.fromJson(data, { ignoreUnknownFields: true });
  }
}
