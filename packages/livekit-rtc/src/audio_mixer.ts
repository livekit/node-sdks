// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import { AudioFrame } from './audio_frame.js';
import { log } from './log.js';


// Define types for async iteration (since lib: es2015 doesn't include them)
type AudioStream = {
  [Symbol.asyncIterator](): {
    next(): Promise<IteratorResult<AudioFrame>>;
  };
};

interface Contribution {
  stream: AudioStream;
  data: Int16Array;
  buffer: Int16Array;
  hadData: boolean;
  exhausted: boolean;
}

export interface AudioMixerOptions {
  /**
   * The size of the audio block (in samples) for mixing.
   * If not provided, defaults to sampleRate / 10 (100ms).
   */
  blocksize?: number;

  /**
   * The maximum wait time in milliseconds for each stream to provide
   * audio data before timing out. Defaults to 100 ms.
   */
  streamTimeoutMs?: number;

  /**
   * The maximum number of mixed frames to store in the output queue.
   * Defaults to 100.
   */
  capacity?: number;
}

/**
 * AudioMixer combines multiple async audio streams into a single output stream.
 *
 * The mixer accepts multiple async audio streams and mixes them into a single output stream.
 * Each output frame is generated with a fixed chunk size determined by the blocksize (in samples).
 * If blocksize is not provided (or 0), it defaults to 100ms.
 *
 * Each input stream is processed in parallel, accumulating audio data until at least one chunk
 * of samples is available. If an input stream does not provide data within the specified timeout,
 * a warning is logged. The mixer can be closed immediately
 * (dropping unconsumed frames) or allowed to flush remaining data using endInput().
 *
 * @example
 * ```typescript
 * const mixer = new AudioMixer(48000, 2);
 * mixer.addStream(stream1);
 * mixer.addStream(stream2);
 *
 * for await (const frame of mixer) {
 *   // Process mixed audio frame
 * }
 * ```
 */
export class AudioMixer {
  private streams: Set<AudioStream>;
  private buffers: Map<AudioStream, Int16Array>;
  private streamIterators: Map<AudioStream, { next(): Promise<IteratorResult<AudioFrame>> }>;
  private sampleRate: number;
  private numChannels: number;
  private chunkSize: number;
  private streamTimeoutMs: number;
  private queue: AudioFrame[];
  private queueCapacity: number;
  private ending: boolean;
  private mixerTask?: Promise<void>;
  private queueResolvers: (() => void)[];
  private waitingForData: boolean;
  private closed: boolean;

  /**
   * Initialize the AudioMixer.
   *
   * @param sampleRate - The audio sample rate in Hz.
   * @param numChannels - The number of audio channels.
   * @param options - Optional configuration for the mixer.
   */
  constructor(sampleRate: number, numChannels: number, options: AudioMixerOptions = {}) {
    this.streams = new Set();
    this.buffers = new Map();
    this.streamIterators = new Map();
    this.sampleRate = sampleRate;
    this.numChannels = numChannels;
    this.chunkSize =
      options.blocksize && options.blocksize > 0 ? options.blocksize : Math.floor(sampleRate / 10);
    this.streamTimeoutMs = options.streamTimeoutMs ?? 100;
    this.queue = [];
    this.queueCapacity = options.capacity ?? 100;
    this.ending = false;
    this.waitingForData = false;
    this.closed = false;
    this.queueResolvers = [];

    // Start the mixer task
    this.mixerTask = this.mixer();
  }

  /**
   * Add an audio stream to the mixer.
   *
   * The stream is added to the internal set of streams and an empty buffer is initialized for it,
   * if not already present.
   *
   * @param stream - An async iterable that produces AudioFrame objects.
   * @throws Error if the mixer has been closed.
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
   * @param stream - The audio stream to remove.
   */
  removeStream(stream: AudioStream): void {
    this.streams.delete(stream);
    this.buffers.delete(stream);
    this.streamIterators.delete(stream);
  }

  /**
   * Returns an async iterator for the mixed audio frames.
   */
  [Symbol.asyncIterator]() {
    return {
      next: async (): Promise<IteratorResult<AudioFrame>> => {
        const frame = await this.getNextFrame();
        if (frame === null) {
          return { done: true, value: undefined };
        }
        return { done: false, value: frame };
      },
    };
  }

  /**
   * Immediately stop mixing and close the mixer.
   *
   * This stops the mixing task, and any unconsumed output in the queue may be dropped.
   */
  async aclose(): Promise<void> {
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.ending = true;
    
    // Wake up any waiting getNextFrame calls
    for (const resolve of this.queueResolvers) {
      resolve();
    }
    this.queueResolvers = [];
    
    await this.mixerTask;
  }

  /**
   * Signal that no more streams will be added.
   *
   * This method marks the mixer as closed so that it flushes any remaining buffered output before ending.
   * Note that existing streams will still be processed until exhausted.
   */
  endInput(): void {
    this.ending = true;
  }

