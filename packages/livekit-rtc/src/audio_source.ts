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
  ClearAudioBufferResponse,
  NewAudioSourceResponse,
} from './proto/audio_frame_pb.js';
import {
  AudioSourceType,
  CaptureAudioFrameRequest,
  ClearAudioBufferRequest,
  NewAudioSourceRequest,
} from './proto/audio_frame_pb.js';

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
  release = () => {};
  promise = this.newPromise();
  /** @internal */
  timeout?: ReturnType<typeof setTimeout> = undefined;
  /** @internal */
  closed = false;

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

    this.info = res.source!.info!;
    this.ffiHandle = new FfiHandle(res.source!.handle!.id!);
  }

  get queuedDuration(): number {
    return Math.max(
      this.currentQueueSize - Number(process.hrtime.bigint() / BigInt(1000000)) + this.lastCapture,
      0,
    );
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

    this.currentQueueSize = 0;
    this.release();
  }

  /** @internal */
  async newPromise() {
    return new Promise<void>((resolve) => {
      this.release = resolve;
    });
  }

  async waitForPlayout() {
    return this.promise.then(() => {
      this.lastCapture = 0;
      this.currentQueueSize = 0;
      this.promise = this.newPromise();
      this.timeout = undefined;
    });
  }

  async captureFrame(frame: AudioFrame) {
    if (this.closed) {
      throw new Error('AudioSource is closed');
    }

    if (frame.samplesPerChannel === 0) {
      return;
    }

    const now = Number(process.hrtime.bigint() / BigInt(1000000));
    const elapsed = this.lastCapture === 0 ? 0 : now - this.lastCapture;
    const frameDurationMs = (frame.samplesPerChannel / frame.sampleRate) * 1000;
    this.currentQueueSize = Math.max(this.currentQueueSize - elapsed, 0) + frameDurationMs;

    this.lastCapture = now;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(this.release, this.currentQueueSize);

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

  async close() {
    this.ffiHandle.dispose();
    this.closed = true;
  }
}
