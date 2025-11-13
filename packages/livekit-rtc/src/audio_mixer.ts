// SPDX-FileCopyrightText: 2025 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { AudioFrame } from './audio_frame.js';
import { log } from './log.js';

type AudioStream = AsyncIterator<AudioFrame>;

interface Contribution {
  stream: AudioStream;
  data: Int16Array;
  buffer: Int16Array;
  hadData: boolean;
  exhausted: boolean;
}

/**
 * AudioMixer accepts multiple async audio streams and mixes them into a single output stream.
 *
 * Each output frame is generated with a fixed chunk size determined by the blocksize (in samples).
 * If blocksize is not provided (or 0), it defaults to 100ms worth of audio.
 *
 * Each input stream is processed in parallel, accumulating audio data until at least one chunk
 * of samples is available. If an input stream does not provide data within the specified timeout,
 * a warning is logged.
 *
 * @example
 * ```typescript
 * const mixer = new AudioMixer(48000, 1, { blocksize: 4800 });
 * mixer.addStream(stream1);
 * mixer.addStream(stream2);
 *
 * for await (const frame of mixer) {
 *   await audioSource.captureFrame(frame);
 * }
 * ```
 */
export class AudioMixer {
  private streams: Set<AudioStream> = new Set();
  private buffers: Map<AudioStream, Int16Array> = new Map();
  private readonly sampleRate: number;
  private readonly numChannels: number;
  private readonly chunkSize: number;
  private readonly streamTimeoutMs: number;
  private queue: AudioFrame[] = [];
  private readonly capacity: number;
  private ending = false;
  private mixerTask?: Promise<void>;
  private queueResolvers: Array<() => void> = [];

  constructor(
    sampleRate: number,
    numChannels: number,
    options?: {
      blocksize?: number;
      streamTimeoutMs?: number;
      capacity?: number;
    },
  ) {
    this.sampleRate = sampleRate;
    this.numChannels = numChannels;
    this.chunkSize = options?.blocksize && options.blocksize > 0 ? options.blocksize : Math.floor(sampleRate / 10);
    this.streamTimeoutMs = options?.streamTimeoutMs ?? 100;
    this.capacity = options?.capacity ?? 100;

    // Start the mixer task
    this.mixerTask = this.mixer();
  }

  /**
   * Add an audio stream to the mixer.
   *
   * The stream is added to the internal set of streams and an empty buffer is initialized for it,
   * if not already present.
   *
   * @param stream - An async iterator that produces AudioFrame objects
   */
  addStream(stream: AudioStream): void {
    if (this.ending) {
      throw new Error('Cannot add stream after mixer has been closed');
    }

    this.streams.add(stream);
    if (!this.buffers.has(stream)) {
      this.buffers.set(stream, new Int16Array(0));
    }
  }

  /**
   * Remove an audio stream from the mixer.
   *
   * This method removes the specified stream and its associated buffer from the mixer.
   *
   * @param stream - The audio stream to remove
   */
  removeStream(stream: AudioStream): void {
    this.streams.delete(stream);
    this.buffers.delete(stream);
  }

  /**
   * Async iterator implementation to allow consuming mixed frames.
   */
  async *[Symbol.asyncIterator](): AsyncIterator<AudioFrame> {
    while (true) {
      const frame = await this.getNextFrame();
      if (frame === null) {
        break;
      }
      yield frame;
    }
  }

  /**
   * Immediately stop mixing and close the mixer.
   *
   * This stops the mixing task, and any unconsumed output in the queue may be dropped.
   */
  async aclose(): Promise<void> {
    this.ending = true;
    if (this.mixerTask) {
      await this.mixerTask;
    }
    // Resolve any waiting consumers
    this.queueResolvers.forEach((resolve) => resolve());
    this.queueResolvers = [];
  }

  /**
   * Signal that no more streams will be added.
   *
   * This method marks the mixer as ending so that it flushes any remaining buffered output before ending.
   * Note that existing streams will still be processed until exhausted.
   */
  endInput(): void {
    this.ending = true;
  }

  private async getNextFrame(): Promise<AudioFrame | null> {
    while (this.queue.length === 0) {
      if (this.ending && this.streams.size === 0) {
        return null;
      }

      // Wait for frames to be added to the queue
      await new Promise<void>((resolve) => {
        this.queueResolvers.push(resolve);
      });

      if (this.ending && this.streams.size === 0 && this.queue.length === 0) {
        return null;
      }
    }

    return this.queue.shift()!;
  }

