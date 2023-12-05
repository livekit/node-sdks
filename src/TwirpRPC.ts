import camelcaseKeys from 'camelcase-keys';
import type { JsonValue } from '@bufbuild/protobuf';

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

  request(service: string, method: string, data: any, headers?: any): Promise<any> {
    const path = `${this.prefix}/${this.pkg}.${service}/${method}`;
    const url = new URL(path, this.host);
    return new Promise<any>((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          ...headers,
        },
        body: JSON.stringify(data),
      })
        .then(async (res) => {
          resolve(camelcaseKeys(await res.json(), { deep: true }));
        })
        .catch(reject);
    });
  }
}
