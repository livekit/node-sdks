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

/**
 * Options for {@link LiveKitAPI}. Provide either an `apiKey` and `secret`, or a
 * pre-signed `token`. Any omitted value falls back to its environment variable.
 */
export interface LiveKitAPIOptions extends ClientOptions {
  /** API key. Falls back to the `LIVEKIT_API_KEY` env var. */
  apiKey?: string;
  /** API secret. Falls back to the `LIVEKIT_API_SECRET` env var. */
  secret?: string;
  /** Pre-signed token, sent verbatim. Falls back to the `LIVEKIT_TOKEN` env var. */
  token?: string;
}

/**
 * A single entry point to every LiveKit server API, exposing each service
 * through a property, e.g. `api.room.createRoom(...)`.
 *
 * @example
 * ```ts
 * const api = new LiveKitAPI('https://my.livekit.cloud', { apiKey, secret });
 * await api.room.createRoom({ name: 'my-room' });
 * ```
 */
export class LiveKitAPI {
  readonly #room: RoomServiceClient;

  readonly #egress: EgressClient;

  readonly #ingress: IngressClient;

  readonly #sip: SipClient;

  readonly #agentDispatch: AgentDispatchClient;

  readonly #connector: ConnectorClient;

  /**
   * @param host - server host, including protocol. Falls back to the
   *   `LIVEKIT_URL` env var.
   * @param options - credentials and client options
   */
  constructor(host?: string, options: LiveKitAPIOptions = {}) {
    host = host || process.env.LIVEKIT_URL;
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
    this.#room = new RoomServiceClient(host, apiKey, secret, clientOptions);
    this.#egress = new EgressClient(host, apiKey, secret, clientOptions);
    this.#ingress = new IngressClient(host, apiKey, secret, clientOptions);
    this.#sip = new SipClient(host, apiKey, secret, clientOptions);
    this.#agentDispatch = new AgentDispatchClient(host, apiKey, secret, clientOptions);
    this.#connector = new ConnectorClient(host, apiKey, secret, clientOptions);
  }

  get room(): RoomServiceClient {
    return this.#room;
  }

  get egress(): EgressClient {
    return this.#egress;
  }

  get ingress(): IngressClient {
    return this.#ingress;
  }

  get sip(): SipClient {
    return this.#sip;
  }

  get agentDispatch(): AgentDispatchClient {
    return this.#agentDispatch;
  }

  get connector(): ConnectorClient {
    return this.#connector;
  }
}
