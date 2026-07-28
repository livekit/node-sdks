// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { NewAudioStreamResponse } from '@livekit/rtc-ffi-bindings';
import { AudioStreamType, NewAudioStreamRequest } from '@livekit/rtc-ffi-bindings';
import type { UnderlyingSource } from 'node:stream/web';
import { AudioFrame } from './audio_frame.js';
import type { FfiEvent } from './ffi_client.js';
import { FfiClient, FfiClientEvent, FfiHandle } from './ffi_client.js';
import { type FrameProcessor, isFrameProcessor } from './frame_processor.js';
import { log } from './log.js';
import type { Track } from './track.js';

export interface AudioStreamOptions {
  noiseCancellation?: NoiseCancellationOptions | FrameProcessor<AudioFrame>;
  /**
   * When the audio stream closes, whether to run the {@link FrameProcessor}'s
   * `close()` method. If `false`, the processor is left open so it can be
   * reused with another {@link AudioStream}. Only relevant when
   * `noiseCancellation` is a {@link FrameProcessor}. Defaults to `true`.
   */
  autoCloseNoiseCancellation?: boolean;
  sampleRate?: number;
  numChannels?: number;
  frameSizeMs?: number;
}

export interface NoiseCancellationOptions {
  moduleId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Record<string, any>;
}

/** @internal */
export class AudioStreamSource implements UnderlyingSource<AudioFrame> {
  private controller?: ReadableStreamDefaultController<AudioFrame>;
  private ffiHandle: FfiHandle;
  private disposed = false;
  private sampleRate: number;
  private numChannels: number;
  private legacyNcOptions?: NoiseCancellationOptions;
  private frameProcessor: FrameProcessor<AudioFrame> | null = null;
  private autoCloseProcessor = true;
  private frameSizeMs?: number;
  private track: Track;

  constructor(
    track: Track,
    sampleRateOrOptions?: number | AudioStreamOptions,
    numChannels?: number,
  ) {
    this.track = track;
    if (sampleRateOrOptions !== undefined && typeof sampleRateOrOptions !== 'number') {
      this.sampleRate = sampleRateOrOptions.sampleRate ?? 48000;
      this.numChannels = sampleRateOrOptions.numChannels ?? 1;
      if (isFrameProcessor(sampleRateOrOptions.noiseCancellation)) {
        this.frameProcessor = sampleRateOrOptions.noiseCancellation;
        this.autoCloseProcessor = sampleRateOrOptions.autoCloseNoiseCancellation ?? true;
      } else {
        this.legacyNcOptions = sampleRateOrOptions.noiseCancellation;
      }
      this.frameSizeMs = sampleRateOrOptions.frameSizeMs;
    } else {
      this.sampleRate = (sampleRateOrOptions as number) ?? 48000;
      this.numChannels = numChannels ?? 1;
    }

    const req = new NewAudioStreamRequest({
      type: AudioStreamType.AUDIO_STREAM_NATIVE,
      trackHandle: track.ffi_handle.handle,
      sampleRate: this.sampleRate,
      numChannels: this.numChannels,
      frameSizeMs: this.frameSizeMs,
      ...(this.legacyNcOptions
        ? {
            audioFilterModuleId: this.legacyNcOptions.moduleId,
            audioFilterOptions: JSON.stringify(this.legacyNcOptions.options),
          }
        : {}),
    });

    const res = FfiClient.instance.request<NewAudioStreamResponse>({
      message: {
        case: 'newAudioStream',
        value: req,
      },
    });

    this.ffiHandle = new FfiHandle(res.stream!.handle!.id!);

    FfiClient.instance.on(FfiClientEvent.FfiEvent, this.onEvent);
    track.registerAudioStream(this);
  }

  /** @internal */
  get processor(): FrameProcessor<AudioFrame> | null {
    return this.frameProcessor;
  }

  private onEvent = (ev: FfiEvent) => {
    if (!this.controller) {
      throw new Error('Stream controller not initialized');
    }

    if (
      ev.message.case != 'audioStreamEvent' ||
      ev.message.value.streamHandle != this.ffiHandle.handle
    ) {
      return;
    }

    const streamEvent = ev.message.value.message;
    switch (streamEvent.case) {
      case 'frameReceived':
        let frame = AudioFrame.fromOwnedInfo(streamEvent.value.frame!);
        if (this.frameProcessor && this.frameProcessor.isEnabled()) {
          try {
            frame = this.frameProcessor.process(frame);
          } catch (err: unknown) {
            log.warn(`Frame processing failed, passing through original frame: ${err}`);
          }
        }
        this.controller.enqueue(frame);
        break;
      case 'eos':
        // Disposes the native handle so the FD is released on stream end, not
        // just when cancel() is called explicitly by the consumer.
        this.teardown();
        break;
    }
  };

  start(controller: ReadableStreamDefaultController<AudioFrame>) {
    this.controller = controller;
  }

  /**
   * Detach from the FFI and release resources: on `eos`, on `cancel()`, or
   * because the track went away (e.g. it was unsubscribed — which never
   * produces an `eos`, so without this the stream would keep delivering
   * frames). Already-buffered frames stay readable and the consumer sees `done`
   * after draining them.
   *
   * @remarks
   * Idempotent, so `eos` arriving after a `cancel()` (or vice versa) doesn't
   * double-dispose the handle while buffered frames are still queued.
   *
   * @internal
   */
  teardown() {
    FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.track.unregisterAudioStream(this);
    this.ffiHandle.dispose();
    // Close the frame processor on every teardown path so resources are
    // released regardless of how the stream ended.
    if (this.frameProcessor && this.autoCloseProcessor) {
      this.frameProcessor.close();
    }
    try {
      this.controller?.close();
    } catch {
      // Already closed — e.g. cancel(), where the consumer has torn the
      // ReadableStream down before the underlying source is notified.
    }
  }

  cancel() {
    this.teardown();
  }
}

export class AudioStream extends ReadableStream<AudioFrame> {
  constructor(track: Track);
  constructor(track: Track, sampleRate: number);
  constructor(track: Track, sampleRate: number, numChannels: number);
  constructor(track: Track, options: AudioStreamOptions);
  constructor(
    track: Track,
    sampleRateOrOptions?: number | AudioStreamOptions,
    numChannels?: number,
  ) {
    super(new AudioStreamSource(track, sampleRateOrOptions, numChannels));
  }
}
