// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from 'vitest';
import { ByteStreamReader, TextStreamReader } from '../data_streams/stream_reader.js';
import type { ByteStreamInfo, TextStreamInfo } from '../data_streams/types.js';

const encoder = new TextEncoder();

function makeChunk(text: string, index: number = 0) {
  return {
    content: encoder.encode(text),
    chunkIndex: BigInt(index),
    version: 1,
  } as any;
}

const byteInfo: ByteStreamInfo = {
  streamId: 'test-stream',
  mimeType: 'application/octet-stream',
  topic: 'test',
  timestamp: Date.now(),
  name: 'test-file',
};

const textInfo: TextStreamInfo = {
  streamId: 'test-stream',
  mimeType: 'text/plain',
  topic: 'test',
  timestamp: Date.now(),
};

describe('ByteStreamReader', () => {
  it('should release the ReadableStream lock after normal iteration completes', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(makeChunk('hello'));
        controller.enqueue(makeChunk('world'));
        controller.close();
      },
    });

    const reader = new ByteStreamReader(byteInfo, stream as any);
    const chunks: Uint8Array[] = [];
    for await (const chunk of reader) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(2);
    // Stream should be unlocked — getting a new reader should not throw
    const newReader = stream.getReader();
    newReader.releaseLock();
  });

  it('should release the ReadableStream lock when reader.read() throws', async () => {
    let callCount = 0;
    const stream = new ReadableStream({
      pull(controller) {
        callCount++;
        if (callCount === 1) {
          controller.enqueue(makeChunk('ok'));
        } else {
          controller.error(new Error('simulated failure'));
        }
      },
    });

    const reader = new ByteStreamReader(byteInfo, stream as any);
    const chunks: Uint8Array[] = [];
    for await (const chunk of reader) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(1);
    // Stream should be unlocked after error path
    const newReader = stream.getReader();
    newReader.releaseLock();
  });

  it('should release the ReadableStream lock after readAll() completes', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(makeChunk('a'));
        controller.enqueue(makeChunk('b'));
        controller.close();
      },
    });

    const reader = new ByteStreamReader(byteInfo, stream as any);
    const result = await reader.readAll();

    expect(result).toHaveLength(2);
    // Stream should be unlocked
    const newReader = stream.getReader();
    newReader.releaseLock();
  });
});

describe('TextStreamReader', () => {
  it('should release the ReadableStream lock after normal iteration completes', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(makeChunk('hello', 0));
        controller.enqueue(makeChunk(' world', 1));
        controller.close();
      },
    });

    const reader = new TextStreamReader(textInfo, stream as any);
    const texts: string[] = [];
    for await (const text of reader) {
      texts.push(text);
    }

    expect(texts).toHaveLength(2);
    // Stream should be unlocked
    const newReader = stream.getReader();
    newReader.releaseLock();
  });

  it('should release the ReadableStream lock when reader.read() throws', async () => {
    let callCount = 0;
    const stream = new ReadableStream({
      pull(controller) {
        callCount++;
        if (callCount === 1) {
          controller.enqueue(makeChunk('ok', 0));
        } else {
          controller.error(new Error('simulated failure'));
        }
      },
    });

    const reader = new TextStreamReader(textInfo, stream as any);
    const texts: string[] = [];
    for await (const text of reader) {
      texts.push(text);
    }

    expect(texts).toHaveLength(1);
    // Stream should be unlocked after error path
    const newReader = stream.getReader();
    newReader.releaseLock();
  });

  it('should release the ReadableStream lock after readAll() completes', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(makeChunk('hello', 0));
        controller.enqueue(makeChunk(' world', 1));
        controller.close();
      },
    });

    const reader = new TextStreamReader(textInfo, stream as any);
    const result = await reader.readAll();

    expect(result).toBe('hello world');
    // Stream should be unlocked
    const newReader = stream.getReader();
    newReader.releaseLock();
  });
});
