// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { WritableStream } from 'node:stream/web';
import type { BaseStreamInfo, FileStreamInfo, TextStreamInfo } from './types.js';

class BaseStreamWriter<T, InfoType extends BaseStreamInfo> {
  protected writableStream: WritableStream<[T, number?]>;

  protected defaultWriter: WritableStreamDefaultWriter<[T, number?]>;

  protected onClose?: () => void;

  readonly info: InfoType;

  constructor(writableStream: WritableStream<[T, number?]>, info: InfoType, onClose?: () => void) {
    this.writableStream = writableStream;
    this.defaultWriter = writableStream.getWriter();
    this.onClose = onClose;
    this.info = info;
  }

  write(chunk: T, chunkIndex?: number): Promise<void> {
    return this.defaultWriter.write([chunk, chunkIndex]);
  }

  async close() {
    await this.defaultWriter.close();
    this.defaultWriter.releaseLock();
    this.onClose?.();
  }
}

export class TextStreamWriter extends BaseStreamWriter<string, TextStreamInfo> {}

export class BinaryStreamWriter extends BaseStreamWriter<Uint8Array, FileStreamInfo> {}
