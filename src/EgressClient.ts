import { AccessToken } from './AccessToken';
import { VideoGrant } from './grants';
import {
  EgressInfo,
  EncodedFileOutput,
  EncodingOptions,
  EncodingOptionsPreset,
  ListEgressRequest,
  RoomCompositeEgressRequest,
  StopEgressRequest,
  StreamOutput,
  UpdateLayoutRequest,
  UpdateStreamRequest,
} from './proto/livekit_egress';
import { livekitPackage, Rpc, TwirpRpc } from './TwirpRPC';

const svc = 'Egress';

/**
* Client to access Egress APIs
*/
export default class EgressClient {
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
  * @param roomName room name
  * @param layout egress layout
  * @param output output filepath or RtmpOutput
  * @param options egress options or preset
  * @param audioOnly record audio only
  * @param videoOnly record video only
  * @param customBaseUrl custom template url
  */
  async startRoomCompositeEgress(
    roomName: string,
    layout: string,
    output: EncodedFileOutput | StreamOutput,
    options?: EncodingOptionsPreset | EncodingOptions,
    audioOnly?: boolean,
    videoOnly?: boolean,
    customBaseUrl?: string,
  ): Promise<EgressInfo> {
    let file: EncodedFileOutput | undefined;
    let stream: StreamOutput | undefined;
    let preset: EncodingOptionsPreset | undefined;
    let advanced: EncodingOptions | undefined;

    if (!audioOnly) {
      audioOnly = false;
    }
    if (!videoOnly) {
      videoOnly = false;
    }
    if (!customBaseUrl) {
      customBaseUrl = '';
    }

    if ((<EncodedFileOutput>output).filepath !== undefined) {
      file = <EncodedFileOutput>output;
    } else {
      stream = <StreamOutput>output;
    }

    if (options) {
      if (typeof options === 'number') {
        preset = <EncodingOptionsPreset>options;
      } else {
        advanced = <EncodingOptions>options;
      }
    }

    const req = RoomCompositeEgressRequest.toJSON({
      roomName, layout, audioOnly, videoOnly, file, stream, preset, advanced, customBaseUrl,
    });

    const data = await this.rpc.request(
      svc,
      'StartRoomCompositeEgress',
      req,
      this.authHeader({ roomRecord: true }),
    );
    return EgressInfo.fromJSON(data);
  }

  /**
  * @param egressId
  * @param layout
  */
  async updateLayout(egressId: string, layout: string): Promise<EgressInfo> {
    const data = await this.rpc.request(
      svc,
      'UpdateLayout',
      UpdateLayoutRequest.toJSON({ egressId, layout }),
      this.authHeader({ roomRecord: true }),
    );
    return EgressInfo.fromJSON(data);
  }

  /**
  * @param egressId
  * @param addOutputUrls
  * @param removeOutputUrls
  */
  async updateStream(
    egressId: string,
    addOutputUrls?: string[],
    removeOutputUrls?: string[],
  ): Promise<EgressInfo> {
    if (!addOutputUrls) {
      addOutputUrls = [];
    }
    if (!removeOutputUrls) {
      removeOutputUrls = [];
    }

    const data = await this.rpc.request(
      svc,
      'UpdateStream',
      UpdateStreamRequest.toJSON({ egressId, addOutputUrls, removeOutputUrls }),
      this.authHeader({ roomRecord: true }),
    );
    return EgressInfo.fromJSON(data);
  }

  /**
   * @param roomName list egress for one room only
   */
  async listEgress(roomName?: string): Promise<EgressInfo> {
    if (!roomName) {
      roomName = '';
    }

    const data = await this.rpc.request(
      svc,
      'ListEgress',
      ListEgressRequest.toJSON({ roomName }),
      this.authHeader({ roomRecord: true }),
    );
    return EgressInfo.fromJSON(data);
  }

  /**
  * @param egressId
  */
  async stopEgress(egressId: string): Promise<EgressInfo> {
    const data = await this.rpc.request(
      svc,
      'StopEgress',
      StopEgressRequest.toJSON({ egressId }),
      this.authHeader({ roomRecord: true }),
    );
    return EgressInfo.fromJSON(data);
  }

  private authHeader(grant: VideoGrant): any {
    const at = new AccessToken(this.apiKey, this.secret, { ttl: '10m' });
    at.addGrant(grant);
    return {
      Authorization: `Bearer ${at.toJwt()}`,
    };
  }
}
