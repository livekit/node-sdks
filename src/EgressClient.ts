import { AccessToken } from './AccessToken';
import { VideoGrant } from './grants';
import {
  DirectFileOutput,
  EgressInfo,
  EncodedFileOutput,
  EncodingOptions,
  EncodingOptionsPreset,
  ListEgressRequest,
  RoomCompositeEgressRequest,
  StopEgressRequest,
  StreamOutput,
  TrackCompositeEgressRequest,
  TrackEgressRequest,
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
   * @param output file or stream output
   * @param layout egress layout
   * @param options encoding options or preset
   * @param audioOnly record audio only
   * @param videoOnly record video only
   * @param customBaseUrl custom template url
   */
  async startRoomCompositeEgress(
    roomName: string,
    output: EncodedFileOutput | StreamOutput,
    layout?: string,
    options?: EncodingOptionsPreset | EncodingOptions,
    audioOnly?: boolean,
    videoOnly?: boolean,
    customBaseUrl?: string,
  ): Promise<EgressInfo> {
    if (!audioOnly) {
      audioOnly = false;
    }
    if (!videoOnly) {
      videoOnly = false;
    }
    if (!customBaseUrl) {
      customBaseUrl = '';
    }

    const { file, stream, preset, advanced } = this.getOutputParams(output, options);
    layout ??= '';
    const req = RoomCompositeEgressRequest.toJSON({
      roomName,
      layout,
      audioOnly,
      videoOnly,
      customBaseUrl,
      file,
      stream,
      preset,
      advanced,
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
   * @param roomName room name
   * @param output file or stream output
   * @param audioTrackId audio track Id
   * @param videoTrackId video track Id
   * @param options encoding options or preset
   */
  async startTrackCompositeEgress(
    roomName: string,
    output: EncodedFileOutput | StreamOutput,
    audioTrackId?: string,
    videoTrackId?: string,
    options?: EncodingOptionsPreset | EncodingOptions,
  ): Promise<EgressInfo> {
    if (!audioTrackId) {
      audioTrackId = '';
    }
    if (!videoTrackId) {
      videoTrackId = '';
    }

    const { file, stream, preset, advanced } = this.getOutputParams(output, options);
    const req = TrackCompositeEgressRequest.toJSON({
      roomName,
      audioTrackId,
      videoTrackId,
      file,
      stream,
      preset,
      advanced,
    });

    const data = await this.rpc.request(
      svc,
      'StartTrackCompositeEgress',
      req,
      this.authHeader({ roomRecord: true }),
    );
    return EgressInfo.fromJSON(data);
  }

  private getOutputParams(
    output: EncodedFileOutput | StreamOutput,
    options?: EncodingOptionsPreset | EncodingOptions,
  ) {
    let file: EncodedFileOutput | undefined;
    let stream: StreamOutput | undefined;
    let preset: EncodingOptionsPreset | undefined;
    let advanced: EncodingOptions | undefined;

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

    return { file, stream, preset, advanced };
  }

  /**
   * @param roomName room name
   * @param output file or websocket output
   * @param trackId track Id
   */
  async startTrackEgress(
    roomName: string,
    output: DirectFileOutput | string,
    trackId: string,
  ): Promise<EgressInfo> {
    let file: DirectFileOutput | undefined;
    let websocketUrl: string | undefined;

    if ((<DirectFileOutput>output).filepath !== undefined) {
      file = <DirectFileOutput>output;
    } else {
      websocketUrl = <string>output;
    }

    const req = TrackEgressRequest.toJSON({
      roomName,
      trackId,
      file,
      websocketUrl,
    });

    const data = await this.rpc.request(
      svc,
      'StartTrackEgress',
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
  async listEgress(roomName?: string): Promise<Array<EgressInfo>> {
    if (!roomName) {
      roomName = '';
    }

    const data = await this.rpc.request(
      svc,
      'ListEgress',
      ListEgressRequest.toJSON({ roomName }),
      this.authHeader({ roomRecord: true }),
    );
    return <EgressInfo[]>JSON.parse(data);
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
