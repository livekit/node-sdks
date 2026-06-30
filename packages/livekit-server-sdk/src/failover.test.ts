// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FAILOVER_MAX_ATTEMPTS,
  MIN_FAILOVER_TIMEOUT_SECONDS,
  failoverAttempts,
  hostKey,
  parseMaxAge,
  pickNext,
  regionOrigins,
  sleep,
} from './failover.js';

describe('failoverAttempts', () => {
  it('fails over for LiveKit Cloud hosts when enabled', () => {
    expect(failoverAttempts(true, 'myproject.livekit.cloud')).toBe(FAILOVER_MAX_ATTEMPTS);
    expect(failoverAttempts(true, 'myproject.region.livekit.cloud')).toBe(FAILOVER_MAX_ATTEMPTS);
  });

  it('does not fail over for non-cloud hosts', () => {
    expect(failoverAttempts(true, 'myproject.livekit.io')).toBe(1);
    expect(failoverAttempts(true, 'example.com')).toBe(1);
    expect(failoverAttempts(true, '127.0.0.1')).toBe(1);
    expect(failoverAttempts(true, 'notlivekit.cloud')).toBe(1);
  });

  it('force bypasses the cloud-host check; disabled never fails over', () => {
    expect(failoverAttempts(true, '127.0.0.1', true)).toBe(FAILOVER_MAX_ATTEMPTS);
    expect(failoverAttempts(false, 'myproject.livekit.cloud', true)).toBe(1);
    expect(failoverAttempts(false, 'myproject.livekit.cloud')).toBe(1);
  });

  it('applies the thundering-herd guard for sub-threshold timeouts', () => {
    expect(
      failoverAttempts(true, 'myproject.livekit.cloud', false, MIN_FAILOVER_TIMEOUT_SECONDS - 1),
    ).toBe(1);
    expect(
      failoverAttempts(true, 'myproject.livekit.cloud', false, MIN_FAILOVER_TIMEOUT_SECONDS),
    ).toBe(FAILOVER_MAX_ATTEMPTS);
    // 0 means "no timeout set" and is not guarded.
    expect(failoverAttempts(true, 'myproject.livekit.cloud', false, 0)).toBe(FAILOVER_MAX_ATTEMPTS);
  });
});

describe('hostKey', () => {
  it('lowercases the host and keeps a non-default port', () => {
    expect(hostKey(new URL('https://Example.LiveKit.Cloud/twirp'))).toBe('example.livekit.cloud');
    expect(hostKey(new URL('https://example.livekit.cloud:8080/twirp'))).toBe(
      'example.livekit.cloud:8080',
    );
  });
});

describe('pickNext', () => {
  const origins = ['https://a.livekit.cloud', 'https://b.livekit.cloud'];

  it('returns the first origin not yet attempted', () => {
    expect(pickNext(origins, new Set())).toBe('https://a.livekit.cloud');
    expect(pickNext(origins, new Set(['a.livekit.cloud']))).toBe('https://b.livekit.cloud');
  });

  it('returns undefined once every origin has been attempted', () => {
    expect(pickNext(origins, new Set(['a.livekit.cloud', 'b.livekit.cloud']))).toBeUndefined();
  });

  it('skips malformed origin URLs', () => {
    expect(pickNext(['not a url', 'https://c.livekit.cloud'], new Set())).toBe(
      'https://c.livekit.cloud',
    );
  });
});

describe('sleep', () => {
  it('resolves immediately for non-positive durations', async () => {
    await expect(sleep(0)).resolves.toBeUndefined();
    await expect(sleep(-5)).resolves.toBeUndefined();
  });
});

describe('parseMaxAge', () => {
  it('returns 0 when the header is absent or empty', () => {
    expect(parseMaxAge(null)).toBe(0);
    expect(parseMaxAge('')).toBe(0);
  });

  it('parses max-age (in seconds) to milliseconds', () => {
    expect(parseMaxAge('max-age=300')).toBe(300_000);
  });

  it('finds max-age alongside other directives', () => {
    expect(parseMaxAge('public, max-age=3600')).toBe(3_600_000);
    expect(parseMaxAge('private, max-age=600, must-revalidate')).toBe(600_000);
    expect(parseMaxAge('no-cache, max-age=30')).toBe(30_000);
  });

  it('is case-insensitive and tolerates surrounding whitespace', () => {
    expect(parseMaxAge('Max-Age=300')).toBe(300_000);
    expect(parseMaxAge('  max-age = 300 ')).toBe(0); // spaces around "=" are not valid per RFC
    expect(parseMaxAge('public,   max-age=120')).toBe(120_000);
  });

  it('treats max-age=0 and non-caching directives as "do not cache"', () => {
    expect(parseMaxAge('max-age=0')).toBe(0);
    expect(parseMaxAge('no-cache')).toBe(0);
    expect(parseMaxAge('no-store')).toBe(0);
    expect(parseMaxAge('public')).toBe(0);
  });

  it('ignores s-maxage and only honors max-age', () => {
    expect(parseMaxAge('s-maxage=3600, max-age=120')).toBe(120_000);
    expect(parseMaxAge('s-maxage=3600')).toBe(0);
  });

  it('returns 0 for negative or non-numeric max-age', () => {
    expect(parseMaxAge('max-age=-5')).toBe(0);
    expect(parseMaxAge('max-age=abc')).toBe(0);
  });
});

describe('regionOrigins', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockResponse = (regions: Array<{ url: string }>, cacheControl: string | null): Response =>
    ({
      ok: true,
      status: 200,
      headers: { get: (h: string) => (h.toLowerCase() === 'cache-control' ? cacheControl : null) },
      json: async () => ({ regions }),
    }) as unknown as Response;

  it('coalesces concurrent discovery fetches for the same origin', async () => {
    let resolveFetch: (r: Response) => void = () => {};
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() => new Promise<Response>((resolve) => (resolveFetch = resolve)));

    const origin = new URL('https://primary.coalesce.livekit.cloud');
    const p1 = regionOrigins(origin, {});
    const p2 = regionOrigins(origin, {});

    // Both callers share a single in-flight request.
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    resolveFetch(mockResponse([{ url: 'wss://r1.coalesce.livekit.cloud' }], 'max-age=300'));
    const [o1, o2] = await Promise.all([p1, p2]);

    expect(o1).toEqual(['https://r1.coalesce.livekit.cloud']);
    expect(o2).toEqual(o1);
  });

  it('serves later callers from the cache within the TTL', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockResponse([{ url: 'wss://r.cached.livekit.cloud' }], 'max-age=300'));

    const origin = new URL('https://primary.cached.livekit.cloud');
    const first = await regionOrigins(origin, {});
    const second = await regionOrigins(origin, {});

    expect(first).toEqual(['https://r.cached.livekit.cloud']);
    expect(second).toEqual(first);
    // The second call is served from the cache, so no second fetch.
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('does not cache when the TTL is zero (max-age=0)', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockResponse([{ url: 'wss://r.nocache.livekit.cloud' }], 'max-age=0'));

    const origin = new URL('https://primary.nocache.livekit.cloud');
    await regionOrigins(origin, {});
    await regionOrigins(origin, {});

    // Nothing cached, so each call re-fetches.
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('returns an empty list when discovery fails and nothing is cached', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));
    const origin = new URL('https://primary.error.livekit.cloud');
    await expect(regionOrigins(origin, {})).resolves.toEqual([]);
  });
});
