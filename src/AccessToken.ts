import * as jose from 'jose';
import { ClaimGrants, VideoGrant } from './grants.js';

// 6 hours
const defaultTTL = `6h`;

export interface AccessTokenOptions {
  /**
   * amount of time before expiration
   * expressed in seconds or a string describing a time span zeit/ms.
   * eg: '2 days', '10h', or seconds as numeric value
   */
  ttl?: number | string;

  /**
   * display name for the participant, available as `Participant.name`
   */
  name?: string;

  /**
   * identity of the user, required for room join tokens
   */
  identity?: string;

  /**
   * custom metadata to be passed to participants
   */
  metadata?: string;
}

export class AccessToken {
  private apiKey: string;

  private apiSecret: string;

  private grants: ClaimGrants;

  identity?: string;

  ttl: number | string;

  /**
   * Creates a new AccessToken
   * @param apiKey API Key, can be set in env LIVEKIT_API_KEY
   * @param apiSecret Secret, can be set in env LIVEKIT_API_SECRET
   */
  constructor(apiKey?: string, apiSecret?: string, options?: AccessTokenOptions) {
    if (!apiKey) {
      apiKey = process.env.LIVEKIT_API_KEY;
    }
    if (!apiSecret) {
      apiSecret = process.env.LIVEKIT_API_SECRET;
    }
    if (!apiKey || !apiSecret) {
      throw Error('api-key and api-secret must be set');
    } else if (typeof document !== 'undefined') {
      // check against document rather than window because deno provides window
      console.error(
        'You should not include your API secret in your web client bundle.\n\n' +
          'Your web client should request a token from your backend server which should then use ' +
          'the API secret to generate a token. See https://docs.livekit.io/client/connect/',
      );
    }
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.grants = {};
    this.identity = options?.identity;
    this.ttl = options?.ttl || defaultTTL;
    if (typeof this.ttl === 'number') {
      this.ttl = `${this.ttl}s`;
    }
    if (options?.metadata) {
      this.metadata = options.metadata;
    }
    if (options?.name) {
      this.name = options.name;
    }
  }

  /**
   * Adds a video grant to this token.
   * @param grant
   */
  addGrant(grant: VideoGrant) {
    this.grants.video = { ...(this.grants.video ?? {}), ...grant };
  }

  /**
   * Set metadata to be passed to the Participant, used only when joining the room
   */
  set metadata(md: string) {
    this.grants.metadata = md;
  }

  set name(name: string) {
    this.grants.name = name;
  }

  get sha256(): string | undefined {
    return this.grants.sha256;
  }

  set sha256(sha: string | undefined) {
    this.grants.sha256 = sha;
  }

  /**
   * @returns JWT encoded token
   */
  async toJwt(): Promise<string> {
    // TODO: check for video grant validity

    const secret = new TextEncoder().encode(this.apiSecret);
    const jwt = new jose.SignJWT(this.grants)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(this.apiKey)
      .setExpirationTime(this.ttl)
      .setNotBefore(0);
    if (this.identity) {
      jwt.setSubject(this.identity);
    } else if (this.grants.video?.roomJoin) {
      throw Error('identity is required for join but not set');
    }
    return jwt.sign(secret);
  }
}

export class TokenVerifier {
  private apiKey: string;

  private apiSecret: string;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async verify(token: string): Promise<ClaimGrants> {
    const secret = new TextEncoder().encode(this.apiSecret);
    const { payload } = await jose.jwtVerify(token, secret, { issuer: this.apiKey });
    if (!payload) {
      throw Error('invalid token');
    }

    return payload as ClaimGrants;
  }
}
