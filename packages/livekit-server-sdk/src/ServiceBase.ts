// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { AccessToken } from './AccessToken.js';
import type { SIPGrant, VideoGrant } from './grants.js';

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
}

/**
 * Utilities to handle authentication
 */
export class ServiceBase {
  private readonly apiKey?: string;

  private readonly secret?: string;

  private readonly token?: string;

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
  }

  async authHeader(grant: VideoGrant, sip?: SIPGrant): Promise<Record<string, string>> {
    // A pre-signed token is sent verbatim; the caller is responsible for its grants.
    if (this.token) {
      return { Authorization: `Bearer ${this.token}` };
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
