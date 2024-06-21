// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { FfiClient, FfiHandle } from './ffi_client.js';
import type { OwnedAudioFrameBuffer } from './proto/audio_frame_pb.js';
import { AudioFrameBufferInfo } from './proto/audio_frame_pb.js';

export class AudioFrame {
  data: Int16Array;
  sampleRate: number;
  channels: number;
  samplesPerChannel: number;

  constructor(data: Int16Array, sampleRate: number, channels: number, samplesPerChannel: number) {
    this.data = data;
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.samplesPerChannel = samplesPerChannel;
  }

  static create(sampleRate: number, channels: number, samplesPerChannel: number): AudioFrame {
    const data = new Int16Array(channels * samplesPerChannel);
    return new AudioFrame(data, sampleRate, channels, samplesPerChannel);
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedAudioFrameBuffer): AudioFrame {
    const info = owned.info;
    const len = info.numChannels * info.samplesPerChannel * 2; // c_int16
    const data = FfiClient.instance.copyBuffer(info.dataPtr, len);
    new FfiHandle(owned.handle.id).dispose();
    return new AudioFrame(
      new Int16Array(data.buffer),
      info.sampleRate,
      info.numChannels,
      info.samplesPerChannel,
    );
  }

  /** @internal */
  protoInfo(): AudioFrameBufferInfo {
    return new AudioFrameBufferInfo({
      dataPtr: FfiClient.instance.retrievePtr(new Uint8Array(this.data.buffer)),
      sampleRate: this.sampleRate,
      numChannels: this.channels,
      samplesPerChannel: this.samplesPerChannel,
    });
  }
}
