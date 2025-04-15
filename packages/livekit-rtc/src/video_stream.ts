// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
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
import { ReadableStream } from 'node:stream/web';

export type VideoFrameEvent = {
  frame: VideoFrame;
  timestampUs: bigint;
  rotation: VideoRotation;
};

export class VideoStream extends ReadableStream<VideoFrameEvent> {
  /** @internal */
  info?: VideoStreamInfo;
  /** @internal */
  ffiHandle: FfiHandle;
  /** @internal */
  controller?: ReadableStreamDefaultController<VideoFrameEvent>;

  track: Track;

  constructor(track: Track) {
    super({
      start: (controller) => {
        this.controller = controller;
      },
    });
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
  }

  private onEvent = (ev: FfiEvent) => {
    if (!this.controller) {
      throw new Error('Stream controller not initialized');
    }

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
        const videoFrameEvent = {
          frame: value.frame,
          timestampUs: value.timestampUs!,
          rotation: value.rotation!,
        };

        this.controller.enqueue(videoFrameEvent);
        break;
      case 'eos':
        FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
        this.controller.close();
        break;
    }
  };

  close() {
    if (!this.controller) {
      throw new Error('Stream controller not initialized');
    }
      try {
        this.controller.close();
      } catch (e) {
        // Controller might already be closed
        throw e;
      }
    this.ffiHandle.dispose();
  }
}
