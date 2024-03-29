// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import { FfiClient, FfiHandle } from './ffi_client.js';
import { AudioFrameBufferInfo, OwnedAudioFrameBuffer } from './proto/audio_frame_pb.js';

export class AudioFrame {
  data: Uint16Array;
  sampleRate: number;
  channels: number;
  samplesPerChannel: number;

  constructor(data: Uint16Array, sampleRate: number, channels: number, samplesPerChannel: number) {
    this.data = data;
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.samplesPerChannel = samplesPerChannel;
  }

  static create(sampleRate: number, channels: number, samplesPerChannel: number): AudioFrame {
    const data = new Uint16Array(channels * samplesPerChannel);
    return new AudioFrame(data, sampleRate, channels, samplesPerChannel);
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedAudioFrameBuffer): AudioFrame {
    let info = owned.info;
    let len = info.numChannels * info.samplesPerChannel * 2; // c_int16
    let data = FfiClient.instance.copyBuffer(info.dataPtr, len);
    new FfiHandle(owned.handle.id).dispose();
    return new AudioFrame(
      new Uint16Array(data.buffer),
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
