// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import { FfiClient, FfiClientEvent, FfiEvent, FfiHandle, FfiRequest } from './ffi_client.js';
import { Track } from './track.js';
import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { VideoFrame } from './video_frame.js';
import {
  NewVideoStreamRequest,
  NewVideoStreamResponse,
  VideoRotation,
  VideoStreamInfo,
  VideoStreamType,
} from './proto/video_frame_pb.js';

export type VideoFrameEvent = {
  frame: VideoFrame,
  timestampUs: bigint,
  rotation: VideoRotation,
}

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

    let req = new NewVideoStreamRequest({
      type: VideoStreamType.VIDEO_STREAM_NATIVE,
      trackHandle: track.ffi_handle.handle,
    });

    let res = FfiClient.instance.request<NewVideoStreamResponse>({
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

    let streamEvent = ev.message.value.message;
    switch (streamEvent.case) {
      case 'frameReceived':
        let rotation = streamEvent.value.rotation;
        let timestampUs = streamEvent.value.timestampUs;
        let frame = VideoFrame.fromOwnedInfo(streamEvent.value.buffer);
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
