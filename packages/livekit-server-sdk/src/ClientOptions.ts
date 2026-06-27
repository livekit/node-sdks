// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { FailoverConfig } from './failover.js';

/**
 * Options common to all clients
 */
export type ClientOptions = {
  /**
   * Optional timeout, in seconds, for all server requests
   */
  requestTimeout?: number;
  /**
   * Region-failover tuning for API requests. Omit it (the default) to enable
   * failover for LiveKit Cloud hosts only; pass a config to enable it for any
   * host. Set `maxAttempts: 1` to disable.
   */
  failover?: FailoverConfig;
};
