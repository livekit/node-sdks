// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import {
  CreateSIPDispatchRuleRequest,
  CreateSIPInboundTrunkRequest,
  CreateSIPOutboundTrunkRequest,
  CreateSIPParticipantRequest,
  CreateSIPTrunkRequest,
  DeleteSIPDispatchRuleRequest,
  DeleteSIPTrunkRequest,
  ListSIPDispatchRuleRequest,
  ListSIPDispatchRuleResponse,
  ListSIPInboundTrunkRequest,
  ListSIPInboundTrunkResponse,
  ListSIPOutboundTrunkRequest,
  ListSIPOutboundTrunkResponse,
  ListSIPTrunkRequest,
  ListSIPTrunkResponse,
  SIPDispatchRule,
  SIPDispatchRuleDirect,
  SIPDispatchRuleIndividual,
  SIPDispatchRuleInfo,
  SIPInboundTrunkInfo,
  SIPOutboundTrunkInfo,
  SIPParticipantInfo,
  SIPTransport,
  SIPTrunkInfo,
} from '@livekit/protocol';
import ServiceBase from './ServiceBase.js';
import { Rpc, TwirpRpc, livekitPackage } from './TwirpRPC.js';

const svc = 'SIP';

/**
 * @deprecated use CreateSipInboundTrunkOptions or CreateSipOutboundTrunkOptions
 */
export interface CreateSipTrunkOptions {
  name?: string;
  metadata?: string;
  inbound_addresses?: string[];
  inbound_numbers?: string[];
  inbound_username?: string;
  inbound_password?: string;
  outbound_address?: string;
  outbound_username?: string;
  outbound_password?: string;
}
export interface CreateSipInboundTrunkOptions {
  metadata?: string;
  allowed_addresses?: string[];
  allowed_numbers?: string[];
  auth_username?: string;
  auth_password?: string;
}
export interface CreateSipOutboundTrunkOptions {
  metadata?: string;
  transport: SIPTransport;
  auth_username?: string;
  auth_password?: string;
}

export interface SipDispatchRuleDirect {
  type: 'direct';
  roomName: string;
  pin?: string;
}

export interface SipDispatchRuleIndividual {
  type: 'individual';
  roomPrefix: string;
  pin?: string;
}

export interface CreateSipDispatchRuleOptions {
  name?: string;
  metadata?: string;
  trunkIds?: string[];
  hidePhoneNumber?: boolean;
}

export interface CreateSipParticipantOptions {
  participantIdentity?: string;
  participantName?: string;
  participantMetadata?: string;
  dtmf?: string;
  playRingtone?: boolean;
  hidePhoneNumber?: boolean;
}

/**
 * Client to access Egress APIs
 */
export class SipClient extends ServiceBase {
  private readonly rpc: Rpc;

  /**
   * @param host hostname including protocol. i.e. 'https://cluster.livekit.io'
   * @param apiKey API Key, can be set in env var LIVEKIT_API_KEY
   * @param secret API Secret, can be set in env var LIVEKIT_API_SECRET
   */
  constructor(host: string, apiKey?: string, secret?: string) {
    super(apiKey, secret);
    this.rpc = new TwirpRpc(host, livekitPackage);
  }

