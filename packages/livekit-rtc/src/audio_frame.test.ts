// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from 'vitest';
import { AudioFrame } from './audio_frame.js';
import { AudioResampler } from './audio_resampler.js';
import { FfiClient } from './ffi_client.js';

const SAMPLE_RATE = 16000;
const FRAME_SAMPLES = SAMPLE_RATE / 100; // 10ms

const rms = (a: ArrayLike<number>) =>
  Math.sqrt(Array.from(a).reduce((s, x) => s + x * x, 0) / a.length);

const resampleAll = (frames: AudioFrame[]): Int16Array => {
  const resampler = new AudioResampler(SAMPLE_RATE, 24000);
  const out: number[] = [];
  for (const frame of frames) {
    for (const f of resampler.push(frame)) out.push(...f.data);
  }
  for (const f of resampler.flush()) out.push(...f.data);
  resampler.close();
  return Int16Array.from(out);
};

describe('AudioFrame', () => {
  it('hands native code its own samples when data is a subarray', () => {
    const pcm = Int16Array.from({ length: FRAME_SAMPLES * 2 }, (_, i) => i);
    const frame = new AudioFrame(pcm.subarray(FRAME_SAMPLES), SAMPLE_RATE, 1, FRAME_SAMPLES);

    const seen = FfiClient.instance.copyBuffer(frame.protoInfo().dataPtr!, frame.data.byteLength);

    expect(new Int16Array(seen.buffer, seen.byteOffset, seen.length / 2)).toEqual(frame.data);
  });

  it('resamples 10ms subarray frames like copied frames', () => {
    // 100ms of a rising tone, so that every 10ms frame has different content
    const total = FRAME_SAMPLES * 10;
    const pcm = Int16Array.from({ length: total }, (_, i) =>
      Math.round(((8000 * i) / total) * Math.sin((2 * Math.PI * 440 * i) / SAMPLE_RATE)),
    );

    const views: AudioFrame[] = [];
    const copies: AudioFrame[] = [];
    for (let i = 0; i < total; i += FRAME_SAMPLES) {
      // subarray() shares pcm's buffer at a non-zero byteOffset; slice() copies to offset 0
      views.push(new AudioFrame(pcm.subarray(i, i + FRAME_SAMPLES), SAMPLE_RATE, 1, FRAME_SAMPLES));
      copies.push(new AudioFrame(pcm.slice(i, i + FRAME_SAMPLES), SAMPLE_RATE, 1, FRAME_SAMPLES));
    }

    const fromViews = resampleAll(views);
    const fromCopies = resampleAll(copies);

    // soxr dithers 16-bit output, so two runs over the same input can differ by a few LSB
    expect(fromViews.length).toBe(fromCopies.length);
    const residual = Array.from(fromViews, (x, i) => x - fromCopies[i]!);
    expect(rms(residual)).toBeLessThan(rms(fromCopies) / 100);
  });
});
