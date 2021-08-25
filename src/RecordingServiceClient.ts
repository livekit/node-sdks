import { AccessToken } from './AccessToken';
import { VideoGrant } from './grants';
import {
  EndRecordingRequest,
  RecordingInput,
  RecordingOutput,
  RecordingOptions,
  RecordingResponse,
  StartRecordingRequest
} from './proto/livekit_recording';
import { livekitPackage, Rpc, TwirpRpc } from './TwirpRPC';

const svc = 'RecordingService';

/**
 * Client to access Recording APIs
 */
export class RecordingServiceClient {
  private readonly rpc: Rpc;

  private readonly apiKey?: string;

  private readonly secret?: string;

  /**
     *
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
     * @param input input url or template
     * @param output output filename, s3, or rtmp
     * @param options recording options
     */
  async startRecording(
    input: RecordingInput,
    output: RecordingOutput,
    options?: RecordingOptions,
  ): Promise<string> {
    const req = StartRecordingRequest.toJSON({input, output, options});
    const data = await this.rpc.request(
      svc,
      'StartRecording',
      req,
      this.authHeader({ roomRecord: true }),
    );
    return RecordingResponse.fromJSON(data).recordingId!;
  }

  async endRecording(recordingId: string): Promise<void> {
    const req = EndRecordingRequest.toJSON({recordingId});
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
