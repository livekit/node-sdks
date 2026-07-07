// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { AgentDispatchClient } from './AgentDispatchClient.js';
import type { ClientOptions } from './ClientOptions.js';
import { ConnectorClient } from './ConnectorClient.js';
import { EgressClient } from './EgressClient.js';
import { IngressClient } from './IngressClient.js';
import { RoomServiceClient } from './RoomServiceClient.js';
import { SipClient } from './SipClient.js';

/** Server host and non-auth options, shared by both authentication modes. */
interface LiveKitAPICommonOptions {
  /** Server host, including protocol. Falls back to the `LIVEKIT_URL` env var. */
  host?: string;
  /** Optional timeout, in seconds, for all server requests. */
  requestTimeout?: number;
  /**
   * Whether to fail over to alternative regions on retryable errors (LiveKit
   * Cloud hosts only). Defaults to true; set to false to disable.
   */
  failover?: boolean;
}

/** API key and secret authentication (recommended for backend use). */
interface ApiKeyAuth {
  /** API key. Falls back to the `LIVEKIT_API_KEY` env var. */
  apiKey?: string;
  /** API secret. Falls back to the `LIVEKIT_API_SECRET` env var. */
  secret?: string;
  token?: never;
}

/** Pre-signed token authentication (client-side use; no secret required). */
interface TokenAuth {
  /** Pre-signed token, sent verbatim. Falls back to the `LIVEKIT_TOKEN` env var. */
  token: string;
  apiKey?: never;
  secret?: never;
}

/**
 * Options for {@link LiveKitAPI}. Provide either an `apiKey` and `secret` or a
 * pre-signed `token` — the two modes are mutually exclusive. Any omitted value
 * falls back to its environment variable (`LIVEKIT_URL`, `LIVEKIT_API_KEY`,
 * `LIVEKIT_API_SECRET`, `LIVEKIT_TOKEN`).
 */
export type LiveKitAPIOptions = LiveKitAPICommonOptions & (ApiKeyAuth | TokenAuth);

/**
 * A single entry point to every LiveKit server API, exposing each service
 * through a property, e.g. `api.room.createRoom(...)`.
 *
 * @example
 * ```ts
 * const api = new LiveKitAPI({ apiKey, secret }); // or new LiveKitAPI() to read from env
 * await api.room.createRoom({ name: 'my-room' });
 * ```
 */
export class LiveKitAPI {
  private readonly _room: RoomServiceClient;

  private readonly _egress: EgressClient;

  private readonly _ingress: IngressClient;

  private readonly _sip: SipClient;

  private readonly _agentDispatch: AgentDispatchClient;

  private readonly _connector: ConnectorClient;

  /**
   * @param options - server host, credentials, and client options; each value
   *   falls back to its environment variable when omitted.
   */
  constructor(options: LiveKitAPIOptions = {}) {
    const host = options.host || process.env.LIVEKIT_URL;
    if (!host) {
      throw new Error('host is required (pass it or set LIVEKIT_URL)');
    }
    const { apiKey, secret } = options;
    // Only fall back to LIVEKIT_TOKEN when no explicit credentials were given, so
    // an ambient token can't silently override a passed-in api key and secret.
    const token = options.token || (apiKey || secret ? undefined : process.env.LIVEKIT_TOKEN);
    if (!token && !(apiKey ?? process.env.LIVEKIT_API_KEY)) {
      throw new Error('either a token or an API key and secret are required');
    }

    const clientOptions: ClientOptions = {
      requestTimeout: options.requestTimeout,
      failover: options.failover,
      token,
    };
    this._room = new RoomServiceClient(host, apiKey, secret, clientOptions);
    this._egress = new EgressClient(host, apiKey, secret, clientOptions);
    this._ingress = new IngressClient(host, apiKey, secret, clientOptions);
    this._sip = new SipClient(host, apiKey, secret, clientOptions);
    this._agentDispatch = new AgentDispatchClient(host, apiKey, secret, clientOptions);
    this._connector = new ConnectorClient(host, apiKey, secret, clientOptions);
  }

  get room(): RoomServiceClient {
    return this._room;
  }

  get egress(): EgressClient {
    return this._egress;
  }

  get ingress(): IngressClient {
    return this._ingress;
  }

  get sip(): SipClient {
    return this._sip;
  }

  get agentDispatch(): AgentDispatchClient {
    return this._agentDispatch;
  }

  get connector(): ConnectorClient {
    return this._connector;
  }
}
