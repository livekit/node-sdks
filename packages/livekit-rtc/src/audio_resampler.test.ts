// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from 'vitest';
import { AudioFrame } from './audio_frame.js';
import { AudioResampler } from './audio_resampler.js';

describe('AudioResampler', () => {
  it('flush returns no frames when nothing is buffered', () => {
    const resampler = new AudioResampler(48000, 16000);
    expect(resampler.flush()).toEqual([]);

    resampler.push(new AudioFrame(new Int16Array(4800), 48000, 1, 4800));
    const tail = resampler.flush();
    expect(tail.reduce((n, f) => n + f.samplesPerChannel, 0)).toBeGreaterThan(0);
    expect(resampler.flush()).toEqual([]);
  });
});
