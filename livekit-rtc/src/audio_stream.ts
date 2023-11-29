import { AudioFrame } from './audio_frame';
import { FfiClient, FfiClientEvent, FfiEvent, FfiHandle, FfiRequest } from './ffi_client';
import {
  AudioStreamInfo,
  AudioStreamType,
  NewAudioStreamRequest,
  NewAudioStreamResponse,
} from './proto/audio_frame_pb';
import { Track } from './track';
import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';

export type AudioStreamCallbacks = {
  frameReceived: (frame: AudioFrame) => void;
};

export enum AudioStreamEvent {
  FrameReceived = 'frameReceived',
}

export class AudioStream extends (EventEmitter as new () => TypedEmitter<AudioStreamCallbacks>) {
  /** @internal */
  info: AudioStreamInfo;
  /** @internal */
  ffiHandle: FfiHandle;

  track: Track;

  constructor(track: Track) {
    super();
    this.track = track;

    let req = new NewAudioStreamRequest({
      type: AudioStreamType.AUDIO_STREAM_NATIVE,
      trackHandle: track.ffi_handle.handle,
    });

    let res = FfiClient.instance.request<NewAudioStreamResponse>({
      message: {
        case: 'newAudioStream',
        value: req,
      },
    });

    this.info = res.stream.info;
    this.ffiHandle = new FfiHandle(res.stream.handle.id);

    FfiClient.instance.on(FfiClientEvent.FfiEvent, this.onEvent);
  }

  private onEvent(ev: FfiEvent) {
    if (
      ev.message.case != 'audioStreamEvent' ||
      ev.message.value.streamHandle != this.ffiHandle.handle
    ) {
      return;
    }

    let streamEvent = ev.message.value.message;
    switch (streamEvent.case) {
      case 'frameReceived':
        let frame = AudioFrame.fromOwnedInfo(streamEvent.value.frame);
        this.emit(AudioStreamEvent.FrameReceived, frame);
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
