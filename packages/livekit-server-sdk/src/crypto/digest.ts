// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

// Web Crypto only — no import('node:crypto') so isolate/edge bundlers can resolve this module
export async function digest(data: string): Promise<ArrayBuffer> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto API is required (globalThis.crypto.subtle)');
  }
  const encoder = new TextEncoder();
  return crypto.subtle.digest('SHA-256', encoder.encode(data));
}
