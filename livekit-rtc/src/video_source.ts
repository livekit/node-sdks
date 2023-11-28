import { FfiClient, FfiHandle, FfiRequest } from './ffi_client';
import {
  CaptureVideoFrameRequest,
  CaptureVideoFrameResponse,
  NewVideoSourceRequest,
  NewVideoSourceResponse,
  VideoSourceInfo,
  VideoSourceType,
} from './proto/video_frame_pb';
import { VideoFrame } from './video_frame';

export class VideoSource {
  private info: VideoSourceInfo;

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

    let res = FfiClient.instance.request<NewVideoSourceResponse>(
      new FfiRequest({
        message: {
          case: 'newVideoSource',
          value: req,
        },
      }),
    );

    this.info = res.source.info;
    this.ffiHandle = new FfiHandle(res.source.handle.id);
  }

  captureFrame(frame: VideoFrame) {
    let req = new CaptureVideoFrameRequest({
      sourceHandle: this.ffiHandle.handle,
      from: {
        case: 'info',
        value: frame.buffer.protoInfo(),
      },
      frame: {
        rotation: frame.rotation,
        timestampUs: BigInt(frame.timestampUs),
      },
    });

    FfiClient.instance.request<CaptureVideoFrameResponse>(
      new FfiRequest({ message: { case: 'captureVideoFrame', value: req } }),
    );
  }
}
