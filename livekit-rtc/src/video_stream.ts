import { FfiClient, FfiClientEvent, FfiEvent, FfiHandle, FfiRequest } from './ffi_client';
import { Track } from './track';
import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { VideoFrame, VideoFrameBuffer } from './video_frame';
import {
  NewVideoStreamRequest,
  NewVideoStreamResponse,
  VideoStreamInfo,
  VideoStreamType,
} from './proto/video_frame_pb';

export type VideoStreamCallbacks = {
  frameReceived: (frame: VideoFrame) => void;
};

export enum VideoStreamEvent {
  FrameReceived = 'frameReceived',
}

export class VideoStream extends (EventEmitter as new () => TypedEmitter<VideoStreamCallbacks>) {
  private info: VideoStreamInfo;

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

    let res = FfiClient.instance.request<NewVideoStreamResponse>(
      new FfiRequest({
        message: {
          case: 'newVideoStream',
          value: req,
        },
      }),
    );

    this.info = res.stream.info;
    this.ffiHandle = new FfiHandle(res.stream.handle.id);

    FfiClient.instance.on(FfiClientEvent.FfiEvent, this.onEvent);
  }

  private onEvent(ev: FfiEvent) {
    if (
      ev.message.case != 'videoStreamEvent' ||
      ev.message.value.streamHandle != this.ffiHandle.handle
    ) {
      return;
    }

    let streamEvent = ev.message.value.message;
    switch (streamEvent.case) {
      case 'frameReceived':
        let frameInfo = streamEvent.value.frame;
        let buffer = VideoFrameBuffer.fromOwnedInfo(streamEvent.value.buffer);
        let frame = new VideoFrame(Number(frameInfo.timestampUs), frameInfo.rotation, buffer);
        this.emit(VideoStreamEvent.FrameReceived, frame);
        break;
      case 'eos':
        FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
        break;
    }
  }

  close() {
    this.ffiHandle.dispose();
  }
}