  private async getNextFrame(): Promise<AudioFrame | null> {
    while (true) {
      if (this.queue.length > 0) {
        return this.queue.shift()!;
      }

      if (this.closed || (this.ending && this.streams.size === 0)) {
        return null;
      }

      // Wait for data to be available
      await new Promise<void>((resolve) => {
        this.queueResolvers.push(resolve);
        this.waitingForData = true;
        setTimeout(() => {
          const index = this.queueResolvers.indexOf(resolve);
          if (index !== -1) {
            this.queueResolvers.splice(index, 1);
          }
          resolve();
        }, 10);
      });
      this.waitingForData = false;
    }
  }

  private async mixer(): Promise<void> {
    while (true) {
      // If we're in ending mode and there are no more streams, exit.
      if (this.ending && this.streams.size === 0) {
        break;
      }

      if (this.streams.size === 0) {
        await this.sleep(10);
        continue;
      }

      // Process all streams in parallel
      const streamArray = Array.from(this.streams);
      const promises = streamArray.map((stream) => this.getContribution(stream));
      const results = await Promise.all(
        promises.map((p) =>
          p
            .then((value) => ({ status: 'fulfilled' as const, value }))
            .catch((reason) => ({ status: 'rejected' as const, reason })),
        ),
      );

      const contributions: Int16Array[] = [];
      let anyData = false;
      const removals: AudioStream[] = [];

      for (const result of results) {
        if (result.status !== 'fulfilled') {
          continue;
        }

        const contrib = result.value;
        contributions.push(contrib.data);
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

      // Mix the audio data
      const mixed = this.mixAudio(contributions);
      const frame = new AudioFrame(mixed, this.sampleRate, this.numChannels, this.chunkSize);

      // Add to queue (with capacity limit)
      while (this.queue.length >= this.queueCapacity && !this.closed) {
        await this.sleep(1);
      }
      
      if (this.closed) {
        break;
      }
      
      this.queue.push(frame);

      // Wake up any waiting getNextFrame calls
      if (this.queueResolvers.length > 0) {
        const resolvers = [...this.queueResolvers];
        this.queueResolvers = [];
        for (const resolve of resolvers) {
          resolve();
        }
      }
    }

    // Signal end of stream
    const resolvers = [...this.queueResolvers];
    this.queueResolvers = [];
    for (const resolve of resolvers) {
      resolve();
    }
  }

  private async getContribution(stream: AudioStream): Promise<Contribution> {
    let buf = this.buffers.get(stream) ?? new Int16Array(0);
    const hadData = buf.length > 0;
    let exhausted = false;

    // Get or create iterator for this stream
    let iterator = this.streamIterators.get(stream);
    if (!iterator) {
      iterator = stream[Symbol.asyncIterator]();
      this.streamIterators.set(stream, iterator);
    }

    // Accumulate data until we have at least chunkSize samples
    while (buf.length < this.chunkSize * this.numChannels && !exhausted && !this.closed) {
      try {
        const result = await Promise.race([
          iterator.next(),
          this.timeout(this.streamTimeoutMs),
        ]);

        if (result === 'timeout') {
          log.warn(`AudioMixer: stream timeout, ignoring`);
          break;
        }

        if (result.done) {
          exhausted = true;
          break;
        }

        const frame = result.value;
        const newData = frame.data;

        // Concatenate buffers
        if (buf.length === 0) {
          buf = newData;
        } else {
          const combined = new Int16Array(buf.length + newData.length);
          combined.set(buf);
          combined.set(newData, buf.length);
          buf = combined;
        }
      } catch (error) {
        log.error(`Error reading from stream: ${error}`);
        exhausted = true;
        break;
      }
    }

    // Extract contribution and update buffer
    let contrib: Int16Array;
    const samplesNeeded = this.chunkSize * this.numChannels;

    if (buf.length >= samplesNeeded) {
      contrib = buf.subarray(0, samplesNeeded);
      buf = buf.subarray(samplesNeeded);
    } else {
      // Pad with zeros if we don't have enough data
      const padded = new Int16Array(samplesNeeded);
      padded.set(buf);
      contrib = padded;
      buf = new Int16Array(0);
    }

    return {
      stream,
      data: contrib,
      buffer: buf,
      hadData: hadData || buf.length > 0,
      exhausted,
    };
  }

  private mixAudio(contributions: Int16Array[]): Int16Array {
    if (contributions.length === 0) {
      return new Int16Array(this.chunkSize * this.numChannels);
    }

    const length = this.chunkSize * this.numChannels;
    const mixed = new Int16Array(length);

    // Sum all contributions
    for (const contrib of contributions) {
      for (let i = 0; i < length; i++) {
        const val = contrib[i];
        if (val !== undefined) {
          mixed[i] = (mixed[i] ?? 0) + val;
        }
      }
    }

    // Clip to Int16 range
    for (let i = 0; i < length; i++) {
      const val = mixed[i] ?? 0;
      if (val > 32767) {
        mixed[i] = 32767;
      } else if (val < -32768) {
        mixed[i] = -32768;
      }
    }

    return mixed;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private timeout(ms: number): Promise<'timeout'> {
    return new Promise((resolve) => setTimeout(() => resolve('timeout'), ms));
  }
}

