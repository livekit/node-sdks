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
   * Region-failover behavior for API requests. Defaults to auto, which fails
   * over to alternative regions for LiveKit Cloud hosts on retryable errors.
   */
  failover?: FailoverConfig;
};
