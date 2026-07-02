// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type {
  AudioSourceInfo,
  CaptureAudioFrameCallback,
  CaptureAudioFrameResponse,
  ClearAudioBufferResponse,
  NewAudioSourceResponse,
} from '@livekit/rtc-ffi-bindings';
import {
  AudioSourceType,
  CaptureAudioFrameRequest,
  ClearAudioBufferRequest,
  FfiHandle,
  NewAudioSourceRequest,
} from '@livekit/rtc-ffi-bindings';
import type { AudioFrame } from './audio_frame.js';
import { FfiClient } from './ffi_client.js';

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
  promise?: Promise<void> = undefined;
  /** @internal */
  resolvePromise?: () => void = undefined;
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

    this.releaseWaiter();
  }

  /**
   * Resolve the pending waitForPlayout() promise (if any) and reset the queue
   * bookkeeping. Mirrors python-sdks' AudioSource._release_waiter: the promise is
   * discarded here and lazily re-created by the next captureFrame, so a later
   * waitForPlayout() can never consume a stale resolution and report playout
   * complete while audio is still queued.
   * @internal
   */
  releaseWaiter = () => {
    if (!this.promise) {
      return;
    }

    this.resolvePromise?.();
    this.lastCapture = 0;
    this.currentQueueSize = 0;
    this.promise = undefined;
    this.resolvePromise = undefined;
    // cancel the drain timer (e.g. when released early by clearQueue), otherwise
    // it would fire later and release the waiter of a subsequent segment
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  };

  async waitForPlayout() {
    if (!this.promise) {
      return;
    }

    await this.promise;
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

    if (!this.promise) {
      this.promise = new Promise<void>((resolve) => {
        this.resolvePromise = resolve;
      });
    }

    this.timeout = setTimeout(this.releaseWaiter, this.currentQueueSize);

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
    // Clear any pending playout timeout so its callback doesn't fire after
    // the handle is disposed, which would reference freed native state.
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    // Resolve any pending waitForPlayout() promise so callers don't hang.
    this.releaseWaiter();
    this.ffiHandle.dispose();
    this.closed = true;
  }
}
