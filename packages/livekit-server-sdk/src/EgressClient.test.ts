// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { StreamDestination, StreamOutput, StreamProtocol } from '@livekit/protocol';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EgressClient } from './EgressClient.js';

describe('EgressClient stream destinations', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const youtube = { id: 'youtube', url: 'rtmps://a.example.com/live/key' };

  const sentBodies = () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ egressId: 'EG_abc123' }),
    } as unknown as Response);
    return () => fetchSpy.mock.calls.map(([, init]) => JSON.parse(init!.body as string));
  };

  const client = () =>
    new EgressClient('https://test.livekit.cloud', 'devkey', 'secret', { failover: false });

  it('adds destinations, with their ids, to a running egress', async () => {
    const bodies = sentBodies();

    await client().updateStream('EG_abc123', [], [], [new StreamDestination(youtube)]);

    expect(bodies()).toEqual([{ egressId: 'EG_abc123', addDestinations: [youtube] }]);
  });

  it('starts an egress streaming to destinations', async () => {
    const bodies = sentBodies();

    await client().startRoomCompositeEgress(
      'test-room',
      new StreamOutput({
        protocol: StreamProtocol.RTMP,
        destinations: [new StreamDestination(youtube)],
      }),
    );

    expect(bodies()[0].streamOutputs).toEqual([{ protocol: 'RTMP', destinations: [youtube] }]);
  });
});
