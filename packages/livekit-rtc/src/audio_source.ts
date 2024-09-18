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

  ClearAudioBufferResponse} from './proto/audio_frame_pb.js';
import {
  AudioSourceType,
  CaptureAudioFrameRequest,
  ClearAudioBufferRequest,
  NewAudioSourceRequest,
} from './proto/audio_frame_pb.js';
import { Queue } from './utils.js';

export class AudioSource {
  /** @internal */
  info: AudioSourceInfo;
  /** @internal */
  ffiHandle: FfiHandle;
  /** @internal */
  lastCapture: number;
  /** @internal */
  currentQueueSize: number;
  /** @internal */
  releaseQueue = new Queue<void>();

  sampleRate: number;
  numChannels: number;
  queueSize: number;

  constructor(sampleRate: number, numChannels: number, queueSize = 1000) {
    this.sampleRate = sampleRate;
    this.numChannels = numChannels;
    this.queueSize = queueSize;

    this.lastCapture = 0;
    this.currentQueueSize = 0;

    const req = new NewAudioSourceRequest({
      type: AudioSourceType.AUDIO_SOURCE_NATIVE,
      sampleRate: sampleRate,
      numChannels: numChannels,
      queueSizeMs: queueSize,
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

  get queuedDuration(): number {
    return Math.max(this.currentQueueSize - Date.now() + this.lastCapture, 0);
  }

  clearQueue() {
    const req = new ClearAudioBufferRequest({
      sourceHandle: this.ffiHandle.handle,
    });

    FfiClient.instance.request<ClearAudioBufferResponse>({
      message: {
        case: 'clearAudioBuffer',
        value: req,
      },
    });

    this.releaseQueue.put();
  }

  async waitForPlayout() {
    await this.releaseQueue.get().then(() => {
      this.lastCapture = 0
      this.currentQueueSize = 0;
    })
  }

  async captureFrame(frame: AudioFrame) {
    const now = Date.now()
    const elapsed = this.lastCapture === 0 ? 0 : now - this.lastCapture;
    this.currentQueueSize += frame.samplesPerChannel / frame.sampleRate - elapsed

    // remove 50ms to account for processing time (e.g. using wait_for_playout for very small chunks)
    this.currentQueueSize -= 0.05
    this.lastCapture = now

    setTimeout(this.releaseQueue.put, this.currentQueueSize)
    
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
