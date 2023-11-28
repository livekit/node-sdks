import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { FfiHandle } from './native';
import { AudioFrame } from './audio_frame';
import {
  AudioSourceInfo,
  AudioSourceType,
  CaptureAudioFrameCallback,
  CaptureAudioFrameRequest,
  CaptureAudioFrameResponse,
  NewAudioSourceRequest,
  NewAudioSourceResponse,
} from './proto/audio_frame_pb';
import { FfiClient, FfiRequest } from './ffi_client';

export class AudioSource {
  private info: AudioSourceInfo;

  /** @internal */
  ffiHandle: FfiHandle;
  sampleRate: number;
  numChannels: number;

  constructor(sampleRate: number, numChannels: number) {
    this.sampleRate = sampleRate;
    this.numChannels = numChannels;

    let req = new NewAudioSourceRequest({
      type: AudioSourceType.AUDIO_SOURCE_NATIVE,
      sampleRate: sampleRate,
      numChannels: numChannels,
    });

    let res = FfiClient.instance.request<NewAudioSourceResponse>(
      new FfiRequest({
        message: {
          case: 'newAudioSource',
          value: req,
        },
      }),
    );

    this.info = res.source.info;
    this.ffiHandle = new FfiHandle(res.source.handle.id);
  }

  async captureFrame(frame: AudioFrame) {
    let req = new CaptureAudioFrameRequest({
      sourceHandle: this.ffiHandle.handle,
      buffer: frame.protoInfo(),
    });

    let res = FfiClient.instance.request<CaptureAudioFrameResponse>(
      new FfiRequest({ message: { case: 'captureAudioFrame', value: req } }),
    );

    let cb = await FfiClient.instance.waitFor<CaptureAudioFrameCallback>((ev) => {
      return ev.message.case == 'captureAudioFrame' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }
}
