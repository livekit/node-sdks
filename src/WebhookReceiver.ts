import { TokenVerifier } from './AccessToken.js';
import { WebhookEvent } from './proto/livekit_webhook_pb.js';

export const authorizeHeader = 'Authorize';

export class WebhookReceiver {
  private verifier: TokenVerifier;

  constructor(apiKey: string, apiSecret: string) {
    this.verifier = new TokenVerifier(apiKey, apiSecret);
  }

  /**
   *
   * @param body string of the posted body
   * @param authHeader `Authorization` header from the request
   * @param skipAuth true to skip auth validation
   * @returns
   */
  async receive(
    body: string,
    authHeader?: string,
    skipAuth: boolean = false,
  ): Promise<WebhookEvent> {
    // verify token
    if (!skipAuth) {
      if (!authHeader) {
        throw new Error('authorization header is empty');
      }
      const claims = await this.verifier.verify(authHeader);
      // confirm sha
      const encoder = new TextEncoder();
      const hash = await crypto.subtle.digest('SHA-256', encoder.encode(body));
      const hashDecoded = btoa(
        Array.from(new Uint8Array(hash))
          .map((v) => String.fromCharCode(v))
          .join(''),
      );

      if (claims.sha256 !== hashDecoded) {
        throw new Error('sha256 checksum of body does not match');
      }
    }

    return WebhookEvent.fromJson(JSON.parse(body));
  }
}
