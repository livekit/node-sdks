// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CreateSipParticipantOptions, TransferSipParticipantOptions } from './SipClient.js';
import { SipClient } from './SipClient.js';

describe('SipClient dialing options', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Captures the JSON body and the request timeout of every API call.
  function mockApi() {
    const bodies: Record<string, unknown>[] = [];
    const timeouts: number[] = [];
    const realTimeout = AbortSignal.timeout.bind(AbortSignal);
    vi.spyOn(AbortSignal, 'timeout').mockImplementation((ms: number) => {
      timeouts.push(ms);
      return realTimeout(ms);
    });
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, init) => {
      bodies.push(JSON.parse(init!.body as string));
      return { ok: true, status: 200, json: async () => ({}) } as unknown as Response;
    });
    return { bodies, timeouts };
  }

  const client = () => new SipClient('http://localhost:7880', 'key', 'secret');

  it('createSipParticipant does not modify the options passed in', async () => {
    const { bodies, timeouts } = mockApi();
    const opts: CreateSipParticipantOptions = { waitUntilAnswered: true };

    await client().createSipParticipant('ST_trunk', '+15105550100', 'room', opts);

    expect(opts).toEqual({ waitUntilAnswered: true });
    expect(bodies[0]?.ringingTimeout).toBe('30s');
    expect(timeouts).toEqual([32_000]);
  });

  it('createSipParticipant accepts frozen options', async () => {
    const { bodies, timeouts } = mockApi();
    const opts = Object.freeze({ waitUntilAnswered: true, ringingTimeout: 45 });

    await client().createSipParticipant('ST_trunk', '+15105550100', 'room', opts);

    expect(bodies[0]?.ringingTimeout).toBe('45s');
    expect(timeouts).toEqual([47_000]);
  });

  it('transferSipParticipant does not modify the options passed in', async () => {
    const { bodies, timeouts } = mockApi();
    const opts: TransferSipParticipantOptions = { playDialtone: true };

    await client().transferSipParticipant('room', 'caller', 'tel:+15105550100', opts);

    expect(opts).toEqual({ playDialtone: true });
    expect(bodies[0]?.ringingTimeout).toBe('30s');
    expect(timeouts).toEqual([32_000]);
  });

  it('transferSipParticipant accepts frozen options', async () => {
    const { timeouts } = mockApi();
    const opts = Object.freeze({ playDialtone: true, timeout: 60 });

    await client().transferSipParticipant('room', 'caller', 'tel:+15105550100', opts);

    expect(timeouts).toEqual([60_000]);
  });
});
