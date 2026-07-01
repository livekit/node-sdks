// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_RINGING_TIMEOUT_SECONDS,
  RINGING_TIMEOUT_MARGIN_SECONDS,
  dialRequestTimeout,
} from './dialTimeout.js';

const DEFAULT_FLOOR = DEFAULT_RINGING_TIMEOUT_SECONDS + RINGING_TIMEOUT_MARGIN_SECONDS;

describe('dialRequestTimeout', () => {
  it('falls back to the default ring window plus margin when nothing is set', () => {
    // No ringing timeout means the server's default ring applies, so the request
    // must still outlast it by the margin.
    expect(dialRequestTimeout(undefined, undefined)).toBe(DEFAULT_FLOOR);
  });

  it('honors a user timeout above the default floor, raises one below it', () => {
    expect(dialRequestTimeout(45, undefined)).toBe(45);
    expect(dialRequestTimeout(5, undefined)).toBe(DEFAULT_FLOOR);
  });

  it('tracks a short ringing timeout (ring + margin), no fixed floor', () => {
    expect(dialRequestTimeout(undefined, 10)).toBe(10 + RINGING_TIMEOUT_MARGIN_SECONDS);
  });

  it('raises the timeout to stay above a long ringing timeout', () => {
    expect(dialRequestTimeout(undefined, 60)).toBe(60 + RINGING_TIMEOUT_MARGIN_SECONDS);
  });

  it('raises a user timeout that is too tight for the ringing window', () => {
    // user asked for 30s but ringing is 40s; must outlast ringing by the margin.
    expect(dialRequestTimeout(30, 40)).toBe(40 + RINGING_TIMEOUT_MARGIN_SECONDS);
  });

  it('keeps a user timeout that already clears the ringing window', () => {
    expect(dialRequestTimeout(90, 40)).toBe(90);
  });
});
