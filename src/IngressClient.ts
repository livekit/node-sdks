import { AccessToken } from './AccessToken';
import { VideoGrant } from './grants';
import {
  CreateIngressRequest,
  IngressAudioOptions,
  IngressInfo,
  IngressInput,
  IngressState,
  IngressVideoOptions,
  ListIngressRequest,
  ListIngressResponse,
  UpdateIngressRequest,

} from './proto/livekit_ingress';
import { livekitPackage, Rpc, TwirpRpc } from './TwirpRPC';

const svc = 'Ingress';

export interface CreateIngressOptions {
  /**
   * ingress name. optional
   */
  name: string;
  /**
   * name of the room to send media to. optional
   */
  roomName?: string;
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
export class IngressClient {
  private readonly rpc: Rpc;

  private readonly apiKey?: string;

  private readonly secret?: string;

  /**
   * @param host hostname including protocol. i.e. 'https://cluster.livekit.io'
   * @param apiKey API Key, can be set in env var LIVEKIT_API_KEY
   * @param secret API Secret, can be set in env var LIVEKIT_API_SECRET
   */
  constructor(host: string, apiKey?: string, secret?: string) {
    this.rpc = new TwirpRpc(host, livekitPackage);
    this.apiKey = apiKey;
    this.secret = secret;
  }

  /**
   * @param inputType protocol for the ingress
   * @param participantIdentity identity to publish under 
   * @param opts CreateIngressOptions
   */
  async createIngress(
    inputType: IngressInput,
    participantIdentity: string,
    opts?: CreateIngressOptions,
  ): Promise<IngressInfo> {
    let name: string;
    let roomName: string;
    let participantName: string;
    let audio: IngressAudioOptions | undefined
    let video: IngressVideoOptions | undefined

    if (opts !== undefined) {
        name = opts.name;
        roomName = opts.roomName || '';
        participantName = opts.participantName || '';
        audio = opts.audioParams;
        video = opts.videoParams;
    }

    name ??= ''
    roomName ??= ''
    participantName ??= ''

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
      this.authHeader(participantIdentity, { roomJoin: true, room: roomName }),
    );
    return IngressInfo.fromJSON(data);
  }

  private authHeader(participantIdentity: string, grant: VideoGrant): any {
    const at = new AccessToken(this.apiKey, this.secret, { ttl: '10m', identity: participantIdentity });
    at.addGrant(grant);
    return {
      Authorization: `Bearer ${at.toJwt()}`,
    };
  }
}
