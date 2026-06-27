// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { JsonValue } from '@bufbuild/protobuf';
import type { FailoverConfig } from './failover.js';
import {
  failoverBackoffBase,
  failoverMaxAttempts,
  hostKey,
  pickNext,
  regionOrigins,
  sleep,
} from './failover.js';

// twirp RPC adapter for client implementation

type Options = {
  /** Prefix for the RPC requests */
  prefix?: string;
  /** Timeout for fetch requests, in seconds. Must be within the valid range for abort signal timeouts. */
  requestTimeout?: number;
  /** Region-failover behavior. Defaults to auto (enabled for LiveKit Cloud hosts). */
  failover?: FailoverConfig;
};

const defaultPrefix = '/twirp';
const defaultTimeoutSeconds = 60;

export const livekitPackage = 'livekit';
export interface Rpc {
  request(
    service: string,
    method: string,
    data: JsonValue,
    headers: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    timeout?: number,
  ): Promise<string>;
}

export class TwirpError extends Error {
  status: number;
  code?: string;
  metadata?: Record<string, string>;

  constructor(
    name: string,
    message: string,
    status: number,
    code?: string,
    metadata?: Record<string, string>,
  ) {
    super(message);
    this.name = name;
    this.status = status;
    this.code = code;
    this.metadata = metadata;
  }
}

/**
 * JSON based Twirp V7 RPC
 */
export class TwirpRpc {
  host: string;

  pkg: string;

  prefix: string;

  requestTimeout: number;

  failover: FailoverConfig | undefined;

  constructor(host: string, pkg: string, options?: Options) {
    if (host.startsWith('ws')) {
      host = host.replace('ws', 'http');
    }
    this.host = host;
    this.pkg = pkg;
    this.requestTimeout = options?.requestTimeout ?? defaultTimeoutSeconds;
    this.prefix = options?.prefix || defaultPrefix;
    this.failover = options?.failover;
  }

  /**
   * Issues a Twirp request, failing over to alternative regions on retryable
   * errors. On any transport error or HTTP 5xx it discovers regions via
   * /settings/regions and replays the request — body and headers intact —
   * against the next untried region, with exponential backoff. A 4xx is
   * returned immediately.
   */
  async request(
    service: string,
    method: string,
    data: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    headers: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    timeout = this.requestTimeout,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const path = `${this.prefix}/${this.pkg}.${service}/${method}`;
    const body = JSON.stringify(data);
    const requestHeaders = {
      'Content-Type': 'application/json;charset=UTF-8',
      ...headers,
    };

    const origin = new URL(this.host);
    const maxAttempts = failoverMaxAttempts(this.failover, origin.hostname);
    const attempted = new Set([hostKey(origin)]);
    let regions: string[] | undefined;
    let current = this.host;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const isLast = attempt + 1 >= maxAttempts;
      const init: RequestInit = { method: 'POST', headers: requestHeaders, body };
      if (timeout) {
        init.signal = AbortSignal.timeout(timeout * 1000);
      }

      let response: Response | undefined;
      let transportError: unknown;
      try {
        response = await fetch(new URL(path, current), init);
      } catch (e) {
        transportError = e;
      }

      if (response?.ok) {
        // Return the raw JSON. Every caller parses it with protobuf-es
        // fromJson(), which per the proto3 JSON spec accepts both the proto
        // field names (snake_case) and their json_name (camelCase), so no key
        // conversion is needed. Converting keys would also corrupt map<string,…>
        // entries (e.g. participant attributes), whose keys are user data.
        return (await response.json()) as Record<string, unknown>;
      }

      // Only retryable failures (a transport error or HTTP 5xx) continue;
      // a 4xx is terminal.
      const retryable = transportError !== undefined || (!!response && response.status >= 500);
      let next: string | undefined;
      if (retryable && !isLast) {
        if (!regions) {
          regions = await regionOrigins(origin, headers);
        }
        next = pickNext(regions, attempted);
      }

      if (!retryable || next === undefined) {
        if (response) {
          throw await toTwirpError(response);
        }
        throw transportError;
      }

      await sleep(failoverBackoffBase(this.failover) * 2 ** attempt);
      attempted.add(hostKey(new URL(next)));
      current = next;
    }

    throw new Error('failover loop exited without returning'); // unreachable
  }
}

/** Builds a TwirpError from a non-2xx response, mirroring Twirp's JSON error shape. */
async function toTwirpError(response: Response): Promise<TwirpError> {
  const isJson = response.headers.get('content-type') === 'application/json';
  let errorMessage = 'Unknown internal error';
  let errorCode: string | undefined = undefined;
  let metadata: Record<string, string> | undefined = undefined;
  try {
    if (isJson) {
      const parsedError = (await response.json()) as Record<string, unknown>;
      if ('msg' in parsedError) {
        errorMessage = <string>parsedError.msg;
      }
      if ('code' in parsedError) {
        errorCode = <string>parsedError.code;
      }
      if ('meta' in parsedError) {
        metadata = <Record<string, string>>parsedError.meta;
      }
    } else {
      errorMessage = await response.text();
    }
  } catch (e) {
    // parsing went wrong, no op and we keep default error message
    console.debug(`Error when trying to parse error message, using defaults`, e);
  }
  return new TwirpError(response.statusText, errorMessage, response.status, errorCode, metadata);
}
