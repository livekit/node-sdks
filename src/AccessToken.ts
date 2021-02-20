import * as jwt from 'jsonwebtoken';
import { ClaimGrants, VideoGrant } from './grants';

// 6 hours
const defaultTTL = 4 * 60 * 60;

export interface AccessTokenOptions {
  /**
   * amount of time before expiration
   * expressed in seconds or a string describing a time span zeit/ms.
   * eg: '2 days', '10h', or seconds as numeric value
   */
  ttl?: number | string;

  /**
   * identity of the user, required for room join tokens
   */
  identity?: string;

  /**
   * custom metadata to be passed to participants
   */
  metadata?: object;
}

export class AccessToken {
  private apiKey: string;
  private apiSecret: string;
  private grants: ClaimGrants;

  identity?: string;
  ttl?: number | string;

  /**
   * Creates a new AccessToken
   * @param apiKey API Key, can be set in env LIVEKIT_API_KEY
   * @param apiSecret Secret, can be set in env LIVEKIT_API_SECRET
   */
  constructor(
    apiKey?: string,
    apiSecret?: string,
    options?: AccessTokenOptions
  ) {
    if (!apiKey) {
      apiKey = process.env.LIVEKIT_API_KEY;
    }
    if (!apiSecret) {
      apiSecret = process.env.LIVEKIT_API_SECRET;
    }
    if (!apiKey || !apiSecret) {
      throw 'api-key and api-secret must be set';
    }

    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.grants = {};
    this.identity = options?.identity;
    this.ttl = options?.ttl || defaultTTL;
    if (options?.metadata) {
      this.metadata = options.metadata;
    }
  }

  /**
   * Adds a video grant to this token.
   * @param grant
   */
  addGrant(grant: VideoGrant) {
    this.grants.video = grant;
  }

  /**
   * Set metadata to be passed to the Participant, used only when joining the room
   */
  set metadata(md: object) {
    this.grants.metadata = md;
  }

  /**
   * @returns JWT encoded token
   */
  toJwt(): string {
    // TODO: check for video grant validity

    const opts: jwt.SignOptions = {
      issuer: this.apiKey,
      expiresIn: this.ttl,
      notBefore: 0,
    };
    if (this.identity) {
      opts.jwtid = this.identity;
    } else if (this.grants.video?.roomJoin) {
      throw 'identity is required for join but not set';
    }
    return jwt.sign(this.grants, this.apiSecret, opts);
  }
}
