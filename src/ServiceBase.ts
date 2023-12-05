import { AccessToken } from './AccessToken';
import { VideoGrant } from './grants';

/**
 * Utilities to handle authentication
 */
export default class ServiceBase {
  private readonly apiKey?: string;

  private readonly secret?: string;

  private readonly ttl: string;

  /**
   * @param apiKey API Key.
   * @param secret API Secret.
   * @param ttl token TTL
   */
  constructor(apiKey?: string, secret?: string, ttl?: string) {
    this.apiKey = apiKey;
    this.secret = secret;
    this.ttl = ttl || '10m';
  }

  async authHeader(grant: VideoGrant): Promise<any> {
    const at = new AccessToken(this.apiKey, this.secret, { ttl: this.ttl });
    at.addGrant(grant);
    return {
      Authorization: `Bearer ${await at.toJwt()}`,
    };
  }
}
