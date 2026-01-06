// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { log } from '../log.js';
import type { DataStream_Chunk } from '../proto/room_pb.js';
import { bigIntToNumber } from '../utils.js';
import type { BaseStreamInfo, ByteStreamInfo, TextStreamInfo } from './types.js';

abstract class BaseStreamReader<T extends BaseStreamInfo> {
  protected reader: ReadableStream<DataStream_Chunk>;

  protected totalByteSize?: number;

  protected _info: T;

  protected bytesReceived: number;

  get info() {
    return this._info;
  }

  constructor(info: T, stream: ReadableStream<DataStream_Chunk>, totalByteSize?: number) {
    this.reader = stream;
    this.totalByteSize = totalByteSize;
    this._info = info;
    this.bytesReceived = 0;
  }

  protected abstract handleChunkReceived(chunk: DataStream_Chunk): void;

  onProgress?: (progress: number | undefined) => void;

  abstract readAll(): Promise<string | Array<Uint8Array>>;
}

/**
 * A class to read chunks from a ReadableStream and provide them in a structured format.
 */
export class ByteStreamReader extends BaseStreamReader<ByteStreamInfo> {
  protected handleChunkReceived(chunk: DataStream_Chunk) {
    this.bytesReceived += chunk.content!.byteLength;
    const currentProgress = this.totalByteSize
      ? this.bytesReceived / this.totalByteSize
      : undefined;
    this.onProgress?.(currentProgress);
  }

  [Symbol.asyncIterator]() {
    const reader = this.reader.getReader();

    return {
      next: async (): Promise<IteratorResult<Uint8Array>> => {
        try {
          const { done, value } = await reader.read();
          if (done) {
            return { done: true, value: undefined as unknown };
          } else {
            this.handleChunkReceived(value);
            return { done: false, value: value.content! };
          }
        } catch (error: unknown) {
          log.error('error processing stream update: %s', error);
          return { done: true, value: undefined as unknown };
        }
      },

      return(): IteratorResult<Uint8Array> {
        reader.releaseLock();
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
  private receivedChunks: Map<number, DataStream_Chunk>;

  /**
   * A TextStreamReader instance can be used as an AsyncIterator that returns the entire string
   * that has been received up to the current point in time.
   */
  constructor(
    info: TextStreamInfo,
    stream: ReadableStream<DataStream_Chunk>,
    totalChunkCount?: number,
  ) {
    super(info, stream, totalChunkCount);
    this.receivedChunks = new Map();
  }

  protected handleChunkReceived(chunk: DataStream_Chunk) {
    const index = bigIntToNumber(chunk.chunkIndex!);
    const previousChunkAtIndex = this.receivedChunks.get(index!);
    if (previousChunkAtIndex && previousChunkAtIndex.version! > chunk.version!) {
      // we have a newer version already, dropping the old one
      return;
    }
    this.receivedChunks.set(index, chunk);
    const currentProgress = this.totalByteSize
      ? this.receivedChunks.size / this.totalByteSize
      : undefined;
    this.onProgress?.(currentProgress);
  }

  /**
   * Async iterator implementation to allow usage of `for await...of` syntax.
   * Yields structured chunks from the stream.
   *
   */
  [Symbol.asyncIterator]() {
    const reader = this.reader.getReader();
    const decoder = new TextDecoder();

    return {
      next: async (): Promise<IteratorResult<string>> => {
        try {
          const { done, value } = await reader.read();
          if (done) {
            return { done: true, value: undefined };
          } else {
            this.handleChunkReceived(value);
            return {
              done: false,
              value: decoder.decode(value.content!),
            };
          }
        } catch (error: unknown) {
          log.error('error processing stream update: %s', error);
          return { done: true, value: undefined };
        }
      },

      return(): IteratorResult<string> {
        reader.releaseLock();
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
