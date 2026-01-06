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

  private _userdata: Record<string, unknown>;

  // note: if converting from Uint8Array to Int16Array, *do not* use buffer.slice!
  // it is marked unstable by Node and can cause undefined behaviour, such as massive chunks of
  // noise being added to the end.
  // it is recommended to use buffer.subarray instead.
  // XXX(nbsp): add this when writing proper docs
  constructor(
    data: Int16Array,
    sampleRate: number,
    channels: number,
    samplesPerChannel: number,
    userdata: Record<string, unknown> = {},
  ) {
    this.data = data;
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.samplesPerChannel = samplesPerChannel;
    this._userdata = userdata;
  }

  static create(sampleRate: number, channels: number, samplesPerChannel: number): AudioFrame {
    const data = new Int16Array(channels * samplesPerChannel);
    return new AudioFrame(data, sampleRate, channels, samplesPerChannel);
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedAudioFrameBuffer): AudioFrame {
    const info = owned.info!;
    const len = info.numChannels! * info.samplesPerChannel! * 2; // c_int16
    const data = FfiClient.instance.copyBuffer(info.dataPtr!, len);
    new FfiHandle(owned.handle!.id!).dispose();
    return new AudioFrame(
      new Int16Array(data.buffer),
      info.sampleRate!,
      info.numChannels!,
      info.samplesPerChannel!,
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

  /** Returns the user data associated with the audio frame. */
  get userdata() {
    return this._userdata;
  }
}

/**
 * Combines one or more `rtc.AudioFrame` objects into a single `rtc.AudioFrame`.
 *
 * This function concatenates the audio data from multiple frames, ensuring that all frames have
 * the same sample rate and number of channels. It efficiently merges the data by preallocating the
 * necessary memory and copying the frame data without unnecessary reallocations.
 *
 * @param buffer - a single AudioFrame or list thereof
 */
export const combineAudioFrames = (buffer: AudioFrame | AudioFrame[]): AudioFrame => {
  if (!Array.isArray(buffer)) {
    return buffer;
  }
  buffer = buffer as AudioFrame[];

  if (buffer.length === 0) {
    throw new Error('buffer is empty');
  }

  const sampleRate = buffer[0]!.sampleRate;
  const channels = buffer[0]!.channels;

  let totalSamplesPerChannel = 0;
  for (const frame of buffer) {
    if (frame.sampleRate != sampleRate) {
      throw new Error(`sample rate mismatch: expected ${sampleRate}, got ${frame.sampleRate}`);
    }

    if (frame.channels != channels) {
      throw new Error(`channel mismatch: expected ${channels}, got ${frame.channels}`);
    }

    totalSamplesPerChannel += frame.samplesPerChannel;
  }

  const data = new Int16Array(buffer.map((x) => [...x.data]).flat());
  return new AudioFrame(data, sampleRate, channels, totalSamplesPerChannel);
};
