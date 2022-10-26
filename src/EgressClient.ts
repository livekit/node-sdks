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
  WebEgressRequest,
} from './proto/livekit_egress';
import { livekitPackage, Rpc, TwirpRpc } from './TwirpRPC';

const svc = 'Egress';

export interface RoomCompositeOptions {
  /**
   * egress layout. optional
   */
  layout?: string;
  /**
   * encoding options or preset. optional
   */
  encodingOptions?: EncodingOptionsPreset | EncodingOptions;
  /**
   * record audio only. optional
   */
  audioOnly?: boolean;
  /**
   * record video only. optional
   */
  videoOnly?: boolean;
  /**
   * custom template url. optional
   */
  customBaseUrl?: string;
}

export interface WebOptions {
  /**
   * encoding options or preset. optional
   */
  encodingOptions?: EncodingOptionsPreset | EncodingOptions;
  /**
   * record audio only. optional
   */
  audioOnly?: boolean;
  /**
   * record video only. optional
   */
  videoOnly?: boolean;
}

export interface TrackCompositeOptions {
  /**
   * audio track ID
   */
  audioTrackId?: string;
  /**
   * video track ID
   */
  videoTrackId?: string;
  /**
   * encoding options or preset. optional
   */
  encodingOptions?: EncodingOptionsPreset | EncodingOptions;
}

/**
 * Client to access Egress APIs
 */
export class EgressClient {
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
  /**
   * @deprecated use RoomCompositeOptions instead
   */
  async startRoomCompositeEgress(
    roomName: string,
    output: EncodedFileOutput | SegmentedFileOutput | StreamOutput,
    layout?: string,
    options?: EncodingOptionsPreset | EncodingOptions,
    audioOnly?: boolean,
    videoOnly?: boolean,
    customBaseUrl?: string,
  ): Promise<EgressInfo>;
  async startRoomCompositeEgress(
    roomName: string,
    output: EncodedFileOutput | SegmentedFileOutput | StreamOutput,
    optsOrLayout?: RoomCompositeOptions | string,
    options?: EncodingOptionsPreset | EncodingOptions,
    audioOnly?: boolean,
    videoOnly?: boolean,
    customBaseUrl?: string,
  ): Promise<EgressInfo> {
    let layout: string | undefined;
    if (optsOrLayout !== undefined) {
      if (typeof optsOrLayout === 'string') {
        layout = optsOrLayout;
      } else {
        const opts = <RoomCompositeOptions>optsOrLayout;
        layout = opts.layout;
        options = opts.encodingOptions;
        audioOnly = opts.audioOnly;
        videoOnly = opts.videoOnly;
        customBaseUrl = opts.customBaseUrl;
      }
    }

    layout ??= '';
    audioOnly ??= false;
    videoOnly ??= false;
    customBaseUrl ??= '';

    const { file, segments, stream, preset, advanced } = this.getOutputParams(output, options);
    const req = RoomCompositeEgressRequest.toJSON({
      roomName,
      layout,
      audioOnly,
      videoOnly,
      customBaseUrl,
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
   * @param url url
   * @param output file or stream output
   * @param opts WebOptions
   */
  async startWebEgress(
    url: string,
    output: EncodedFileOutput | SegmentedFileOutput | StreamOutput,
    opts?: WebOptions,
  ): Promise<EgressInfo> {
    const audioOnly = opts?.audioOnly || false;
    const videoOnly = opts?.videoOnly || false;
    const { file, segments, stream, preset, advanced } = this.getOutputParams(
      output,
      opts?.encodingOptions,
    );
    const req = WebEgressRequest.toJSON({
      url,
      audioOnly,
      videoOnly,
      file,
      stream,
      segments,
      preset,
      advanced,
    });

    const data = await this.rpc.request(
      svc,
      'StartWebEgress',
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
  /**
   * @deprecated use TrackCompositeOptions instead
   */
  async startTrackCompositeEgress(
    roomName: string,
    output: EncodedFileOutput | SegmentedFileOutput | StreamOutput,
    audioTrackId?: string,
    videoTrackId?: string,
    options?: EncodingOptionsPreset | EncodingOptions,
  ): Promise<EgressInfo>;
  async startTrackCompositeEgress(
    roomName: string,
    output: EncodedFileOutput | SegmentedFileOutput | StreamOutput,
    optsOrAudioTrackId?: TrackCompositeOptions | string,
    videoTrackId?: string,
    options?: EncodingOptionsPreset | EncodingOptions,
  ): Promise<EgressInfo> {
    let audioTrackId: string | undefined;
    if (optsOrAudioTrackId !== undefined) {
      if (typeof optsOrAudioTrackId === 'string') {
        audioTrackId = optsOrAudioTrackId;
      } else {
        const opts = <TrackCompositeOptions>optsOrAudioTrackId;
        audioTrackId = opts.audioTrackId;
        videoTrackId = opts.videoTrackId;
        options = opts.encodingOptions;
      }
    }

    audioTrackId ??= '';
    videoTrackId ??= '';

    const { file, segments, stream, preset, advanced } = this.getOutputParams(output, options);
    const req = TrackCompositeEgressRequest.toJSON({
      roomName,
      audioTrackId,
      videoTrackId,
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
