// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { afterEach, describe, expect, it, vi } from 'vitest';
import { REQUEST_ID_HEADER, ServerError, SipCallError, TwirpRpc } from './TwirpRPC.js';

describe('SipCallError', () => {
  it('renders the SIP status, Twirp code, and extra metadata', () => {
    const err = SipCallError.fromServerError(
      new ServerError(
        'Too Many Requests',
        'twirp error: sip status 486',
        429,
        'failed_precondition',
        {
          sip_status_code: '486',
          sip_status: 'Busy Here',
          error_details: 'CAgS...base64...',
          region: 'us-east',
        },
      ),
    );

    expect(err).toBeInstanceOf(ServerError);
    expect(err.name).toBe('SipCallError');
    expect(err.sipStatusCode).toBe(486);
    expect(err.sipStatus).toBe('Busy Here');

    const printed = err.toString();
    expect(printed).toContain('SipCallError');
    expect(printed).toContain('486');
    expect(printed).toContain('Busy Here');
    expect(printed).toContain('failed_precondition');
    expect(printed).toContain('region=us-east'); // other metadata is surfaced
    expect(printed).not.toContain('error_details'); // opaque blob is omitted
  });

  it('falls back to the original message when there is no SIP status', () => {
    const err = SipCallError.fromServerError(new ServerError('Internal', 'boom', 500, 'internal'));
    expect(err.message).toBe('boom');
  });
});

describe('request id', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const okResponse = () =>
    ({ ok: true, status: 200, json: async () => ({}) }) as unknown as Response;

  const errorResponse = (status: number) =>
    ({
      ok: false,
      status,
      statusText: 'Service Unavailable',
      headers: { get: () => null },
      text: async () => 'unavailable',
    }) as unknown as Response;

  // The header lets the server dedup a request that the SDK replayed.
  it('stamps a request id on every call', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okResponse());

    const rpc = new TwirpRpc('https://test.livekit.cloud', 'livekit', { failover: false });
    await rpc.request('RoomService', 'CreateRoom', {}, {});
    await rpc.request('RoomService', 'CreateRoom', {}, {});

    const ids = fetchSpy.mock.calls.map(
      ([, init]) => (init!.headers as Record<string, string>)[REQUEST_ID_HEADER],
    );
    expect(ids[0]).toBeTruthy();
    expect(ids[1]).toBeTruthy();
    // A new logical call is a new request, so it gets its own id.
    expect(ids[0]).not.toBe(ids[1]);
  });

  // The id is generated once per logical call, so every failover attempt must
  // carry the same value.
  it('keeps the same request id across failover attempts', async () => {
    let attempt = 0;
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      // Region discovery, not a replay of the request itself.
      if (`${input}`.endsWith('/settings/regions')) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => 'max-age=0' },
          json: async () => ({
            regions: [
              { url: 'https://r1.retryid.livekit.cloud' },
              { url: 'https://r2.retryid.livekit.cloud' },
            ],
          }),
        } as unknown as Response;
      }
      attempt += 1;
      return attempt < 3 ? errorResponse(503) : okResponse();
    });

    const rpc = new TwirpRpc('https://primary.retryid.livekit.cloud', 'livekit', {
      failoverBackoffMs: 0,
    });
    await rpc.request('RoomService', 'CreateRoom', {}, {});

    const ids = fetchSpy.mock.calls
      .filter(([input]) => !`${input}`.endsWith('/settings/regions'))
      .map(([, init]) => (init!.headers as Record<string, string>)[REQUEST_ID_HEADER]);

    expect(ids).toHaveLength(3);
    expect(ids[0]).toBeTruthy();
    expect(new Set(ids).size).toBe(1);
  });
});

describe('request url', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const requestedUrl = async (host: string, prefix?: string) => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true, status: 200, json: async () => ({}) } as unknown as Response);
    const rpc = new TwirpRpc(host, 'livekit', { failover: false, prefix });
    await rpc.request('RoomService', 'ListRooms', {}, {});
    return `${fetchSpy.mock.calls[0][0]}`;
  };

  // A server behind a reverse proxy is often reached under a path.
  it.each([
    ['https://example.com', 'https://example.com/twirp/livekit.RoomService/ListRooms'],
    ['https://example.com/', 'https://example.com/twirp/livekit.RoomService/ListRooms'],
    [
      'https://example.com/livekit',
      'https://example.com/livekit/twirp/livekit.RoomService/ListRooms',
    ],
    [
      'https://example.com/livekit/',
      'https://example.com/livekit/twirp/livekit.RoomService/ListRooms',
    ],
    [
      'wss://example.com/livekit',
      'https://example.com/livekit/twirp/livekit.RoomService/ListRooms',
    ],
  ])('keeps the base path of %s', async (host, expected) => {
    expect(await requestedUrl(host)).toBe(expected);
  });

  it('joins a custom prefix with or without a leading slash', async () => {
    const expected = 'https://example.com/livekit/rpc/livekit.RoomService/ListRooms';
    expect(await requestedUrl('https://example.com/livekit', '/rpc')).toBe(expected);
    vi.restoreAllMocks();
    expect(await requestedUrl('https://example.com/livekit', 'rpc')).toBe(expected);
  });

  it('drops a query string or fragment on the host', async () => {
    expect(await requestedUrl('https://example.com/livekit?region=x#y')).toBe(
      'https://example.com/livekit/twirp/livekit.RoomService/ListRooms',
    );
  });

  // Fallback regions are bare origins, so a retry goes to the region's root.
  it('sends a failover attempt to the region origin', async () => {
    let attempt = 0;
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      if (`${input}`.endsWith('/settings/regions')) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => 'max-age=0' },
          json: async () => ({ regions: [{ url: 'https://r1.basepath.livekit.cloud' }] }),
        } as unknown as Response;
      }
      attempt += 1;
      return (attempt < 2
        ? {
            ok: false,
            status: 503,
            statusText: 'Service Unavailable',
            headers: { get: () => null },
            text: async () => 'unavailable',
          }
        : { ok: true, status: 200, json: async () => ({}) }) as unknown as Response;
    });

    const rpc = new TwirpRpc('https://primary.basepath.livekit.cloud/livekit', 'livekit', {
      failoverBackoffMs: 0,
    });
    await rpc.request('RoomService', 'ListRooms', {}, {});

    const urls = fetchSpy.mock.calls
      .map(([input]) => `${input}`)
      .filter((url) => !url.endsWith('/settings/regions'));
    expect(urls).toEqual([
      'https://primary.basepath.livekit.cloud/livekit/twirp/livekit.RoomService/ListRooms',
      'https://r1.basepath.livekit.cloud/twirp/livekit.RoomService/ListRooms',
    ]);
  });
});
