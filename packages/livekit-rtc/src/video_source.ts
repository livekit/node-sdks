// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { FfiClient, FfiHandle } from './ffi_client.js';
import type {
  CaptureVideoFrameResponse,
  NewVideoSourceResponse,
  VideoSourceInfo,
} from './proto/video_frame_pb.js';
import {
  CaptureVideoFrameRequest,
  NewVideoSourceRequest,
  VideoRotation,
  VideoSourceType,
} from './proto/video_frame_pb.js';
import type { VideoFrame } from './video_frame.js';

export class VideoSource {
  /** @internal */
  info?: VideoSourceInfo;
  /** @internal */
  ffiHandle: FfiHandle;
  /** @internal */
  closed = false;

  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    const req = new NewVideoSourceRequest({
      type: VideoSourceType.VIDEO_SOURCE_NATIVE,
      resolution: {
        width: width,
        height: height,
      },
    });

    const res = FfiClient.instance.request<NewVideoSourceResponse>({
      message: {
        case: 'newVideoSource',
        value: req,
      },
    });

    this.info = res.source?.info;
    this.ffiHandle = new FfiHandle(res.source!.handle!.id!);
  }

  captureFrame(
    frame: VideoFrame,
    timestampUs = BigInt(0),
    rotation = VideoRotation.VIDEO_ROTATION_0,
  ) {
    if (this.closed) {
      throw new Error('VideoSource is closed');
    }
    const req = new CaptureVideoFrameRequest({
      sourceHandle: this.ffiHandle.handle,
      buffer: frame.protoInfo(),
      rotation,
      timestampUs,
    });

    FfiClient.instance.request<CaptureVideoFrameResponse>({
      message: { case: 'captureVideoFrame', value: req },
    });
  }

  async close() {
    this.ffiHandle.dispose();
    this.closed = true;
  }
}
