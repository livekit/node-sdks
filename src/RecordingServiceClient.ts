import { AccessToken } from './AccessToken'
import { VideoGrant } from './grants'
import { RecordingOptions, RecordingS3Output, RecordingTemplate } from './proto/livekit_models'
import { StartRecordingRequest, EndRecordingRequest, RecordingResponse } from "./proto/livekit_recording";
import { TwirpRpc, Rpc, livekitPackage } from './TwirpRPC'

const svc = 'RoomService';

/**
 * Client to access Room APIs
 */
export class RoomServiceClient {
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
     * Required: either url or template, and either file, s3, or rtmp.
     * @param url input url
     * @param template input template
     * @param file output filename
     * @param s3 output s3 location
     * @param rtmp output rtmp address
     * @param options recording options
     */
    async startRecording(
        url?: string | undefined,
        template?: RecordingTemplate | undefined,
        file?: string | undefined,
        s3?: RecordingS3Output | undefined,
        rtmp?: string | undefined,
        options?: RecordingOptions | undefined,
    ): Promise<string> {
      const req = StartRecordingRequest.toJSON({
        url,
        template,
        file,
        s3,
        rtmp,
        options
      });
      const data = await this.rpc.request(
          svc,
          'StartRecording',
          req,
          this.authHeader({ roomRecord: true })
      );
      return RecordingResponse.fromJSON(data).recordingId!;
    }

    async endRecording(recordingId: string): Promise<void> {
      const req = EndRecordingRequest.toJSON({
        recordingId: recordingId,
      });
      await this.rpc.request(
          svc,
          'EndRecording',
          req,
          this.authHeader({ roomRecord: true })
      );
    }

    private authHeader(grant: VideoGrant): any {
        const at = new AccessToken(this.apiKey, this.secret, { ttl: '10m' });
        at.addGrant(grant);
        return {
            Authorization: 'Bearer ' + at.toJwt(),
        };
    }
}
