import type { DataStream_Chunk, DataStream_Header } from '@livekit/protocol';

export interface StreamController<T extends DataStream_Chunk> {
  header: DataStream_Header;
  controller: ReadableStreamDefaultController<T>;
  startTime: number;
  endTime?: number;
}

export interface BaseStreamInfo {
  id: string;
  mimeType: string;
  topic: string;
  timestamp: number;
  /** total size in bytes for finite streams and undefined for streams of unknown size */
  size?: number;
  extensions?: Record<string, string>;
}

export type FileStreamInfo = BaseStreamInfo & {
  fileName: string;
};

export type TextStreamInfo = BaseStreamInfo;

export type TextStreamChunk = {
  index: number;
  current: string;
  collected: string;
};

export interface SendTextOptions {
  topic?: string;
  // replyToMessageId?: string;
  destinationIdentities?: Array<string>;
  attachments?: Array<File>;
  onProgress?: (progress: number) => void;
}
