import * as jwt from "jsonwebtoken";
import { ClaimGrants, VideoGrant } from "./grants";

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

  constructor(apiKey: string, apiSecret: string, options?: AccessTokenOptions) {
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
    if (!this.identity) {
      throw new Error("identity is required but not set");
    }

    const opts: jwt.SignOptions = {
      issuer: this.apiKey,
      expiresIn: this.ttl,
      notBefore: 0,
      jwtid: this.identity,
    };

    return jwt.sign(this.grants, this.apiSecret, opts);
  }
}
