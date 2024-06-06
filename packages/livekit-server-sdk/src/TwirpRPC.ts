// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { JsonValue } from '@bufbuild/protobuf';
import camelcaseKeys from 'camelcase-keys';

// twirp RPC adapter for client implementation

const defaultPrefix = '/twirp';

export const livekitPackage = 'livekit';
export interface Rpc {
  request(service: string, method: string, data: JsonValue, headers?: any): Promise<string>;
}

/**
 * JSON based Twirp V7 RPC
 */
export class TwirpRpc {
  host: string;

  pkg: string;

  prefix: string;

  constructor(host: string, pkg: string, prefix?: string) {
    if (host.startsWith('ws')) {
      host = host.replace('ws', 'http');
    }
    this.host = host;
    this.pkg = pkg;
    this.prefix = prefix || defaultPrefix;
  }

  async request(service: string, method: string, data: any, headers?: any): Promise<any> {
    const path = `${this.prefix}/${this.pkg}.${service}/${method}`;
    const url = new URL(path, this.host);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }
    const parsedResp = await response.json();
    return camelcaseKeys(parsedResp, { deep: true });
  }
}
