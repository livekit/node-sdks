// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

// Region failover for the Twirp API clients.
//
// On a retryable failure (any transport error or HTTP 5xx) the client discovers
// alternative LiveKit Cloud regions via /settings/regions and replays the
// request against the next region, with exponential backoff. 4xx responses are
// returned immediately.

// Total attempts (the original request + fallback regions) and the base retry
// backoff are fixed, not user-configurable, so retries can't be tuned to values
// that could overwhelm the server.
export const FAILOVER_MAX_ATTEMPTS = 3;
export const FAILOVER_BACKOFF_BASE_MS = 200;
// Below this per-request timeout, a retry is unlikely to help and many clients
// would retry in lockstep across regions, so a short request gets a single
// attempt (thundering-herd guard).
export const MIN_FAILOVER_TIMEOUT_SECONDS = 5;

/**
 * Total request attempts for a host; 1 means no failover. Failover only engages
 * when enabled, the host is a LiveKit Cloud domain, and the request timeout is
 * long enough to retry. `force` bypasses the cloud-host check (test-only).
 */
export function failoverAttempts(
  enabled: boolean,
  hostname: string,
  force = false,
  timeoutSeconds = 0,
): number {
  if (!enabled || !(force || isCloud(hostname))) {
    return 1;
  }
  if (timeoutSeconds > 0 && timeoutSeconds < MIN_FAILOVER_TIMEOUT_SECONDS) {
    return 1;
  }
  return FAILOVER_MAX_ATTEMPTS;
}

// Failover only engages for LiveKit Cloud project domains.
function isCloud(hostname: string): boolean {
  return hostname.endsWith('.livekit.cloud');
}

/** Normalizes a region URL to an http(s) scheme (ws -> http, wss -> https). */
function toHttp(url: string): string {
  return url.startsWith('ws') ? `http${url.slice(2)}` : url;
}

/** A stable key identifying a host (including port) for dedup across attempts. */
export function hostKey(url: URL): string {
  return url.host.toLowerCase();
}

/** Returns the first region origin whose host has not yet been attempted. */
export function pickNext(regionOrigins: string[], attempted: Set<string>): string | undefined {
  for (const origin of regionOrigins) {
    try {
      if (!attempted.has(hostKey(new URL(origin)))) {
        return origin;
      }
    } catch {
      // skip malformed URLs
    }
  }
  return undefined;
}

export function sleep(ms: number): Promise<void> {
  return ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
}

type CacheEntry = {
  origins: string[];
  fetchedAt: number;
  ttl: number; // ms
};

// Shared across all clients in the process so the region list is fetched once.
const regionCache = new Map<string, CacheEntry>();
// Coalesces concurrent discovery fetches per origin: while one /settings/regions
// request is in flight, other callers for the same origin await its result
// rather than issuing their own (avoids a thundering herd when many requests
// fail over at once).
const inflight = new Map<string, Promise<string[]>>();

/**
 * Returns alternative region origins for `origin`, fetching /settings/regions
 * if the cache is stale. Best-effort: on a fetch failure it serves a stale
 * cached list when available, otherwise an empty list. Forwards `headers` so a
 * valid token — and any test directives — reach the discovery endpoint.
 */
export async function regionOrigins(origin: URL, headers: unknown): Promise<string[]> {
  const key = hostKey(origin);
  const cached = regionCache.get(key);
  if (cached && Date.now() - cached.fetchedAt < cached.ttl) {
    return cached.origins;
  }

  const existing = inflight.get(key);
  if (existing) {
    return existing;
  }
  const request = (async () => {
    try {
      const { origins, ttl } = await fetchRegions(origin, headers);
      // A zero TTL (e.g. Cache-Control: max-age=0) means "do not cache".
      if (ttl > 0) {
        regionCache.set(key, { origins, fetchedAt: Date.now(), ttl });
      }
      return origins;
    } catch {
      return cached?.origins ?? [];
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, request);
  return request;
}

async function fetchRegions(
  origin: URL,
  headers: unknown,
): Promise<{ origins: string[]; ttl: number }> {
  // Forward the caller's headers (auth + any custom), minus body-specific ones.
  const fetchHeaders: Record<string, string> = {};
  for (const [k, v] of Object.entries((headers as Record<string, string>) ?? {})) {
    if (k.toLowerCase() === 'content-type' || k.toLowerCase() === 'content-length') continue;
    fetchHeaders[k] = v;
  }

  const response = await fetch(new URL('/settings/regions', origin.origin), {
    method: 'GET',
    headers: fetchHeaders,
    // Short timeout so a slow/unreachable discovery endpoint doesn't stall the
    // failover path.
    signal: AbortSignal.timeout(2000),
  });
  if (!response.ok) {
    throw new Error(`region discovery failed: ${response.status}`);
  }
  const ttl = parseMaxAge(response.headers.get('cache-control'));
  const body = (await response.json()) as { regions?: Array<{ url?: string }> };
  const origins = (body.regions ?? [])
    .filter((r) => !!r.url)
    .map((r) => new URL(toHttp(r.url!)).origin);
  return { origins, ttl };
}

/**
 * Returns the `max-age` from a Cache-Control header in milliseconds, or 0 when
 * absent, non-positive, or unparseable (meaning "do not cache"). Only `max-age`
 * is honored; other directives (including `s-maxage`, which targets shared
 * proxies) are ignored.
 */
export function parseMaxAge(cacheControl: string | null): number {
  if (!cacheControl) return 0;
  for (const directive of cacheControl.split(',')) {
    const trimmed = directive.trim().toLowerCase();
    if (trimmed.startsWith('max-age=')) {
      const secs = parseInt(trimmed.slice('max-age='.length), 10);
      return Number.isFinite(secs) && secs > 0 ? secs * 1000 : 0;
    }
  }
  return 0;
}
