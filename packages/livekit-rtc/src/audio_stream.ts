// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { TypedEventEmitter as TypedEmitter } from '@livekit/typed-emitter';
import EventEmitter from 'events';
import { AudioFrame } from './audio_frame.js';
import type { FfiEvent } from './ffi_client.js';
import { FfiClient, FfiClientEvent, FfiHandle } from './ffi_client.js';
import type { AudioStreamInfo, NewAudioStreamResponse } from './proto/audio_frame_pb.js';
import { AudioStreamType, NewAudioStreamRequest } from './proto/audio_frame_pb.js';
import type { Track } from './track.js';

export type AudioFrameEvent = {
  frame: AudioFrame;
};

export type AudioStreamCallbacks = {
  frameReceived: (frame: AudioFrameEvent) => void;
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
  sampleRate: number;
  numChannels: number;

  constructor(track: Track, sampleRate: number = 48000, numChannels: number = 1) {
    super();
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

    this.info = res.stream.info;
    this.ffiHandle = new FfiHandle(res.stream.handle.id);

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
        const frame = AudioFrame.fromOwnedInfo(streamEvent.value.frame);
        this.emit(AudioStreamEvent.FrameReceived, { frame });
        break;
      case 'eos':
        FfiClient.instance.off(FfiClientEvent.FfiEvent, this.onEvent);
        break;
    }
  };

  close() {
    this.ffiHandle.dispose();
  }
}
