// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from 'vitest';
import { AudioFrame } from './audio_frame.js';
import { AudioSource } from './audio_source.js';

const SAMPLE_RATE = 24000;
const FRAME_MS = 20;
const SAMPLES = (SAMPLE_RATE * FRAME_MS) / 1000;
const QUEUE_MS = 200;

const makeFrame = () => new AudioFrame(new Int16Array(SAMPLES).fill(1000), SAMPLE_RATE, 1, SAMPLES);
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function pushAudio(source: AudioSource, durationMs: number) {
  for (let i = 0; i < durationMs / FRAME_MS; i++) {
    await source.captureFrame(makeFrame());
  }
}

describe('AudioSource', () => {
  it('waitForPlayout waits for the queued audio to drain', async () => {
    const source = new AudioSource(SAMPLE_RATE, 1, QUEUE_MS);
    await pushAudio(source, 600);
    const pushedAt = Date.now();
    await source.waitForPlayout();
    // ~QUEUE_MS of audio is still buffered when the last capture returns
    expect(Date.now() - pushedAt).toBeGreaterThanOrEqual(QUEUE_MS - 50);
    await source.close();
  });

  it('waitForPlayout waits for drain after a capture gap fired the drain timer', async () => {
    const source = new AudioSource(SAMPLE_RATE, 1, QUEUE_MS);
    // a single frame followed by a gap longer than its duration: the internal
    // drain timer fires and resolves the playout promise while the segment is
    // still streaming
    await source.captureFrame(makeFrame());
    await sleep(FRAME_MS * 3);
    await pushAudio(source, 600);
    const pushedAt = Date.now();
    await source.waitForPlayout();
    expect(Date.now() - pushedAt).toBeGreaterThanOrEqual(QUEUE_MS - 50);
    await source.close();
  });

  it('waitForPlayout waits for drain after a previous clearQueue', async () => {
    const source = new AudioSource(SAMPLE_RATE, 1, QUEUE_MS);
    // e.g. an interrupted turn: buffered audio is dropped, releasing the
    // playout promise
    await source.captureFrame(makeFrame());
    source.clearQueue();
    // the next turn must not consume the stale resolution
    await pushAudio(source, 600);
    const pushedAt = Date.now();
    await source.waitForPlayout();
    expect(Date.now() - pushedAt).toBeGreaterThanOrEqual(QUEUE_MS - 50);
    await source.close();
  });

  it('waitForPlayout resolves promptly when interrupted by clearQueue', async () => {
    const source = new AudioSource(SAMPLE_RATE, 1, QUEUE_MS);
    await pushAudio(source, 600);
    const playout = source.waitForPlayout();
    source.clearQueue();
    const clearedAt = Date.now();
    await playout;
    expect(Date.now() - clearedAt).toBeLessThan(50);
    await source.close();
  });

  it('close resolves a pending waitForPlayout', async () => {
    const source = new AudioSource(SAMPLE_RATE, 1, QUEUE_MS);
    await pushAudio(source, 600);
    const playout = source.waitForPlayout();
    await source.close();
    await playout;
  });
});
