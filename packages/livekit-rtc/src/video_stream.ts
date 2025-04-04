// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { Mutex } from '@livekit/mutex';
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
import { RingQueue } from './utils.js';

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
  eventQueue: RingQueue<IteratorResult<VideoFrameEvent>>;
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

    FfiClient.instance.on(FfiClientEvent.FfiEvent, this.onEvent);

    this.eventQueue = new RingQueue<IteratorResult<VideoFrameEvent>>(capacity);
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
        this.eventQueue.push({ done: false, value: { 
          rotation: rotation!, 
          timestampUs: timestampUs!, 
          frame 
        }});
        break;
      case 'eos':
        FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
        break;
    }
  };

  async next(): Promise<IteratorResult<VideoFrameEvent>> {
    const unlock = await this.mutex.lock();
    const result = this.eventQueue.get();
    unlock();
    return result;
  }

  close() {
    this.eventQueue.push({ done: true, value: undefined });
    this.ffiHandle.dispose();
  }

  [Symbol.asyncIterator](): VideoStream {
    return this;
  }
}
