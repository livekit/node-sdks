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

// A random RFC 4122 v4 UUID. Prefers the platform's randomUUID (Node 19+, edge
// runtimes, browsers in a secure context) and otherwise formats random bytes,
// so it works everywhere getRandomBytes does.
export async function randomUUID(): Promise<string> {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = await getRandomBytes(16);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant 1
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
}