  private async mixer(): Promise<void> {
    while (true) {
      // If we're in ending mode and there are no more streams, exit
      if (this.ending && this.streams.size === 0) {
        break;
      }

      if (this.streams.size === 0) {
        await this.sleep(10);
        continue;
      }

      // Get contributions from all streams in parallel
      const streamList = Array.from(this.streams);
      const tasks = streamList.map((stream) => {
        const buffer = this.buffers.get(stream) || new Int16Array(0);
        return this.getContribution(stream, buffer);
      });

      const results = await Promise.allSettled(tasks);
      const contributions: Int16Array[] = [];
      let anyData = false;
      const removals: AudioStream[] = [];

      for (const result of results) {
        if (result.status !== 'fulfilled') {
          continue;
        }

        const contrib = result.value;
        if (!contrib) continue;

        // Convert Int16 to Float32 for mixing
        const float32Data = new Float32Array(contrib.data.length);
        for (let i = 0; i < contrib.data.length; i++) {
          float32Data[i] = contrib.data[i]!;
        }
        contributions.push(float32Data as unknown as Int16Array);

        this.buffers.set(contrib.stream, contrib.buffer);

        if (contrib.hadData) {
          anyData = true;
        }

        if (contrib.exhausted && contrib.buffer.length === 0) {
          removals.push(contrib.stream);
        }
      }

      // Remove exhausted streams
      for (const stream of removals) {
        this.removeStream(stream);
      }

      if (!anyData) {
        await this.sleep(1);
        continue;
      }

      // Mix all contributions by summing
      const mixed = new Float32Array(this.chunkSize * this.numChannels);
      for (const contribution of contributions) {
        for (let i = 0; i < mixed.length; i++) {
          mixed[i] = (mixed[i] || 0) + ((contribution as unknown as Float32Array)[i] || 0);
        }
      }

      // Clip and convert back to Int16
      const int16Data = new Int16Array(mixed.length);
      for (let i = 0; i < mixed.length; i++) {
        const clipped = Math.max(-32768, Math.min(32767, mixed[i]!));
        int16Data[i] = Math.round(clipped);
      }

      const frame = new AudioFrame(int16Data, this.sampleRate, this.numChannels, this.chunkSize);

      // Add to queue if there's space
      if (this.queue.length < this.capacity) {
        this.queue.push(frame);
        // Notify waiting consumers
        const resolver = this.queueResolvers.shift();
        if (resolver) {
          resolver();
        }
      }
    }

    // Signal end of stream
    this.queueResolvers.forEach((resolve) => resolve());
    this.queueResolvers = [];
  }

  private async getContribution(
    stream: AudioStream,
    buf: Int16Array,
  ): Promise<Contribution | null> {
    let hadData = buf.length > 0;
    let exhausted = false;
    let buffer = buf;

    const samplesNeeded = this.chunkSize * this.numChannels;

    while (buffer.length < samplesNeeded && !exhausted) {
      try {
        const frame = await this.timeoutPromise(
          stream.next(),
          this.streamTimeoutMs,
        );

        if (frame.done) {
          exhausted = true;
          break;
        }

        const audioFrame = frame.value;
        const newData = audioFrame.data;

        // Concatenate buffers
        const combined = new Int16Array(buffer.length + newData.length);
        combined.set(buffer, 0);
        combined.set(newData, buffer.length);
        buffer = combined;
        hadData = true;
      } catch (error) {
        if (error instanceof Error && error.message === 'timeout') {
          log.warn(`AudioMixer: stream timeout, ignoring`);
          break;
        }
        // Stream ended
        exhausted = true;
        break;
      }
    }

    let contrib: Int16Array;
    if (buffer.length >= samplesNeeded) {
      contrib = buffer.slice(0, samplesNeeded);
      buffer = buffer.slice(samplesNeeded);
    } else {
      // Pad with zeros if we don't have enough data
      const padded = new Int16Array(samplesNeeded);
      padded.set(buffer, 0);
      contrib = padded;
      buffer = new Int16Array(0);
    }

    return {
      stream,
      data: contrib,
      buffer,
      hadData,
      exhausted,
    };
  }

  private async timeoutPromise<T>(
    promise: Promise<T>,
    timeoutMs: number,
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), timeoutMs),
      ),
    ]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
