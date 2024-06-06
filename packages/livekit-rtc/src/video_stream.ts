// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import EventEmitter from 'events';
import type TypedEmitter from 'typed-emitter';
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

export type VideoStreamCallbacks = {
  frameReceived: (evt: VideoFrameEvent) => void;
};

export enum VideoStreamEvent {
  FrameReceived = 'frameReceived',
}

export class VideoStream extends (EventEmitter as new () => TypedEmitter<VideoStreamCallbacks>) {
  /** @internal */
  info: VideoStreamInfo;
  /** @internal */
  ffiHandle: FfiHandle;

  track: Track;

  constructor(track: Track) {
    super();
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

    this.info = res.stream.info;
    this.ffiHandle = new FfiHandle(res.stream.handle.id);

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
        const frame = VideoFrame.fromOwnedInfo(streamEvent.value.buffer);
        this.emit(VideoStreamEvent.FrameReceived, { frame, timestampUs, rotation });
        break;
      case 'eos':
        FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
        break;
    }
  };

  close() {
    this.ffiHandle.dispose();
  }
}
