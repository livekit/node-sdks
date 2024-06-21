// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { AccessToken } from './AccessToken.js';
import { SIPGrant, VideoGrant } from './grants.js';

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

  async authHeader(grant: VideoGrant, sip?: SIPGrant): Promise<any> {
    const at = new AccessToken(this.apiKey, this.secret, { ttl: this.ttl });
    at.addGrant(grant);
    if (sip) {
      at.addSIPGrant(sip);
    }
    return {
      Authorization: `Bearer ${await at.toJwt()}`,
    };
  }
}
