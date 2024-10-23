// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { create } from '@bufbuild/protobuf';
import { Mutex } from '@livekit/mutex';
import type { FfiEvent } from './ffi_client.js';
import { FfiClient, FfiClientEvent, FfiHandle } from './ffi_client.js';
import type {
  NewVideoStreamResponse,
  VideoRotation,
  VideoStreamInfo,
} from './proto/video_frame_pb.js';
import { NewVideoStreamRequestSchema, VideoStreamType } from './proto/video_frame_pb.js';
import type { Track } from './track.js';
import { VideoFrame } from './video_frame.js';

export type VideoFrameEvent = {
  frame: VideoFrame;
  timestampUs: bigint;
  rotation: VideoRotation;
};

export class VideoStream implements AsyncIterableIterator<VideoFrameEvent> {
  /** @internal */
  info: VideoStreamInfo;
  /** @internal */
  ffiHandle: FfiHandle;
  /** @internal */
  eventQueue: (VideoFrameEvent | null)[] = [];
  /** @internal */
  queueResolve: ((value: IteratorResult<VideoFrameEvent>) => void) | null = null;
  /** @internal */
  mutex = new Mutex();

  track: Track;

  constructor(track: Track) {
    this.track = track;

    const req = create(NewVideoStreamRequestSchema, {
      type: VideoStreamType.VIDEO_STREAM_NATIVE,
      trackHandle: track.ffi_handle.handle,
    });

    const res = FfiClient.instance.request<NewVideoStreamResponse>({
      message: {
        case: 'newVideoStream',
        value: req,
      },
    });

    this.info = res.stream!.info!;
    this.ffiHandle = new FfiHandle(res.stream!.handle!.id);

    FfiClient.instance.on(FfiClientEvent.FfiEvent, this.onEvent);
  }

  private onEvent = (ev: FfiEvent) => {
    if (
      ev.message.case != 'videoStreamEvent' ||
      ev.message.value.streamHandle != this.ffiHandle.handle
    ) {
      return;
    }

    const streamEvent = ev.message.value.message;
    switch (streamEvent.case) {
      case 'frameReceived':
        const rotation = streamEvent.value.rotation;
        const timestampUs = streamEvent.value.timestampUs;
        const frame = VideoFrame.fromOwnedInfo(streamEvent.value.buffer!);
        const value = { rotation, timestampUs, frame };
        if (this.queueResolve) {
          this.queueResolve({ done: false, value });
        } else {
          this.eventQueue.push(value);
        }
        break;
      case 'eos':
        FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
        break;
    }
  };

  async next(): Promise<IteratorResult<VideoFrameEvent>> {
    const unlock = await this.mutex.lock();
    if (this.eventQueue.length > 0) {
      unlock();
      const value = this.eventQueue.shift();
      if (value) {
        return { done: false, value };
      } else {
        return { done: true, value: undefined };
      }
    }
    const promise = new Promise<IteratorResult<VideoFrameEvent>>(
      (resolve) => (this.queueResolve = resolve),
    );
    unlock();
    return promise;
  }

  close() {
    this.eventQueue.push(null);
    this.ffiHandle.dispose();
  }

  [Symbol.asyncIterator](): VideoStream {
    return this;
  }
}