  /**
   * @param number phone number of the trunk
   * @param opts CreateSipTrunkOptions
   * @deprecated use createSipInboundTrunk or createSipOutboundTrunk
   */
  async createSipTrunk(number: string, opts?: CreateSipTrunkOptions): Promise<SIPTrunkInfo> {
    let inboundAddresses: string[] | undefined;
    let inboundNumbers: string[] | undefined;
    let inboundUsername: string = '';
    let inboundPassword: string = '';
    let outboundAddress: string = '';
    let outboundUsername: string = '';
    let outboundPassword: string = '';
    let name: string = '';
    let metadata: string = '';

    if (opts !== undefined) {
      inboundAddresses = opts.inbound_addresses;
      inboundNumbers = opts.inbound_numbers;
      inboundUsername = opts.inbound_username || '';
      inboundPassword = opts.inbound_password || '';
      outboundAddress = opts.outbound_address || '';
      outboundUsername = opts.outbound_username || '';
      outboundPassword = opts.outbound_password || '';
      name = opts.name || '';
      metadata = opts.metadata || '';
    }

    const req = new CreateSIPTrunkRequest({
      name: name,
      metadata: metadata,
      inboundAddresses: inboundAddresses,
      inboundNumbers: inboundNumbers,
      inboundUsername: inboundUsername,
      inboundPassword: inboundPassword,
      outboundNumber: number,
      outboundAddress: outboundAddress,
      outboundUsername: outboundUsername,
      outboundPassword: outboundPassword,
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'CreateSIPTrunk',
      req,
      await this.authHeader({}, { admin: true }),
    );
    return SIPTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   @param name human-readable name of the trunk
   * @param numbers phone numbers of the trunk
   * @param opts CreateSipTrunkOptions
   */
  async createSipInboundTrunk(
    name: string,
    numbers: string[],
    opts?: CreateSipInboundTrunkOptions,
  ): Promise<SIPInboundTrunkInfo> {
    let allowedAddresses: string[] | undefined;
    let allowedNumbers: string[] | undefined;
    let authUsername: string = '';
    let authPassword: string = '';
    let metadata: string = '';

    if (opts !== undefined) {
      allowedAddresses = opts.allowed_addresses;
      allowedNumbers = opts.allowed_numbers;
      authUsername = opts.auth_username || '';
      authPassword = opts.auth_password || '';
      metadata = opts.metadata || '';
    }

    const req = new CreateSIPInboundTrunkRequest({
      trunk: new SIPInboundTrunkInfo({
        name: name,
        numbers: numbers,
        metadata: metadata,
        allowedAddresses: allowedAddresses,
        allowedNumbers: allowedNumbers,
        authUsername: authUsername,
        authPassword: authPassword,
      }),
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'CreateSIPInboundTrunk',
      req,
      await this.authHeader({}, { admin: true }),
    );
    return SIPInboundTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * @param name human-readable name of the trunk
   * @param address hostname and port of the SIP server to dial
   * @param numbers phone numbers of the trunk
   * @param opts CreateSipTrunkOptions
   */
  async createSipOutboundTrunk(
    name: string,
    address: string,
    numbers: string[],
    opts?: CreateSipOutboundTrunkOptions,
  ): Promise<SIPOutboundTrunkInfo> {
    let authUsername: string = '';
    let authPassword: string = '';
    let transport: SIPTransport = SIPTransport.SIP_TRANSPORT_AUTO;
    let metadata: string = '';

    if (opts !== undefined) {
      authUsername = opts.auth_username || '';
      authPassword = opts.auth_password || '';
      transport = opts.transport || SIPTransport.SIP_TRANSPORT_AUTO;
      metadata = opts.metadata || '';
    }

    const req = new CreateSIPOutboundTrunkRequest({
      trunk: new SIPOutboundTrunkInfo({
        name: name,
        address: address,
        numbers: numbers,
        metadata: metadata,
        transport: transport,
        authUsername: authUsername,
        authPassword: authPassword,
      }),
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'CreateSIPOutboundTrunk',
      req,
      await this.authHeader({}, { admin: true }),
    );
    return SIPOutboundTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * @deprecated use listSipInboundTrunk or listSipOutboundTrunk
   */
  async listSipTrunk(): Promise<Array<SIPTrunkInfo>> {
    const req: Partial<ListSIPTrunkRequest> = {};
    const data = await this.rpc.request(
      svc,
      'ListSIPTrunk',
      new ListSIPTrunkRequest(req).toJson(),
      await this.authHeader({}, { admin: true }),
    );
    return ListSIPTrunkResponse.fromJson(data, { ignoreUnknownFields: true }).items ?? [];
  }

  async listSipInboundTrunk(): Promise<Array<SIPInboundTrunkInfo>> {
    const req: Partial<ListSIPInboundTrunkRequest> = {};
    const data = await this.rpc.request(
      svc,
      'ListSIPInboundTrunk',
      new ListSIPInboundTrunkRequest(req).toJson(),
      await this.authHeader({}, { admin: true }),
    );
    return ListSIPInboundTrunkResponse.fromJson(data, { ignoreUnknownFields: true }).items ?? [];
  }

  async listSipOutboundTrunk(): Promise<Array<SIPOutboundTrunkInfo>> {
    const req: Partial<ListSIPOutboundTrunkRequest> = {};
    const data = await this.rpc.request(
      svc,
      'ListSIPOutboundTrunk',
      new ListSIPOutboundTrunkRequest(req).toJson(),
      await this.authHeader({}, { admin: true }),
    );
    return ListSIPOutboundTrunkResponse.fromJson(data, { ignoreUnknownFields: true }).items ?? [];
  }

  /**
   * @param sipTrunkId sip trunk to delete
   */
  async deleteSipTrunk(sipTrunkId: string): Promise<SIPTrunkInfo> {
    const data = await this.rpc.request(
      svc,
      'DeleteSIPTrunk',
      new DeleteSIPTrunkRequest({ sipTrunkId }).toJson(),
      await this.authHeader({}, { admin: true }),
    );
    return SIPTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * @param rule sip dispatch rule
   * @param opts CreateSipDispatchRuleOptions
   */
  async createSipDispatchRule(
    rule: SipDispatchRuleDirect | SipDispatchRuleIndividual,
    opts?: CreateSipDispatchRuleOptions,
  ): Promise<SIPDispatchRuleInfo> {
    let trunkIds: string[] | undefined;
    let hidePhoneNumber: boolean = false;
    let name: string = '';
    let metadata: string = '';
    let ruleProto: SIPDispatchRule | undefined = undefined;

    if (opts !== undefined) {
      trunkIds = opts.trunkIds;
      hidePhoneNumber = opts.hidePhoneNumber || false;
      name = opts.name || '';
      metadata = opts.metadata || '';
    }
    if (rule.type == 'direct') {
      ruleProto = new SIPDispatchRule({
        rule: {
          case: 'dispatchRuleDirect',
          value: new SIPDispatchRuleDirect({
            roomName: rule.roomName,
            pin: rule.pin || '',
          }),
        },
      });
    } else if (rule.type == 'individual') {
      ruleProto = new SIPDispatchRule({
        rule: {
          case: 'dispatchRuleIndividual',
          value: new SIPDispatchRuleIndividual({
            roomPrefix: rule.roomPrefix,
            pin: rule.pin || '',
          }),
        },
      });
    }

    const req = new CreateSIPDispatchRuleRequest({
      rule: ruleProto,
      trunkIds: trunkIds,
      hidePhoneNumber: hidePhoneNumber,
      name: name,
      metadata: metadata,
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'CreateSIPDispatchRule',
      req,
      await this.authHeader({}, { admin: true }),
    );
    return SIPDispatchRuleInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  async listSipDispatchRule(): Promise<Array<SIPDispatchRuleInfo>> {
    const req: Partial<ListSIPDispatchRuleRequest> = {};
    const data = await this.rpc.request(
      svc,
      'ListSIPDispatchRule',
      new ListSIPDispatchRuleRequest(req).toJson(),
      await this.authHeader({}, { admin: true }),
    );
    return ListSIPDispatchRuleResponse.fromJson(data, { ignoreUnknownFields: true }).items ?? [];
  }

  /**
   * @param sipDispatchRuleId sip trunk to delete
   */
  async deleteSipDispatchRule(sipDispatchRuleId: string): Promise<SIPDispatchRuleInfo> {
    const data = await this.rpc.request(
      svc,
      'DeleteSIPDispatchRule',
      new DeleteSIPDispatchRuleRequest({ sipDispatchRuleId }).toJson(),
      await this.authHeader({}, { admin: true }),
    );
    return SIPDispatchRuleInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * @param sipTrunkId sip trunk to use for the call
   * @param number number to dial
   * @param roomName room to attach the call to
   * @param opts CreateSipParticipantOptions
   */
  async createSipParticipant(
    sipTrunkId: string,
    number: string,
    roomName: string,
    opts?: CreateSipParticipantOptions,
  ): Promise<SIPParticipantInfo> {
    let participantIdentity: string = '';
    let participantName: string = '';
    let participantMetadata: string = '';
    let dtmf: string = '';
    let playRingtone: boolean = false;
    let hidePhoneNumber: boolean = false;

    if (opts !== undefined) {
      participantIdentity = opts.participantIdentity || '';
      participantName = opts.participantName || '';
      participantMetadata = opts.participantMetadata || '';
      dtmf = opts.dtmf || '';
      playRingtone = opts.playRingtone || false;
      hidePhoneNumber = opts.hidePhoneNumber || false;
    }

    const req = new CreateSIPParticipantRequest({
      sipTrunkId: sipTrunkId,
      sipCallTo: number,
      roomName: roomName,
      participantIdentity: participantIdentity,
      participantName: participantName,
      participantMetadata: participantMetadata,
      dtmf: dtmf,
      playRingtone: playRingtone,
      hidePhoneNumber: hidePhoneNumber,
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'CreateSIPParticipant',
      req,
      await this.authHeader({}, { call: true }),
    );
    return SIPParticipantInfo.fromJson(data, { ignoreUnknownFields: true });
  }
}
