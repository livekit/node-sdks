// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

// Shared request-timeout handling for calls that dial a phone and wait for an
// answer (SIP CreateSIPParticipant/TransferSIPParticipant, WhatsApp
// AcceptWhatsAppCall). These take longer than a normal API call, and the
// request must outlast ringing or it would abort before the call is answered.

/**
 * Ring window (seconds) assumed when a request doesn't set a ringing timeout;
 * matches the server default. A dialing request must outlast it.
 */
export const DEFAULT_RINGING_TIMEOUT_SECONDS = 30;

/**
 * When a call waits on ringing, the request must outlast the ringing window or
 * it would abort before the call can be answered. We keep at least this margin
 * (seconds) of request timeout above the ringing timeout.
 */
export const RINGING_TIMEOUT_MARGIN_SECONDS = 2;

/**
 * Resolves the request timeout (seconds) for a phone-dialing call: the ring
 * window plus a margin, so the request doesn't abort before the call can be
 * answered. The ring window is the request's `ringingTimeout` when set, else
 * {@link DEFAULT_RINGING_TIMEOUT_SECONDS}. A longer user-supplied `timeout` is
 * honored; a shorter one is raised to the floor.
 */
export function dialRequestTimeout(
  timeout: number | undefined,
  ringingTimeout: number | undefined,
): number {
  const ring = ringingTimeout ?? DEFAULT_RINGING_TIMEOUT_SECONDS;
  const floor = ring + RINGING_TIMEOUT_MARGIN_SECONDS;
  return Math.max(timeout ?? floor, floor);
}
