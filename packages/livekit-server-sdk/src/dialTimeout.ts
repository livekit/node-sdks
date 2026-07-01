// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

// Shared request-timeout handling for calls that dial a phone and wait for an
// answer (SIP CreateSIPParticipant/TransferSIPParticipant, WhatsApp
// AcceptWhatsAppCall). These take longer than a normal API call, and the
// request must outlast ringing or it would abort before the call is answered.

/** Default request timeout (seconds) for calls that dial a phone. */
export const DIAL_TIMEOUT_SECONDS = 30;

/**
 * When a call waits on ringing, the request must outlast the ringing window or
 * it would abort before the call can be answered. We keep at least this margin
 * (seconds) of request timeout above the ringing timeout.
 */
export const RINGING_TIMEOUT_MARGIN_SECONDS = 2;

/**
 * Resolves the request timeout for a phone-dialing call: a user-supplied value
 * (or the dial default) raised, when needed, to stay at least
 * {@link RINGING_TIMEOUT_MARGIN_SECONDS} above any ringing timeout.
 */
export function dialRequestTimeout(
  timeout: number | undefined,
  ringingTimeout: number | undefined,
): number {
  let effective = timeout ?? DIAL_TIMEOUT_SECONDS;
  if (ringingTimeout !== undefined) {
    effective = Math.max(effective, ringingTimeout + RINGING_TIMEOUT_MARGIN_SECONDS);
  }
  return effective;
}
