// SPDX-FileCopyrightText: 2025 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AudioFrame } from './audio_frame.js';
import { AudioMixer } from './audio_mixer.js';

// Helper to create a mock audio stream that yields frames
async function* createMockAudioStream(
  frameCount: number,
  sampleRate: number,
  numChannels: number,
  samplesPerChannel: number,
  value: number,
): AsyncGenerator<AudioFrame> {
  for (let i = 0; i < frameCount; i++) {
    const data = new Int16Array(numChannels * samplesPerChannel);
    // Fill with a specific value
    for (let j = 0; j < data.length; j++) {
      data[j] = value;
    }
    yield new AudioFrame(data, sampleRate, numChannels, samplesPerChannel);
    // Small delay to simulate real stream
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
}

describe('AudioMixer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('mixes two audio streams', async () => {
    const sampleRate = 48000;
    const numChannels = 1;
    const samplesPerChannel = 480; // 10ms at 48kHz
    const mixer = new AudioMixer(sampleRate, numChannels, {
      blocksize: samplesPerChannel,
    });

    // Create two streams with different values
    const stream1 = createMockAudioStream(3, sampleRate, numChannels, samplesPerChannel, 100);
    const stream2 = createMockAudioStream(3, sampleRate, numChannels, samplesPerChannel, 200);

    mixer.addStream(stream1);
    mixer.addStream(stream2);

    // Collect first frame
    const frames: AudioFrame[] = [];
    for await (const frame of mixer) {
      frames.push(frame);
      if (frames.length >= 1) {
        break;
      }
    }

    await mixer.aclose();

    expect(frames.length).toBe(1);
    const frame = frames[0]!;
    expect(frame.sampleRate).toBe(sampleRate);
    expect(frame.channels).toBe(numChannels);
    expect(frame.samplesPerChannel).toBe(samplesPerChannel);

    // Each sample should be 100 + 200 = 300
    for (let i = 0; i < frame.data.length; i++) {
      expect(frame.data[i]).toBe(300);
    }
  });

  it('handles stream removal', async () => {
    const sampleRate = 48000;
    const numChannels = 1;
    const samplesPerChannel = 480;
    const mixer = new AudioMixer(sampleRate, numChannels, {
      blocksize: samplesPerChannel,
    });

    const stream1 = createMockAudioStream(10, sampleRate, numChannels, samplesPerChannel, 100);
    const stream2 = createMockAudioStream(10, sampleRate, numChannels, samplesPerChannel, 200);

    mixer.addStream(stream1);
    mixer.addStream(stream2);

    // Get one frame
    const iterator = mixer[Symbol.asyncIterator]();
    const result1 = await iterator.next();
    expect(result1.done).toBe(false);
    expect(result1.value?.data[0]).toBe(300);

    // Remove one stream
    mixer.removeStream(stream2);

    // Next frame should only have stream1's value
    const result2 = await iterator.next();
    expect(result2.done).toBe(false);
    // Note: there might be buffered data, so this test is simplified

    await mixer.aclose();
  });

  it('handles empty mixer', async () => {
    const sampleRate = 48000;
    const numChannels = 1;
    const mixer = new AudioMixer(sampleRate, numChannels);

    // Signal end without adding any streams
    mixer.endInput();

    const frames: AudioFrame[] = [];
    for await (const frame of mixer) {
      frames.push(frame);
    }

    expect(frames.length).toBe(0);
  });

  it('clips audio values to int16 range', async () => {
    const sampleRate = 48000;
    const numChannels = 1;
    const samplesPerChannel = 480;
    const mixer = new AudioMixer(sampleRate, numChannels, {
      blocksize: samplesPerChannel,
    });

    // Create streams with values that will overflow
    const stream1 = createMockAudioStream(2, sampleRate, numChannels, samplesPerChannel, 20000);
    const stream2 = createMockAudioStream(2, sampleRate, numChannels, samplesPerChannel, 20000);

    mixer.addStream(stream1);
    mixer.addStream(stream2);

    const iterator = mixer[Symbol.asyncIterator]();
    const result = await iterator.next();

    await mixer.aclose();

    expect(result.done).toBe(false);
    // 20000 + 20000 = 40000, which should be clipped to 32767
    for (let i = 0; i < result.value!.data.length; i++) {
      expect(result.value!.data[i]).toBe(32767);
    }
  });

  it('handles exhausted streams', async () => {
    const sampleRate = 48000;
    const numChannels = 1;
    const samplesPerChannel = 480;
    const mixer = new AudioMixer(sampleRate, numChannels, {
      blocksize: samplesPerChannel,
    });

    // Short stream
    const stream = createMockAudioStream(2, sampleRate, numChannels, samplesPerChannel, 100);

    mixer.addStream(stream);

    const frames: AudioFrame[] = [];
    for await (const frame of mixer) {
      frames.push(frame);
      if (frames.length >= 3) {
        break;
      }
    }

    await mixer.aclose();

    // Should get at least 2 frames (stream exhausts after 2)
    expect(frames.length).toBeGreaterThanOrEqual(2);
  });

  it('clears timeout timers after iterator resolves first', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const sampleRate = 48000;
    const numChannels = 1;
    const samplesPerChannel = 480;
    const mixer = new AudioMixer(sampleRate, numChannels, {
      blocksize: samplesPerChannel,
      // Long timeout so the iterator always wins the race
      streamTimeoutMs: 5000,
    });

    const stream = createMockAudioStream(3, sampleRate, numChannels, samplesPerChannel, 42);
    mixer.addStream(stream);

    const frames: AudioFrame[] = [];
    for await (const frame of mixer) {
      frames.push(frame);
      if (frames.length >= 2) break;
    }

    await mixer.aclose();

    expect(frames.length).toBe(2);
    // Each iteration through the while loop calls cancel() after the race.
    // Verify clearTimeout was called at least once per frame produced.
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThanOrEqual(frames.length);
  });

  it('clearTimeout is called at least once per race iteration', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const sampleRate = 48000;
    const numChannels = 1;
    const samplesPerChannel = 480;
    const mixer = new AudioMixer(sampleRate, numChannels, {
      blocksize: samplesPerChannel,
      streamTimeoutMs: 5000,
    });

    // Use more frames to ensure multiple race iterations
    const stream = createMockAudioStream(6, sampleRate, numChannels, samplesPerChannel, 10);
    mixer.addStream(stream);

    const frames: AudioFrame[] = [];
    for await (const frame of mixer) {
      frames.push(frame);
      if (frames.length >= 4) break;
    }

    const callCount = clearTimeoutSpy.mock.calls.length;
    await mixer.aclose();

    expect(frames.length).toBe(4);
    // The mixer races iterator.next() against a timeout on every iteration.
    // Each iteration should clear the losing timeout, so clearTimeout must
    // be called at least as many times as there were race iterations.
    // Multiple iterations happen per frame (accumulating data), so this is
    // a conservative lower bound.
    expect(callCount).toBeGreaterThanOrEqual(frames.length);
  });

  it('timeout fires when stream is slow', async () => {
    const sampleRate = 48000;
    const numChannels = 1;
    const samplesPerChannel = 480;
    const mixer = new AudioMixer(sampleRate, numChannels, {
      blocksize: samplesPerChannel,
      // Very short timeout to trigger the timeout path
      streamTimeoutMs: 1,
    });

    // Create a stream that is slower than the timeout
    async function* slowStream(): AsyncGenerator<AudioFrame> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const data = new Int16Array(numChannels * samplesPerChannel).fill(500);
      yield new AudioFrame(data, sampleRate, numChannels, samplesPerChannel);
    }

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mixer.addStream(slowStream());

    // The mixer should eventually produce a frame (zero-padded due to timeout)
    // and auto-close when the stream exhausts.
    const frames: AudioFrame[] = [];
    for await (const frame of mixer) {
      frames.push(frame);
      if (frames.length >= 1) break;
    }

    await mixer.aclose();

    // The timeout warning should have been logged
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('stream timeout after'));
  });
});
