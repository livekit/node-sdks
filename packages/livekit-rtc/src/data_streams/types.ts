// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { DataStream_Chunk, DataStream_Header } from '../proto/room_pb.js';
import type { ByteStreamReader, TextStreamReader } from './stream_reader.js';

export interface StreamController<T extends DataStream_Chunk> {
  header: DataStream_Header;
  controller: ReadableStreamDefaultController<T>;
  startTime: number;
  endTime?: number;
}

export interface BaseStreamInfo {
  streamId: string;
  mimeType: string;
  topic: string;
  timestamp: number;
  /** total size in bytes for finite streams and undefined for streams of unknown size */
  totalSize?: number;
  attributes?: Record<string, string>;
}

export type ByteStreamInfo = BaseStreamInfo & {
  name: string;
};

export type TextStreamInfo = BaseStreamInfo;

export interface DataStreamOptions {
  topic?: string;
  destinationIdentities?: Array<string>;
  attributes?: Record<string, string>;
  mimeType?: string;
}

export interface TextStreamOptions extends DataStreamOptions {
  // replyToMessageId?: string;
  attachments?: [];
}

export interface ByteStreamOptions extends DataStreamOptions {
  name?: string;
  onProgress?: (progress: number) => void;
}

export type ByteStreamHandler = (
  reader: ByteStreamReader,
  participantInfo: { identity: string },
) => void;

export type TextStreamHandler = (
  reader: TextStreamReader,
  participantInfo: { identity: string },
) => void;
