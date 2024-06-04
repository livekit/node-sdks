import {
  SIPTrunkInfo,
  CreateSIPTrunkRequest,
  ListSIPTrunkRequest,
  ListSIPTrunkResponse,
  DeleteSIPTrunkRequest,
  SIPDispatchRule,
  SIPDispatchRuleInfo,
  CreateSIPDispatchRuleRequest,
  ListSIPDispatchRuleRequest,
  ListSIPDispatchRuleResponse,
  DeleteSIPDispatchRuleRequest,
  SIPParticipantInfo,
  SIPDispatchRuleDirect,
  SIPDispatchRuleIndividual,
  CreateSIPParticipantRequest,
} from '@livekit/protocol';
import ServiceBase from './ServiceBase.js';
import { livekitPackage, Rpc, TwirpRpc } from './TwirpRPC.js';

const svc = 'SIP';

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

    const data = await this.rpc.request(svc, 'CreateSIPTrunk', req, await this.authHeader({}));
    return SIPTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  async listSipTrunk(): Promise<Array<SIPTrunkInfo>> {
    let req: Partial<ListSIPTrunkRequest> = {};
    const data = await this.rpc.request(
      svc,
      'ListSIPTrunk',
      new ListSIPTrunkRequest(req).toJson(),
      await this.authHeader({}),
    );
    return ListSIPTrunkResponse.fromJson(data, { ignoreUnknownFields: true }).items ?? [];
  }

  /**
   * @param sipTrunkId sip trunk to delete
   */
  async deleteSipTrunk(sipTrunkId: string): Promise<SIPTrunkInfo> {
    const data = await this.rpc.request(
      svc,
      'DeleteSIPTrunk',
      new DeleteSIPTrunkRequest({ sipTrunkId }).toJson(),
      await this.authHeader({}),
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
      await this.authHeader({}),
    );
    return SIPDispatchRuleInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  async listSipDispatchRule(): Promise<Array<SIPDispatchRuleInfo>> {
    let req: Partial<ListSIPDispatchRuleRequest> = {};
    const data = await this.rpc.request(
      svc,
      'ListSIPDispatchRule',
      new ListSIPDispatchRuleRequest(req).toJson(),
      await this.authHeader({}),
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
      await this.authHeader({}),
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

    if (opts !== undefined) {
      participantIdentity = opts.participantIdentity || '';
      participantName = opts.participantName || '';
      participantMetadata = opts.participantMetadata || '';
      dtmf = opts.dtmf || '';
      playRingtone = opts.playRingtone || false;
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
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'CreateSIPParticipant',
      req,
      await this.authHeader({}),
    );
    return SIPParticipantInfo.fromJson(data, { ignoreUnknownFields: true });
  }
}
