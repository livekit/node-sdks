// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

// API tests against the shared mock LiveKit API server (livekit/livekit
// cmd/test-server). Point them at a running instance with LK_TEST_SERVER_URL
// (default http://127.0.0.1:9999); they skip when no server is reachable. In CI
// the server is booted as a Docker container.
//
// See cmd/test-server/README.md for the X-Lk-Mock-* control protocol. These
// tests drive TwirpRpc.request() directly because the public service methods do
// not expose per-call headers.
import { describe, expect, it } from 'vitest';
import type { FailoverConfig } from '../../src/failover.js';
import { TwirpError, TwirpRpc, livekitPackage } from '../../src/TwirpRPC.js';

const BASE = process.env.LK_TEST_SERVER_URL ?? 'http://127.0.0.1:9999';

let reachable = false;
try {
  reachable = (await fetch(`${BASE}/settings/regions`)).ok;
} catch {
  reachable = false;
}

// An explicit config enables failover on any host (the non-cloud mock) with a
// tiny backoff so the tests run fast.
const FORCED: FailoverConfig = { maxAttempts: 3, backoffBase: 1 };

const call = (
  directives: Record<string, string>,
  failover: FailoverConfig | undefined = FORCED,
) => {
  const rpc = new TwirpRpc(BASE, livekitPackage, { failover });
  return rpc.request('RoomService', 'CreateRoom', {}, {
    authorization: 'Bearer test-token',
    ...directives,
  });
};

(reachable ? describe : describe.skip)('region failover', () => {
  it('succeeds on the primary when healthy', async () => {
    await expect(call({})).resolves.toBeDefined();
  });

  it('fails over to a healthy region when the primary is down', async () => {
    await expect(call({ 'x-lk-mock-fail-regions': '0' })).resolves.toBeDefined();
  });

  it('fails over to region 2 on the third attempt', async () => {
    await expect(call({ 'x-lk-mock-fail-regions': '0,1' })).resolves.toBeDefined();
  });

  it('surfaces an error when all regions are down', async () => {
    await expect(call({ 'x-lk-mock-fail-regions': '0,1,2,3' })).rejects.toThrow(TwirpError);
  });

  it('does not retry a 4xx', async () => {
    await expect(
      call({ 'x-lk-mock-fail-regions': '0', 'x-lk-mock-fail-status': '400' }),
    ).rejects.toMatchObject({ code: 'invalid_argument' });
  });

  it('fails over on a transport error', async () => {
    await expect(
      call({ 'x-lk-mock-fail-regions': '0', 'x-lk-mock-fail-mode': 'drop' }),
    ).resolves.toBeDefined();
  });

  it('surfaces the original error when region discovery is unreachable', async () => {
    await expect(
      call({ 'x-lk-mock-fail-regions': '0', 'x-lk-mock-regions-status': '500' }),
    ).rejects.toThrow(TwirpError);
  });

  it('does not fail over for a non-cloud host by default', async () => {
    // No failover option => undefined => auto (cloud-only); 127.0.0.1 is not cloud.
    const rpc = new TwirpRpc(BASE, livekitPackage);
    await expect(
      rpc.request('RoomService', 'CreateRoom', {}, {
        authorization: 'Bearer test-token',
        'x-lk-mock-fail-regions': '0',
      }),
    ).rejects.toThrow(TwirpError);
  });

  it('does not fail over when disabled with maxAttempts 1', async () => {
    await expect(call({ 'x-lk-mock-fail-regions': '0' }, { maxAttempts: 1 })).rejects.toThrow(
      TwirpError,
    );
  });
});
