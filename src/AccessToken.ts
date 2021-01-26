import * as jwt from 'jsonwebtoken';
import { ClaimGrants, VideoGrant } from './grants';

// 6 hours
const defaultTTL = 4 * 60 * 60;

export interface AccessTokenOptions {
  // amount of time before expiration
  // expressed in seconds or a string describing a time span zeit/ms.
  // eg: '2 days', '10h', or seconds as numeric value
  ttl?: number | string;
  // identity of the user
  identity?: string;
}

export class AccessToken {
  private apiKey: string;
  private apiSecret: string;
  private grants: ClaimGrants;
  identity?: string;
  ttl?: number | string;

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
  }

  addGrant(grant: VideoGrant) {
    this.grants.video = grant;
    if (grant.room) {
      // default to join token
      grant.roomJoin = true;
    }
  }

  toJwt(): string {
    const opts: jwt.SignOptions = {
      issuer: this.apiKey,
      expiresIn: this.ttl,
      notBefore: 0,
    };
    if (this.identity) {
      opts.jwtid = this.identity;
    } else if (this.grants.video?.roomJoin) {
      throw 'identity is required for joining but not set';
    }
    return jwt.sign(this.grants, this.apiSecret, opts);
  }
}
