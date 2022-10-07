import { AccessToken } from './AccessToken';
import { VideoGrant } from './grants';
import {
  DirectFileOutput,
  EgressInfo,
  EncodedFileOutput,
  EncodingOptions,
  EncodingOptionsPreset,
  ListEgressRequest,
  ListEgressResponse,
  RoomCompositeEgressRequest,
  SegmentedFileOutput,
  StopEgressRequest,
  StreamOutput,
  TrackCompositeEgressRequest,
  TrackEgressRequest,
  UpdateLayoutRequest,
  UpdateStreamRequest,
} from './proto/livekit_egress';
import { livekitPackage, Rpc, TwirpRpc } from './TwirpRPC';

const svc = 'Egress';

export interface RoomCompositeOptions {
  /**
   * egress layout. optional
   */
  layout?: string,
  /**
   * encoding options or preset. optional
   */
  encodingOptions?: EncodingOptionsPreset | EncodingOptions,
  /**
   * record audio only. optional
   */
  audioOnly?: boolean,
  /**
   * record video only. optional
   */
  videoOnly?: boolean,
  /**
   * custom template url. optional
   */
  customBaseUrl?: string,
  /**
   * disable upload of json manifest file. optional
   */
  disableManifest?: boolean,
}

export interface TrackCompositeOptions {
  /**
   * encoding options or preset. optional
   */
  encodingOptions?: EncodingOptionsPreset | EncodingOptions,
  /**
   * disable upload of json manifest file. optional
   */
  disableManifest?: boolean,
}

export interface TrackOptions {
  /**
   * disable upload of json manifest file. optional
   */
  disableManifest?: boolean,
}

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
   * @param opts RoomCompositeOptions
   */
  async startRoomCompositeEgress(
    roomName: string,
    output: EncodedFileOutput | SegmentedFileOutput | StreamOutput,
    opts?: RoomCompositeOptions,
  ): Promise<EgressInfo>;
  async startRoomCompositeEgress(
    roomName: string,
    output: EncodedFileOutput | SegmentedFileOutput | StreamOutput,
    layout?: string,
    options?: EncodingOptionsPreset | EncodingOptions,
    audioOnly?: boolean,
    videoOnly?: boolean,
    customBaseUrl?: string,
    disableManifest?: boolean,
  ): Promise<EgressInfo>;
  async startRoomCompositeEgress(
    roomName: string,
    output: EncodedFileOutput | SegmentedFileOutput | StreamOutput,
    optsOrLayout?: RoomCompositeOptions | string,
    options?: EncodingOptionsPreset | EncodingOptions,
    audioOnly?: boolean,
    videoOnly?: boolean,
    customBaseUrl?: string,
    disableManifest?: boolean,
  ): Promise<EgressInfo> {
    let layout: string
    if (typeof optsOrLayout === 'string') {
      layout = optsOrLayout
    } else {
      const opts = <RoomCompositeOptions>optsOrLayout
      options = opts.encodingOptions
      audioOnly = opts.audioOnly
      videoOnly = opts.videoOnly
      customBaseUrl = opts.customBaseUrl
      disableManifest = opts.disableManifest
    }

    layout ??= '';
    audioOnly ??= false;
    videoOnly ??= false;
    customBaseUrl ??= '';
    disableManifest ??= false;

    const { file, segments, stream, preset, advanced } = this.getOutputParams(output, options);
    const req = RoomCompositeEgressRequest.toJSON({
      roomName,
      layout,
      audioOnly,
      videoOnly,
      customBaseUrl,
      disableManifest,
      file,
      stream,
      segments,
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
   * @param opts TrackCompositeOptions
   */
  async startTrackCompositeEgress(
    roomName: string,
    output: EncodedFileOutput | SegmentedFileOutput | StreamOutput,
    opts?: TrackCompositeOptions,
  ): Promise<EgressInfo>;
  async startTrackCompositeEgress(
    roomName: string,
    output: EncodedFileOutput | SegmentedFileOutput | StreamOutput,
    audioTrackId?: string,
    videoTrackId?: string,
    options?: EncodingOptionsPreset | EncodingOptions,
    disableManifest?: boolean,
  ): Promise<EgressInfo>;
  async startTrackCompositeEgress(
    roomName: string,
    output: EncodedFileOutput | SegmentedFileOutput | StreamOutput,
    optsOrAudioTrackId?: TrackCompositeOptions | string,
    videoTrackId?: string,
    options?: EncodingOptionsPreset | EncodingOptions,
    disableManifest?: boolean,
  ): Promise<EgressInfo> {

    let audioTrackId: string
    if (typeof optsOrAudioTrackId === 'string') {
      audioTrackId = optsOrAudioTrackId
    } else {
      const opts = <TrackCompositeOptions>optsOrAudioTrackId
      options = opts.encodingOptions
      disableManifest = opts.disableManifest
    }
    audioTrackId ??= '';
    videoTrackId ??= '';
    disableManifest ??= false;

    const { file, segments, stream, preset, advanced } = this.getOutputParams(output, options);
    const req = TrackCompositeEgressRequest.toJSON({
      roomName,
      audioTrackId,
      videoTrackId,
      disableManifest,
      file,
      stream,
      segments,
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
    output: EncodedFileOutput | SegmentedFileOutput | StreamOutput,
    options?: EncodingOptionsPreset | EncodingOptions,
  ) {
    let file: EncodedFileOutput | undefined;
    let stream: StreamOutput | undefined;
    let segments: SegmentedFileOutput | undefined;
    let preset: EncodingOptionsPreset | undefined;
    let advanced: EncodingOptions | undefined;

    if ((<EncodedFileOutput>output).filepath !== undefined) {
      file = <EncodedFileOutput>output;
    } else if ((<SegmentedFileOutput>output).filenamePrefix !== undefined) {
      segments = <SegmentedFileOutput>output;
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

    return { file, segments, stream, preset, advanced };
  }

  /**
   * @param roomName room name
   * @param output file or websocket output
   * @param trackId track Id
   * @param opts TrackOptions
   */
  async startTrackEgress(
    roomName: string,
    output: DirectFileOutput | string,
    trackId: string,
    opts?: TrackOptions,
  ): Promise<EgressInfo>;
  async startTrackEgress(
    roomName: string,
    output: DirectFileOutput | string,
    trackId: string,
    disableManifest?: boolean,
  ): Promise<EgressInfo>;
  async startTrackEgress(
    roomName: string,
    output: DirectFileOutput | string,
    trackId: string,
    optsOrDisableManifest?: TrackOptions | boolean,
  ): Promise<EgressInfo> {
    let disableManifest: boolean | undefined
    if (typeof optsOrDisableManifest === 'boolean') {
      disableManifest = optsOrDisableManifest
    } else {
      const opts = <TrackOptions>optsOrDisableManifest
      disableManifest = opts.disableManifest
    }

    let file: DirectFileOutput | undefined;
    let websocketUrl: string | undefined;
    disableManifest ??= false;

    if ((<DirectFileOutput>output).filepath !== undefined) {
      file = <DirectFileOutput>output;
    } else {
      websocketUrl = <string>output;
    }

    const req = TrackEgressRequest.toJSON({
      roomName,
      trackId,
      disableManifest,
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
    addOutputUrls ??= [];
    removeOutputUrls ??= [];

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
    roomName ??= '';

    const data = await this.rpc.request(
      svc,
      'ListEgress',
      ListEgressRequest.toJSON({ roomName }),
      this.authHeader({ roomRecord: true }),
    );
    return ListEgressResponse.fromJSON(data).items;
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
