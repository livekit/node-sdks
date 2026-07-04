// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
// Region-failover tests against the shared mock LiveKit API server. See mock.ts
// for setup and the X-Lk-Mock JSON control protocol. These drive
// TwirpRpc.request() directly because failover relies on internal test-only
// knobs (failoverForce/failoverBackoffMs) the public methods don't expose.
import { describe, expect, it } from 'vitest';
import { TwirpError, TwirpRpc, livekitPackage } from '../../src/TwirpRPC.js';
import { BASE, type MockControl, reachable } from './mock.js';

// failoverForce bypasses the cloud-host check (the mock is on 127.0.0.1) and a
// tiny backoff keeps the tests fast — both are internal, test-only knobs.
const call = (
  mock: MockControl = {},
  { failover = true, force = true }: { failover?: boolean; force?: boolean } = {},
) => {
  const rpc = new TwirpRpc(BASE, livekitPackage, {
    failover,
    failoverForce: force,
    failoverBackoffMs: 1,
  });
  return rpc.request(
    'RoomService',
    'CreateRoom',
    {},
    {
      authorization: 'Bearer test-token',
      // These tests exercise failover, not authz; skip the mock's permission check.
      'X-Lk-Mock': JSON.stringify({ skipAuth: true, ...mock }),
    },
  );
};

(reachable ? describe : describe.skip)('region failover', () => {
  it('succeeds on the primary when healthy', async () => {
    await expect(call()).resolves.toBeDefined();
  });

  it('fails over to a healthy region when the primary is down', async () => {
    await expect(call({ failRegions: [0] })).resolves.toBeDefined();
  });

  it('fails over to region 2 on the third attempt', async () => {
    await expect(call({ failRegions: [0, 1] })).resolves.toBeDefined();
  });

  it('surfaces an error when all regions are down', async () => {
    await expect(call({ failRegions: [0, 1, 2, 3] })).rejects.toThrow(TwirpError);
  });

  it('does not retry a 4xx', async () => {
    await expect(call({ failRegions: [0], failStatus: 400 })).rejects.toMatchObject({
      code: 'invalid_argument',
    });
  });

  it('fails over on a transport error', async () => {
    await expect(call({ failRegions: [0], failMode: 'drop' })).resolves.toBeDefined();
  });

  it('surfaces the original error when region discovery is unreachable', async () => {
    await expect(call({ failRegions: [0], regionsStatus: 500 })).rejects.toThrow(TwirpError);
  });

  it('does not fail over for a non-cloud host (cloud-gated)', async () => {
    // failover enabled but not forced; 127.0.0.1 is not a cloud host.
    await expect(call({ failRegions: [0] }, { force: false })).rejects.toThrow(TwirpError);
  });

  it('does not fail over when disabled', async () => {
    await expect(call({ failRegions: [0] }, { failover: false })).rejects.toThrow(TwirpError);
  });
});
