// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from 'vitest';
import {
  DIAL_TIMEOUT_SECONDS,
  RINGING_TIMEOUT_MARGIN_SECONDS,
  dialRequestTimeout,
} from './dialTimeout.js';

describe('dialRequestTimeout', () => {
  it('defaults to the dial timeout when nothing is specified', () => {
    expect(dialRequestTimeout(undefined, undefined)).toBe(DIAL_TIMEOUT_SECONDS);
  });

  it('honors a user-supplied timeout when there is no ringing timeout', () => {
    expect(dialRequestTimeout(45, undefined)).toBe(45);
    expect(dialRequestTimeout(5, undefined)).toBe(5);
  });

  it('keeps the dial default above a short ringing timeout', () => {
    // ringing + margin (12) is below the 30s default, so the default wins.
    expect(dialRequestTimeout(undefined, 10)).toBe(DIAL_TIMEOUT_SECONDS);
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
