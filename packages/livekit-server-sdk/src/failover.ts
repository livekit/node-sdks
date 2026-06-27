// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

// Region failover for the Twirp API clients.
//
// On a retryable failure (any transport error or HTTP 5xx) the client discovers
// alternative LiveKit Cloud regions via /settings/regions and replays the
// request against the next region, with exponential backoff. 4xx responses are
// returned immediately.

/** Controls when API requests fail over to alternative regions. */
export type FailoverMode =
  /** Fail over only for LiveKit Cloud hosts. The default. */
  | 'auto'
  /** Always fail over, regardless of host (primarily for tests). */
  | 'on'
  /** Never fail over. */
  | 'off';

/** Tunes the region-failover retry loop. */
export type FailoverConfig = {
  /** Defaults to 'auto'. */
  mode?: FailoverMode;
  /** Total attempts including the first — the original host plus `maxAttempts - 1` fallback regions. Defaults to 3. */
  maxAttempts?: number;
  /** Milliseconds before the first retry; each subsequent retry doubles it. Defaults to 200. */
  backoffBase?: number;
};

export type ResolvedFailover = Required<FailoverConfig>;

export function resolveFailover(config?: FailoverConfig): ResolvedFailover {
  return {
    mode: config?.mode ?? 'auto',
    maxAttempts: config?.maxAttempts ?? 3,
    backoffBase: config?.backoffBase ?? 200,
  };
}

export function failoverEnabled(config: ResolvedFailover, hostname: string): boolean {
  switch (config.mode) {
    case 'off':
      return false;
    case 'on':
      return true;
    default:
      return isCloud(hostname);
  }
}

// Auto mode only enables failover for LiveKit Cloud project domains.
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

  try {
    const { origins, ttl } = await fetchRegions(origin, headers);
    // A zero TTL (e.g. Cache-Control: max-age=0) means "do not cache".
    if (ttl > 0) {
      regionCache.set(key, { origins, fetchedAt: Date.now(), ttl });
    }
    return origins;
  } catch {
    return cached?.origins ?? [];
  }
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

function parseMaxAge(cacheControl: string | null): number {
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
