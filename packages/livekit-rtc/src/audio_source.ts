// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { AudioFrame } from './audio_frame.js';
import { FfiClient } from './ffi_client.js';
import { FfiHandle } from './napi/native.js';
import type {
  AudioSourceInfo,
  CaptureAudioFrameCallback,
  CaptureAudioFrameResponse,
  NewAudioSourceResponse,
} from './proto/audio_frame_pb.js';
import {
  AudioSourceType,
  CaptureAudioFrameRequest,
  NewAudioSourceRequest,
} from './proto/audio_frame_pb.js';

export class AudioSource {
  /** @internal */
  info: AudioSourceInfo;
  /** @internal */
  ffiHandle: FfiHandle;

  sampleRate: number;
  numChannels: number;

  constructor(sampleRate: number, numChannels: number) {
    this.sampleRate = sampleRate;
    this.numChannels = numChannels;

    const req = new NewAudioSourceRequest({
      type: AudioSourceType.AUDIO_SOURCE_NATIVE,
      sampleRate: sampleRate,
      numChannels: numChannels,
    });

    const res = FfiClient.instance.request<NewAudioSourceResponse>({
      message: {
        case: 'newAudioSource',
        value: req,
      },
    });

    this.info = res.source.info;
    this.ffiHandle = new FfiHandle(res.source.handle.id);
  }

  async captureFrame(frame: AudioFrame) {
    const req = new CaptureAudioFrameRequest({
      sourceHandle: this.ffiHandle.handle,
      buffer: frame.protoInfo(),
    });

    const res = FfiClient.instance.request<CaptureAudioFrameResponse>({
      message: { case: 'captureAudioFrame', value: req },
    });

    const cb = await FfiClient.instance.waitFor<CaptureAudioFrameCallback>((ev) => {
      return ev.message.case == 'captureAudioFrame' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }
}
