// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { Mutex } from '@livekit/mutex';
import { ReadableStream, TransformStream, TransformStreamDefaultController } from 'node:stream/web';
import type { FfiEvent } from './ffi_client.js';
import { FfiClient, FfiClientEvent, FfiHandle } from './ffi_client.js';
import type {
  NewVideoStreamResponse,
  VideoRotation,
  VideoStreamInfo,
} from './proto/video_frame_pb.js';
import { NewVideoStreamRequest, VideoStreamType } from './proto/video_frame_pb.js';
import type { Track } from './track.js';
import { VideoFrame } from './video_frame.js';

export type VideoFrameEvent = {
  frame: VideoFrame;
  timestampUs: bigint;
  rotation: VideoRotation;
};

export class VideoStream implements AsyncIterableIterator<VideoFrameEvent> {
  /** @internal */
  info?: VideoStreamInfo;
  /** @internal */
  ffiHandle: FfiHandle;
  /** @internal */
  private reader: ReadableStreamDefaultReader<VideoFrameEvent>;
  /** @internal */
  private onEvent: ((ev: FfiEvent) => void) | null = null;
  /** @internal */
  mutex = new Mutex();

  track: Track;

  constructor(track: Track, capacity: number = 0) {
    this.track = track;

    const req = new NewVideoStreamRequest({
      type: VideoStreamType.VIDEO_STREAM_NATIVE,
      trackHandle: track.ffi_handle.handle,
    });

    const res = FfiClient.instance.request<NewVideoStreamResponse>({
      message: {
        case: 'newVideoStream',
        value: req,
      },
    });

    this.info = res.stream?.info;
    this.ffiHandle = new FfiHandle(res.stream!.handle!.id!);

    const source = new ReadableStream<FfiEvent>({
      start: (controller) => {
        this.onEvent = (ev: FfiEvent) => {
          if (
            ev.message.case === 'videoStreamEvent' &&
            ev.message.value.streamHandle === this.ffiHandle.handle
          ) {
            if (controller.desiredSize && controller.desiredSize > 0) {
              controller.enqueue(ev);
            } else {
              console.warn('Video stream buffer is full, dropping frame');
            }
          }
        };
        FfiClient.instance.on(FfiClientEvent.FfiEvent, this.onEvent);
      },
      cancel: () => {
        if (this.onEvent) {
          FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
          this.onEvent = null;
        }
      },
    });

    const transformStream = new TransformStream<FfiEvent, VideoFrameEvent>(
      {
        transform: (
          event: FfiEvent,
          controller: TransformStreamDefaultController<VideoFrameEvent>,
        ) => {
          if (
            event.message.case !== 'videoStreamEvent' ||
            event.message.value.streamHandle !== this.ffiHandle.handle
          ) {
            return;
          }

          const streamEvent = event.message.value.message;
          switch (streamEvent.case) {
            case 'frameReceived':
              const rotation = streamEvent.value.rotation;
              const timestampUs = streamEvent.value.timestampUs;
              const frame = VideoFrame.fromOwnedInfo(streamEvent.value.buffer!);
              controller.enqueue({
                rotation: rotation!,
                timestampUs: timestampUs!,
                frame,
              });
              break;
            case 'eos':
              controller.terminate();
              if (this.onEvent) {
                FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
                this.onEvent = null;
              }
              break;
          }
        },
      },
      {
        highWaterMark: capacity > 0 ? capacity : undefined,
      },
    );

    // Connect the streams and get the reader directly
    this.reader = source.pipeThrough(transformStream).getReader();
  }

  async next(): Promise<IteratorResult<VideoFrameEvent>> {
    const unlock = await this.mutex.lock();
    try {
      const result = await this.reader.read();
      return {
        done: result.done,
        value: result.done ? (undefined as any) : result.value,
      };
    } finally {
      unlock();
    }
  }

  close() {
    this.reader.cancel();
    this.ffiHandle.dispose();
  }

  [Symbol.asyncIterator](): VideoStream {
    return this;
  }
}
