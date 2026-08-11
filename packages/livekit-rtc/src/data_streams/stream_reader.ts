// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { DataStream_Chunk } from '@livekit/rtc-ffi-bindings';
import { log } from '../log.js';
import type { BaseStreamInfo, ByteStreamInfo, TextStreamInfo } from './types.js';

abstract class BaseStreamReader<T extends BaseStreamInfo> {
  protected reader: ReadableStream<DataStream_Chunk>;

  protected totalByteSize?: number;

  protected _info: T;

  protected bytesReceived: number;

  private closed = false;

  // The reader held by an in-progress iteration. Cancelling has to go through
  // it, since it holds the stream's lock.
  private activeReader: ReadableStreamDefaultReader<DataStream_Chunk> | null = null;

  get info() {
    return this._info;
  }

  constructor(info: T, stream: ReadableStream<DataStream_Chunk>, totalByteSize?: number) {
    this.reader = stream;
    this.totalByteSize = totalByteSize;
    this._info = info;
    this.bytesReceived = 0;
  }

  protected handleChunkReceived(chunk: DataStream_Chunk) {
    this.bytesReceived += chunk.content!.byteLength;
    const currentProgress = this.totalByteSize
      ? this.bytesReceived / this.totalByteSize
      : undefined;
    this.onProgress?.(currentProgress);
  }

  /** Takes the stream's reader for an iteration, remembering it so that
   * close() can cancel a read that is still in flight. */
  protected acquireReader(): ReadableStreamDefaultReader<DataStream_Chunk> {
    const reader = this.reader.getReader();
    this.activeReader = reader;
    return reader;
  }

  /** Releases the stream lock after an iteration ended on its own — because a
   * read reported end-of-stream, or because the stream itself errored. Either
   * way the stream is in a terminal state and the FFI subscription behind it
   * was already dropped by that terminal event, so there is nothing to cancel.
   *
   * An error raised *around* a read rather than by it — a chunk that failed to
   * process — leaves the stream live, so it has to go through close() instead. */
  protected finishIteration(reader: ReadableStreamDefaultReader<DataStream_Chunk>) {
    this.closed = true;
    if (this.activeReader === reader) {
      this.activeReader = null;
    }
    reader.releaseLock();
  }

  /**
   * Stops receiving this stream and releases the resources behind it.
   *
   * A reader is subscribed to FFI events from the moment it is handed to a
   * stream handler, and only unsubscribes once a read consumes the stream's
   * end-of-stream event. So a reader that is abandoned part-way through, or
   * that a handler never reads at all, has to be closed here or its
   * subscription lives for the rest of the process. Reading to completion — or
   * breaking out of a `for await` — closes the reader for you, and closing an
   * already-closed reader is a no-op.
   */
  async close(): Promise<void> {
    if (this.closed) {
      return;
    }
    this.closed = true;
    const active = this.activeReader;
    this.activeReader = null;
    try {
      if (active) {
        await active.cancel();
        active.releaseLock();
      } else {
        await this.reader.cancel();
      }
    } catch (error: unknown) {
      // The stream was already closed or errored (e.g. the room disconnected
      // mid-stream), in which case its subscription is already gone.
      log.debug('error closing stream reader: %s', error);
    }
  }

  onProgress?: (progress: number | undefined) => void;

  abstract readAll(): Promise<string | Array<Uint8Array>>;
}

/**
 * A class to read chunks from a ReadableStream and provide them in a structured format.
 */
export class ByteStreamReader extends BaseStreamReader<ByteStreamInfo> {
  [Symbol.asyncIterator]() {
    const reader = this.acquireReader();

    return {
      next: async (): Promise<IteratorResult<Uint8Array>> => {
        let read: Awaited<ReturnType<typeof reader.read>>;
        try {
          read = await reader.read();
        } catch (error: unknown) {
          // The stream errored, which is terminal: release the lock so it
          // doesn't stay held when the consumer never calls return() (a
          // rejecting next() doesn't trigger it).
          this.finishIteration(reader);
          log.error('error reading stream: %s', error);
          // Propagate abnormal termination (e.g. remote abort, payload over
          // the receiver's size limit) instead of presenting the truncated
          // payload as a clean EOF.
          throw error;
        }

        if (read.done) {
          // Release the lock when the stream is exhausted so the
          // underlying ReadableStream can be garbage-collected.
          this.finishIteration(reader);
          return { done: true, value: undefined as unknown };
        }

        try {
          this.handleChunkReceived(read.value);
          return { done: false, value: read.value.content! };
        } catch (error: unknown) {
          // The chunk arrived fine but handling it threw (e.g. a consumer's
          // onProgress callback). The stream is still live, so it has to be
          // cancelled to release its FFI subscription.
          await this.close();
          log.error('error processing stream update: %s', error);
          throw error;
        }
      },

      return: async (): Promise<IteratorResult<Uint8Array>> => {
        await this.close();
        return { done: true, value: undefined };
      },
    };
  }

  async readAll(): Promise<Array<Uint8Array>> {
    const chunks: Set<Uint8Array> = new Set();
    for await (const chunk of this) {
      chunks.add(chunk);
    }
    return Array.from(chunks);
  }
}

/**
 * A class to read chunks from a ReadableStream and provide them in a structured format.
 */
export class TextStreamReader extends BaseStreamReader<TextStreamInfo> {
  /**
   * Async iterator implementation to allow usage of `for await...of` syntax.
   * Yields structured chunks from the stream.
   *
   */
  [Symbol.asyncIterator]() {
    const reader = this.acquireReader();
    const decoder = new TextDecoder();

    return {
      next: async (): Promise<IteratorResult<string>> => {
        let read: Awaited<ReturnType<typeof reader.read>>;
        try {
          read = await reader.read();
        } catch (error: unknown) {
          // The stream errored, which is terminal: release the lock so it
          // doesn't stay held when the consumer never calls return() (a
          // rejecting next() doesn't trigger it).
          this.finishIteration(reader);
          log.error('error reading stream: %s', error);
          // Propagate abnormal termination (e.g. remote abort, payload over
          // the receiver's size limit) instead of presenting the truncated
          // payload as a clean EOF.
          throw error;
        }

        if (read.done) {
          // Release the lock when the stream is exhausted so the
          // underlying ReadableStream can be garbage-collected.
          this.finishIteration(reader);
          return { done: true, value: undefined };
        }

        try {
          this.handleChunkReceived(read.value);
          return { done: false, value: decoder.decode(read.value.content!) };
        } catch (error: unknown) {
          // The chunk arrived fine but handling it threw (e.g. a consumer's
          // onProgress callback). The stream is still live, so it has to be
          // cancelled to release its FFI subscription.
          await this.close();
          log.error('error processing stream update: %s', error);
          throw error;
        }
      },

      return: async (): Promise<IteratorResult<string>> => {
        await this.close();
        return { done: true, value: undefined };
      },
    };
  }

  async readAll(): Promise<string> {
    let finalString: string = '';
    for await (const chunk of this) {
      finalString += chunk;
    }
    return finalString;
  }
}
