// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { AccessToken } from './AccessToken.js';
import type { ClaimGrants, SIPGrant, VideoGrant } from './grants.js';

/**
 * Returns a token that carries the given grants, for a client to send in place
 * of one it signs itself. The client calls it before each request with the
 * grants that request needs, so the source can cache and refresh tokens.
 */
export type TokenSource = (grants: ClaimGrants) => Promise<string>;

/**
 * Authentication options for a service client.
 */
export interface ServiceBaseOptions {
  /** API Key. */
  apiKey?: string;
  /** API Secret. */
  secret?: string;
  /** Token TTL. Defaults to `10m`. */
  ttl?: string;
  /** Pre-signed token; sent verbatim, skipping per-call signing. */
  token?: string;
  /** Gets the token for each call, in place of signing it with the API key and secret. */
  tokenSource?: TokenSource;
}

/**
 * Utilities to handle authentication
 */
export class ServiceBase {
  private readonly apiKey?: string;

  private readonly secret?: string;

  private readonly token?: string;

  private readonly tokenSource?: TokenSource;

  private readonly ttl: string;

  /**
   * @param options - authentication options
   */
  constructor(options?: ServiceBaseOptions);
  /**
   * @deprecated pass a {@link ServiceBaseOptions} object instead.
   * @param apiKey - API Key.
   * @param secret - API Secret.
   * @param ttl - token TTL
   */
  constructor(apiKey?: string, secret?: string, ttl?: string);
  constructor(apiKeyOrOptions?: string | ServiceBaseOptions, secret?: string, ttl?: string) {
    const options: ServiceBaseOptions =
      typeof apiKeyOrOptions === 'object'
        ? apiKeyOrOptions
        : { apiKey: apiKeyOrOptions, secret, ttl };
    this.apiKey = options.apiKey;
    this.secret = options.secret;
    this.ttl = options.ttl || '10m';
    this.token = options.token;
    this.tokenSource = options.tokenSource;
  }

  async authHeader(grant: VideoGrant, sip?: SIPGrant): Promise<Record<string, string>> {
    // A pre-signed token is sent verbatim; the caller is responsible for its grants.
    if (this.token) {
      return { Authorization: `Bearer ${this.token}` };
    }
    if (this.tokenSource) {
      const grants: ClaimGrants = {};
      if (grant) {
        grants.video = { ...grant };
      }
      if (sip) {
        grants.sip = { ...sip };
      }
      return { Authorization: `Bearer ${await this.tokenSource(grants)}` };
    }
    const at = new AccessToken(this.apiKey, this.secret, { ttl: this.ttl });
    if (grant) {
      at.addGrant(grant);
    }
    if (sip) {
      at.addSIPGrant(sip);
    }
    return {
      Authorization: `Bearer ${await at.toJwt()}`,
    };
  }
}
