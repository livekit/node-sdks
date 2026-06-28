// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Options common to all clients
 */
export type ClientOptions = {
  /**
   * Optional timeout, in seconds, for all server requests
   */
  requestTimeout?: number;
  /**
   * Whether to fail over to alternative regions on retryable errors (LiveKit
   * Cloud hosts only). Defaults to true; set to false to disable.
   */
  failover?: boolean;
};
