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
import ServiceBase from './ServiceBase';
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
  /**
   * await START_RECORDING chrome log
   */
  awaitStartSignal?: boolean;
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
 * Used to supply multiple outputs with an egress request
 */
export interface EncodedOutputs {
  file?: EncodedFileOutput | undefined;
  stream?: StreamOutput | undefined;
  segments?: SegmentedFileOutput | undefined;
}

export interface ListEgressOptions {
  roomName?: string;
  egressId?: string;
  active?: boolean;
}

/**
 * Client to access Egress APIs
 */
export class EgressClient extends ServiceBase {
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
   * @param roomName room name
   * @param output file or stream output
   * @param opts RoomCompositeOptions
   */
  async startRoomCompositeEgress(
    roomName: string,
    output: EncodedOutputs | EncodedFileOutput | StreamOutput | SegmentedFileOutput,
    opts?: RoomCompositeOptions,
  ): Promise<EgressInfo>;
  /**
   * @deprecated use RoomCompositeOptions instead
   */
  async startRoomCompositeEgress(
    roomName: string,
    output: EncodedOutputs | EncodedFileOutput | StreamOutput | SegmentedFileOutput,
    layout?: string,
    options?: EncodingOptionsPreset | EncodingOptions,
    audioOnly?: boolean,
    videoOnly?: boolean,
    customBaseUrl?: string,
  ): Promise<EgressInfo>;
  async startRoomCompositeEgress(
    roomName: string,
    output: EncodedOutputs | EncodedFileOutput | StreamOutput | SegmentedFileOutput,
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

    const { file, stream, segments, preset, advanced, fileOutputs, streamOutputs, segmentOutputs } =
      this.getOutputParams(output, options);
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
      fileOutputs,
      streamOutputs,
      segmentOutputs,
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
    output: EncodedOutputs | EncodedFileOutput | StreamOutput | SegmentedFileOutput,
    opts?: WebOptions,
  ): Promise<EgressInfo> {
    const audioOnly = opts?.audioOnly || false;
    const videoOnly = opts?.videoOnly || false;
    const awaitStartSignal = opts?.awaitStartSignal || false;
    const { file, stream, segments, preset, advanced, fileOutputs, streamOutputs, segmentOutputs } =
      this.getOutputParams(output, opts?.encodingOptions);
    const req = WebEgressRequest.toJSON({
      url,
      audioOnly,
      videoOnly,
      awaitStartSignal,
      file,
      stream,
      segments,
      preset,
      advanced,
      fileOutputs,
      streamOutputs,
      segmentOutputs,
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
    output: EncodedOutputs | EncodedFileOutput | StreamOutput | SegmentedFileOutput,
    opts?: TrackCompositeOptions,
  ): Promise<EgressInfo>;
  /**
   * @deprecated use TrackCompositeOptions instead
   */
  async startTrackCompositeEgress(
    roomName: string,
    output: EncodedOutputs | EncodedFileOutput | StreamOutput | SegmentedFileOutput,
    audioTrackId?: string,
    videoTrackId?: string,
    options?: EncodingOptionsPreset | EncodingOptions,
  ): Promise<EgressInfo>;
  async startTrackCompositeEgress(
    roomName: string,
    output: EncodedOutputs | EncodedFileOutput | StreamOutput | SegmentedFileOutput,
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

    const { file, stream, segments, preset, advanced, fileOutputs, streamOutputs, segmentOutputs } =
      this.getOutputParams(output, options);
    const req = TrackCompositeEgressRequest.toJSON({
      roomName,
      audioTrackId,
      videoTrackId,
      file,
      stream,
      segments,
      preset,
      advanced,
      fileOutputs,
      streamOutputs,
      segmentOutputs,
    });

    const data = await this.rpc.request(
      svc,
      'StartTrackCompositeEgress',
      req,
      this.authHeader({ roomRecord: true }),
    );
    return EgressInfo.fromJSON(data);
  }

  private isEncodedOutputs(output: any): output is EncodedOutputs {
    return (
      (<EncodedOutputs>output).file !== undefined ||
      (<EncodedOutputs>output).stream !== undefined ||
      (<EncodedOutputs>output).segments !== undefined
    );
  }

  private isEncodedFileOutput(output: any): output is EncodedFileOutput {
    return (
      (<EncodedFileOutput>output).filepath !== undefined ||
      (<EncodedFileOutput>output).fileType !== undefined
    );
  }

  private isSegmentedFileOutput(output: any): output is SegmentedFileOutput {
    return (
      (<SegmentedFileOutput>output).filenamePrefix !== undefined ||
      (<SegmentedFileOutput>output).playlistName !== undefined ||
      (<SegmentedFileOutput>output).filenameSuffix !== undefined
    );
  }

  private isStreamOutput(output: any): output is StreamOutput {
    return (
      (<StreamOutput>output).protocol !== undefined || (<StreamOutput>output).urls !== undefined
    );
  }

  private getOutputParams(
    output: EncodedOutputs | EncodedFileOutput | StreamOutput | SegmentedFileOutput,
    options?: EncodingOptionsPreset | EncodingOptions,
  ) {
    let file: EncodedFileOutput | undefined;
    let fileOutputs: Array<EncodedFileOutput> | undefined;
    let stream: StreamOutput | undefined;
    let streamOutputs: Array<StreamOutput> | undefined;
    let segments: SegmentedFileOutput | undefined;
    let segmentOutputs: Array<SegmentedFileOutput> | undefined;
    let preset: EncodingOptionsPreset | undefined;
    let advanced: EncodingOptions | undefined;

    if (this.isEncodedOutputs(output)) {
      if (output.file !== undefined) {
        fileOutputs = [output.file];
      }
      if (output.stream !== undefined) {
        streamOutputs = [output.stream];
      }
      if (output.segments !== undefined) {
        segmentOutputs = [output.segments];
      }
    } else if (this.isEncodedFileOutput(output)) {
      file = output;
      fileOutputs = [file];
    } else if (this.isSegmentedFileOutput(output)) {
      segments = output;
      segmentOutputs = [segments];
    } else if (this.isStreamOutput(output)) {
      stream = output;
      streamOutputs = [stream];
    }

    if (options) {
      if (typeof options === 'number') {
        preset = <EncodingOptionsPreset>options;
      } else {
        advanced = <EncodingOptions>options;
      }
    }

    return { file, stream, segments, preset, advanced, fileOutputs, streamOutputs, segmentOutputs };
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

    if (typeof output === 'string') {
      websocketUrl = output;
    } else {
      file = <DirectFileOutput>output;
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
   * @param options options to filter listed Egresses, by default returns all
   * Egress instances
   */
  async listEgress(options?: ListEgressOptions): Promise<Array<EgressInfo>>;
  /**
   * @deprecated
   * @param roomName list egress for one room only
   */
  async listEgress(roomName?: string): Promise<Array<EgressInfo>>;
  /**
   * @param roomName list egress for one room only
   */
  async listEgress(options?: string | ListEgressOptions): Promise<Array<EgressInfo>> {
    let req: ListEgressRequest = {};
    if (typeof options === 'string') {
      req.roomName = options;
    } else if (options !== undefined) {
      req = options;
    }

    const data = await this.rpc.request(
      svc,
      'ListEgress',
      ListEgressRequest.toJSON(req),
      this.authHeader({ roomRecord: true }),
    );
    return ListEgressResponse.fromJSON(data).items ?? [];
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
}
