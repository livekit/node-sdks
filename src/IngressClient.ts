import {
  CreateIngressRequest,
  IngressAudioOptions,
  IngressInfo,
  IngressInput,
  IngressVideoOptions,
  ListIngressRequest,
  ListIngressResponse,
  UpdateIngressRequest,
} from './proto/livekit_ingress';
import { livekitPackage, Rpc, TwirpRpc } from './TwirpRPC';
import { ServiceBase } from './ServiceBase';

const svc = 'Ingress';

export interface CreateIngressOptions {
  /**
   * ingress name. optional
   */
  name?: string;
  /**
   * name of the room to send media to. optional
   */
  roomName?: string;
  /**
   * unique identity of the participant. optional
   */
  participantIdentity?: string;
  /**
   * participant display name
   */
  participantName?: string;
  /**
   * custom audio encoding parameters. optional
   */
  audioParams?: IngressAudioOptions;
  /**
   * custom video encoding parameters. optional
   */
  videoParams?: IngressVideoOptions;
}

export interface UpdateIngressOptions {
  /**
   * ingress name. optional
   */
  name: string;
  /**
   * name of the room to send media to. optional
   */
  roomName?: string;
  /**
   * unique identity of the participant. optional
   */
  participantIdentity?: string;
  /**
   * participant display name
   */
  participantName?: string;
  /**
   * custom audio encoding parameters. optional
   */
  audioParams?: IngressAudioOptions;
  /**
   * custom video encoding parameters. optional
   */
  videoParams?: IngressVideoOptions;
}

/**
 * Client to access Ingress APIs
 */
export class IngressClient extends ServiceBase {
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
   * @param inputType protocol for the ingress
   * @param opts CreateIngressOptions
   */
  async createIngress(inputType: IngressInput, opts?: CreateIngressOptions): Promise<IngressInfo> {
    let name: string = '';
    let roomName: string = '';
    let participantName: string = '';
    let participantIdentity: string = '';
    let audio: IngressAudioOptions | undefined;
    let video: IngressVideoOptions | undefined;

    if (opts !== undefined) {
      name = opts.name || '';
      roomName = opts.roomName || '';
      participantName = opts.participantName || '';
      participantIdentity = opts.participantIdentity || '';
      audio = opts.audioParams;
      video = opts.videoParams;
    }

    const req = CreateIngressRequest.toJSON({
      inputType,
      name,
      roomName,
      participantIdentity,
      participantName,
      audio,
      video,
    });

    const data = await this.rpc.request(
      svc,
      'CreateIngress',
      req,
      this.authHeader({ ingressAdmin: true }),
    );
    return IngressInfo.fromJSON(data);
  }

  /**
   * @param ingressId ID of the ingress to update
   * @param opts UpdateIngressOptions
   */
  async updateIngress(ingressId: string, opts: UpdateIngressOptions): Promise<IngressInfo> {
    const name: string = opts.name || '';
    const roomName: string = opts.roomName || '';
    const participantName: string = opts.participantName || '';
    const participantIdentity: string = opts.participantIdentity || '';
    const audio: IngressAudioOptions | undefined = opts.audioParams;
    const video: IngressVideoOptions | undefined = opts.videoParams;

    const req = UpdateIngressRequest.toJSON({
      ingressId,
      name,
      roomName,
      participantIdentity,
      participantName,
      audio,
      video,
    });

    const data = await this.rpc.request(
      svc,
      'UpdateIngress',
      req,
      this.authHeader({ ingressAdmin: true }),
    );
    return IngressInfo.fromJSON(data);
  }

  /**
   * @param roomName list ingress for one room only
   */
  async listIngress(roomName?: string): Promise<Array<EgressInfo>> {
    roomName ??= '';

    const data = await this.rpc.request(
      svc,
      'ListIngress',
      ListIngressRequest.toJSON({ roomName }),
      this.authHeader({ ingressAdmin: true }),
    );
    return ListIngressResponse.fromJSON(data).items;
  }

  /**
   * @param ingressId ingress to delete
   */
  async deleteIngress(ingressId: string): Promise<Array<EgressInfo>> {
    const data = await this.rpc.request(
      svc,
      'DeleteIngress',
      DeleteIngressRequest.toJSON({ ingressId }),
      this.authHeader({ ingressAdmin: true }),
    );
    return IngressInfo.fromJSON(data);
  }
}
