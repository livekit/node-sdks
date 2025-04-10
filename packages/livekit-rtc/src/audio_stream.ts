// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { Mutex } from '@livekit/mutex';
import { ReadableStream, TransformStream } from 'node:stream/web';
import { AudioFrame } from './audio_frame.js';
import type { FfiEvent } from './ffi_client.js';
import { FfiClient, FfiClientEvent, FfiHandle } from './ffi_client.js';
import type { AudioStreamInfo, NewAudioStreamResponse } from './proto/audio_frame_pb.js';
import { AudioStreamType, NewAudioStreamRequest } from './proto/audio_frame_pb.js';
import type { Track } from './track.js';

export class AudioStream implements AsyncIterableIterator<AudioFrame> {
  /** @internal */
  info: AudioStreamInfo;
  /** @internal */
  ffiHandle: FfiHandle;
  /** @internal */
  private reader: ReadableStreamDefaultReader<AudioFrame>;
  /** @internal */
  private onEvent: ((ev: FfiEvent) => void) | null = null;
  /** @internal */
  mutex = new Mutex();

  track: Track;
  sampleRate: number;
  numChannels: number;

  constructor(
    track: Track,
    sampleRate: number = 48000,
    numChannels: number = 1,
    capacity: number = 0,
  ) {
    this.track = track;
    this.sampleRate = sampleRate;
    this.numChannels = numChannels;

    const req = new NewAudioStreamRequest({
      type: AudioStreamType.AUDIO_STREAM_NATIVE,
      trackHandle: track.ffi_handle.handle,
      sampleRate: sampleRate,
      numChannels: numChannels,
    });

    const res = FfiClient.instance.request<NewAudioStreamResponse>({
      message: {
        case: 'newAudioStream',
        value: req,
      },
    });

    this.info = res.stream!.info!;
    this.ffiHandle = new FfiHandle(res.stream!.handle!.id!);

    const source = new ReadableStream<FfiEvent>({
      start: (controller) => {
        this.onEvent = (ev: FfiEvent) => {
          if (
            ev.message.case === 'audioStreamEvent' &&
            ev.message.value.streamHandle === this.ffiHandle.handle
          ) {
            if (controller.desiredSize && controller.desiredSize > 0) {
              controller.enqueue(ev);
            } else {
              console.warn('Audio stream buffer is full, dropping frame');
            }
          }
        };
        FfiClient.instance.on(FfiClientEvent.FfiEvent, this.onEvent);
      },
      cancel: () => {
        if (this.onEvent) {
          FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
          this.onEvent = null;
        }
      },
    });

    const transformStream = new TransformStream<FfiEvent, AudioFrame>(
      {
        transform: (event: FfiEvent, controller: TransformStreamDefaultController<AudioFrame>) => {
          if (
            event.message.case !== 'audioStreamEvent' ||
            event.message.value.streamHandle !== this.ffiHandle.handle
          ) {
            return;
          }

          const streamEvent = event.message.value.message;
          switch (streamEvent.case) {
            case 'frameReceived':
              const frame = AudioFrame.fromOwnedInfo(streamEvent.value.frame!);
              controller.enqueue(frame);
              break;
            case 'eos':
              controller.terminate();
              if (this.onEvent) {
                FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
                this.onEvent = null;
              }
              break;
          }
        },
      },
      {
        highWaterMark: capacity > 0 ? capacity : undefined,
      },
    );

    this.reader = source.pipeThrough(transformStream).getReader();
  }

  async next(): Promise<IteratorResult<AudioFrame>> {
    const unlock = await this.mutex.lock();
    try {
      const result = await this.reader.read();
      return {
        done: result.done,
        value: result.done ? (undefined as any) : result.value,
      };
    } finally {
      unlock();
    }
  }

  close() {
    this.reader.cancel();
    this.ffiHandle.dispose();
  }

  [Symbol.asyncIterator](): AudioStream {
    return this;
  }
}
