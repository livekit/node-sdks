// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { create } from '@bufbuild/protobuf';
import { Mutex } from '@livekit/mutex';
import { AudioFrame } from './audio_frame.js';
import type { FfiEvent } from './ffi_client.js';
import { FfiClient, FfiClientEvent, FfiHandle } from './ffi_client.js';
import type { AudioStreamInfo, NewAudioStreamResponse } from './proto/audio_frame_pb.js';
import { AudioStreamType, NewAudioStreamRequestSchema } from './proto/audio_frame_pb.js';
import type { Track } from './track.js';

export class AudioStream implements AsyncIterableIterator<AudioFrame> {
  /** @internal */
  info: AudioStreamInfo;
  /** @internal */
  ffiHandle: FfiHandle;
  /** @internal */
  eventQueue: (AudioFrame | null)[] = [];
  /** @internal */
  queueResolve: ((value: IteratorResult<AudioFrame>) => void) | null = null;
  /** @internal */
  mutex = new Mutex();

  track: Track;
  sampleRate: number;
  numChannels: number;

  constructor(track: Track, sampleRate: number = 48000, numChannels: number = 1) {
    this.track = track;
    this.sampleRate = sampleRate;
    this.numChannels = numChannels;

    const req = create(NewAudioStreamRequestSchema, {
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
    this.ffiHandle = new FfiHandle(res.stream!.handle!.id);

    FfiClient.instance.on(FfiClientEvent.FfiEvent, this.onEvent);
  }

  private onEvent = (ev: FfiEvent) => {
    if (
      ev.message.case != 'audioStreamEvent' ||
      ev.message.value.streamHandle != this.ffiHandle.handle
    ) {
      return;
    }

    const streamEvent = ev.message.value.message;
    switch (streamEvent.case) {
      case 'frameReceived':
        const frame = AudioFrame.fromOwnedInfo(streamEvent.value.frame!);
        if (this.queueResolve) {
          this.queueResolve({ done: false, value: frame });
        } else {
          this.eventQueue.push(frame);
        }
        break;
      case 'eos':
        FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
        break;
    }
  };

  async next(): Promise<IteratorResult<AudioFrame>> {
    const unlock = await this.mutex.lock();
    if (this.eventQueue.length > 0) {
      unlock();
      const value = this.eventQueue.shift();
      if (value) {
        return { done: false, value };
      } else {
        return { done: true, value: undefined };
      }
    }
    const promise = new Promise<IteratorResult<AudioFrame>>(
      (resolve) => (this.queueResolve = resolve),
    );
    unlock();
    return promise;
  }

  close() {
    this.eventQueue.push(null);
    this.ffiHandle.dispose();
  }

  [Symbol.asyncIterator](): AudioStream {
    return this;
  }
}
