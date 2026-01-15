// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { UnderlyingSource } from 'node:stream/web';
import { AudioFrame } from './audio_frame.js';
import type { FfiEvent } from './ffi_client.js';
import { FfiClient, FfiClientEvent, FfiHandle } from './ffi_client.js';
import { FrameProcessor } from './frame_processor.js';
import { log } from './log.js';
import type { NewAudioStreamResponse } from './proto/audio_frame_pb.js';
import { AudioStreamType, NewAudioStreamRequest } from './proto/audio_frame_pb.js';
import type { Track } from './track.js';

export interface AudioStreamOptions {
  noiseCancellation?: NoiseCancellationOptions | FrameProcessor<AudioFrame>;
  sampleRate?: number;
  numChannels?: number;
  frameSizeMs?: number;
}

export interface NoiseCancellationOptions {
  moduleId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Record<string, any>;
}

class AudioStreamSource implements UnderlyingSource<AudioFrame> {
  private controller?: ReadableStreamDefaultController<AudioFrame>;
  private ffiHandle: FfiHandle;
  private sampleRate: number;
  private numChannels: number;
  private legacyNcOptions?: NoiseCancellationOptions;
  private frameProcessor?: FrameProcessor<AudioFrame>;
  private frameSizeMs?: number;

  constructor(
    track: Track,
    sampleRateOrOptions?: number | AudioStreamOptions,
    numChannels?: number,
  ) {
    if (sampleRateOrOptions !== undefined && typeof sampleRateOrOptions !== 'number') {
      this.sampleRate = sampleRateOrOptions.sampleRate ?? 48000;
      this.numChannels = sampleRateOrOptions.numChannels ?? 1;
      if (sampleRateOrOptions.noiseCancellation instanceof FrameProcessor) {
        this.frameProcessor = sampleRateOrOptions.noiseCancellation;
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
        FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
        this.controller.close();
        this.frameProcessor?.close();
        break;
    }
  };

  start(controller: ReadableStreamDefaultController<AudioFrame>) {
    this.controller = controller;
  }

  cancel() {
    FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
    this.ffiHandle.dispose();
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
