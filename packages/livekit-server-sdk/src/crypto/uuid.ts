// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

// Web Crypto only — no import('node:crypto') so isolate/edge bundlers can resolve this module
export async function getRandomBytes(size: number = 16): Promise<Uint8Array> {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Web Crypto API is required (globalThis.crypto.getRandomValues)');
  }
  return crypto.getRandomValues(new Uint8Array(size));
}
