// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
// Shared helpers for API tests against the mock LiveKit server (livekit/livekit
// cmd/test-server). Point them at a running instance with LK_TEST_SERVER_URL
// (default http://127.0.0.1:9999); tests skip when it is not reachable. In CI
// the server is booted as a Docker container.
import { LiveKitAPI } from '../../src/LiveKitAPI.js';

export const BASE = process.env.LK_TEST_SERVER_URL ?? 'http://127.0.0.1:9999';

// devkey/secret match `livekit-server --dev`, which the mock verifies against.
export const TEST_API_KEY = 'devkey';
export const TEST_API_SECRET = 'secret';

export let reachable = false;
try {
  reachable = (await fetch(`${BASE}/settings/regions`)).ok;
} catch {
  reachable = false;
}

/**
 * The X-Lk-Mock JSON control header understood by the mock server (see
 * cmd/test-server/config.go). Every field is optional; `{}` means "behave
 * normally".
 */
export interface MockControl {
  failRegions?: number[];
  failMode?: 'status' | 'drop' | 'delay';
  failStatus?: number;
  failTwirpCode?: string;
  delayMs?: number;
  regionsStatus?: number;
  response?: unknown;
  skipAuth?: boolean;
  /** Fail a SIP dial method with this SIP status (code + optional reason phrase). */
  sipStatus?: { code: number; status?: string };
}

export function newApi(): LiveKitAPI {
  return new LiveKitAPI(BASE, { apiKey: TEST_API_KEY, secret: TEST_API_SECRET });
}

/**
 * Runs `fn` with the given mock directives attached to every outgoing request as
 * the X-Lk-Mock header. The SDK's public methods don't expose per-call headers,
 * so this wraps the global fetch for the duration — a test-only shim.
 */
export async function withMock<T>(cfg: MockControl, fn: () => Promise<T>): Promise<T> {
  const real = globalThis.fetch;
  const patched: typeof fetch = (input, init) => {
    const headers = new Headers(init?.headers);
    headers.set('X-Lk-Mock', JSON.stringify(cfg));
    return real(input, { ...init, headers });
  };
  globalThis.fetch = patched;
  try {
    return await fn();
  } finally {
    globalThis.fetch = real;
  }
}
