// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import { FfiClient, FfiHandle, FfiRequest } from './ffi_client.js';
import {
  CaptureVideoFrameRequest,
  CaptureVideoFrameResponse,
  NewVideoSourceRequest,
  NewVideoSourceResponse,
  VideoRotation,
  VideoSourceInfo,
  VideoSourceType,
} from './proto/video_frame_pb.js';
import { VideoFrame } from './video_frame.js';

export class VideoSource {
  /** @internal */
  info: VideoSourceInfo;
  /** @internal */
  ffiHandle: FfiHandle;

  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    let req = new NewVideoSourceRequest({
      type: VideoSourceType.VIDEO_SOURCE_NATIVE,
      resolution: {
        width: width,
        height: height,
      },
    });

    let res = FfiClient.instance.request<NewVideoSourceResponse>({
      message: {
        case: 'newVideoSource',
        value: req,
      },
    });

    this.info = res.source.info;
    this.ffiHandle = new FfiHandle(res.source.handle.id);
  }

  captureFrame(frame: VideoFrame, timestampUs = 0n, rotation = VideoRotation.VIDEO_ROTATION_0) {
    let req = new CaptureVideoFrameRequest({
      sourceHandle: this.ffiHandle.handle,
      buffer: frame.protoInfo(),
      rotation,
      timestampUs,
    });

    FfiClient.instance.request<CaptureVideoFrameResponse>({
      message: { case: 'captureVideoFrame', value: req },
    });
  }
}
