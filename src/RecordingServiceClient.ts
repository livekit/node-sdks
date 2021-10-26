import { AccessToken } from './AccessToken';
import { VideoGrant } from './grants';
import {
  RecordingTemplate, RtmpOutput, RecordingOptions,
  StartRecordingRequest, StartRecordingResponse,
  AddOutputRequest, RemoveOutputRequest, EndRecordingRequest,
} from './proto/livekit_recording';
import { livekitPackage, Rpc, TwirpRpc } from './TwirpRPC';

const svc = 'RecordingService';

/**
 * Client to access Recording APIs
 */
class RecordingServiceClient {
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
   * @param input input url or recording template
   * @param output output filename, s3 url (format s3://bucket/{path/}filename.mp4), or RtmpOutput
   * @param options recording options
   */
  async startRecording(
    input: string | RecordingTemplate,
    output: string | RtmpOutput,
    options?: RecordingOptions,
  ): Promise<string> {
    let url: string | undefined;
    let template: RecordingTemplate | undefined;
    if (typeof input === 'string') {
      url = input;
    } else {
      template = input;
    }

    let rtmp: RtmpOutput | undefined;
    let filepath: string | undefined;
    if (typeof output === 'string') {
      filepath = output;
    } else {
      rtmp = output;
    }

    const req = StartRecordingRequest.toJSON({
      url, template, rtmp, filepath, options,
    });
    const data = await this.rpc.request(
      svc,
      'StartRecording',
      req,
      this.authHeader({ roomRecord: true }),
    );
    return StartRecordingResponse.fromJSON(data).recordingId!;
  }

  async addOutput(recordingId: string, rtmpUrl: string): Promise<void> {
    const req = AddOutputRequest.toJSON({ recordingId, rtmpUrl });
    await this.rpc.request(
      svc,
      'AddOutput',
      req,
      this.authHeader({ roomRecord: true }),
    );
  }

  async removeOutput(recordingId: string, rtmpUrl: string): Promise<void> {
    const req = RemoveOutputRequest.toJSON({ recordingId, rtmpUrl });
    await this.rpc.request(
      svc,
      'RemoveOutput',
      req,
      this.authHeader({ roomRecord: true }),
    );
  }

  async endRecording(recordingId: string): Promise<void> {
    const req = EndRecordingRequest.toJSON({ recordingId });
    await this.rpc.request(
      svc,
      'EndRecording',
      req,
      this.authHeader({ roomRecord: true }),
    );
  }

  private authHeader(grant: VideoGrant): any {
    const at = new AccessToken(this.apiKey, this.secret, { ttl: '10m' });
    at.addGrant(grant);
    return {
      Authorization: `Bearer ${at.toJwt()}`,
    };
  }
}

export default RecordingServiceClient;
