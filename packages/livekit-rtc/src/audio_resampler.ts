// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { AudioFrame } from './audio_frame.js';
import { FfiClient, FfiHandle } from './ffi_client.js';
import type {
  FlushSoxResamplerResponse,
  NewSoxResamplerResponse,
  PushSoxResamplerResponse,
} from './proto/audio_frame_pb.js';
import {
  FlushSoxResamplerRequest,
  NewSoxResamplerRequest,
  PushSoxResamplerRequest,
  SoxQualityRecipe,
  SoxResamplerDataType,
} from './proto/audio_frame_pb.js';

/**
 * Resampler quality. Higher quality settings result in better audio quality but require more
 * processing power.
 */
export enum AudioResamplerQuality {
  QUICK = SoxQualityRecipe.SOXR_QUALITY_QUICK,
  LOW = SoxQualityRecipe.SOXR_QUALITY_LOW,
  MEDIUM = SoxQualityRecipe.SOXR_QUALITY_MEDIUM,
  HIGH = SoxQualityRecipe.SOXR_QUALITY_HIGH,
  VERY_HIGH = SoxQualityRecipe.SOXR_QUALITY_VERYHIGH,
}

/**
 * AudioResampler provides functionality to resample audio data from an input sample rate to
 * an output sample rate using the Sox resampling library. It supports multiple channels and
 * configurable resampling quality.
 */
export class AudioResampler {
  #inputRate: number;
  #outputRate: number;
  #channels: number;
  #ffiHandle: FfiHandle;

  /**
   * Initializes a new AudioResampler.
   *
   * @param inputRate - The sample rate of the input audio data (in Hz).
   * @param outputRate - The desired sample rate of the output audio data (in Hz).
   * @param channels - The number of audio channels (e.g., 1 for mono, 2 for stereo). Defaults to 1.
   * @param quality - The quality setting for the resampler. Defaults to
   * `AudioResamplerQuality.MEDIUM`.
   */
  constructor(
    inputRate: number,
    outputRate: number,
    channels = 1,
    quality = AudioResamplerQuality.MEDIUM,
  ) {
    this.#inputRate = inputRate;
    this.#outputRate = outputRate;
    this.#channels = channels;

    const req = new NewSoxResamplerRequest({
      inputRate,
      outputRate,
      numChannels: channels,
      qualityRecipe: quality as number as SoxQualityRecipe,
      inputDataType: SoxResamplerDataType.SOXR_DATATYPE_INT16I,
      outputDataType: SoxResamplerDataType.SOXR_DATATYPE_INT16I,
      flags: 0,
    });

    const res = FfiClient.instance.request<NewSoxResamplerResponse>({
      message: {
        case: 'newSoxResampler',
        value: req,
      },
    });

    switch (res.message.case) {
      case 'resampler':
        this.#ffiHandle = new FfiHandle(res.message.value.handle!.id!);
        break;
      case 'error':
      default:
        throw new Error(res.message.value);
    }
  }

  get inputRate(): number {
    return this.#inputRate;
  }

  get outputRate(): number {
    return this.#outputRate;
  }

  get channels(): number {
    return this.#channels;
  }

  /**
   * Push audio data into the resampler and retrieve any available resampled data.
   *
   * This method accepts audio data, resamples it according to the configured input and output rates,
   * and returns any resampled data that is available after processing the input.
   *
   * @param data - The audio frame to resample
   *
   * @returns A list of {@link AudioFrame} objects containing the resampled audio data. The list may
   * be empty if no output data is available yet.
   */
  push(data: AudioFrame): AudioFrame[] {
    const req = new PushSoxResamplerRequest({
      resamplerHandle: this.#ffiHandle.handle,
      dataPtr: data.protoInfo().dataPtr,
      size: data.data.byteLength,
    });

    const res = FfiClient.instance.request<PushSoxResamplerResponse>({
      message: {
        case: 'pushSoxResampler',
        value: req,
      },
    });

    if (res.error) {
      throw new Error(res.error);
    }

    if (!res.outputPtr) {
      return [];
    }

    const outputData = FfiClient.instance.copyBuffer(res.outputPtr, res.size!);
    return [
      new AudioFrame(
        new Int16Array(outputData.buffer),
        this.#outputRate,
        this.#channels,
        Math.trunc(outputData.length / this.#channels / 2),
      ),
    ];
  }

  /**
   * Flush any remaining audio data through the resampler and retrieve the resampled data.
   *
   * @remarks
   * This method should be called when no more input data will be provided to ensure that all
   * internal buffers are processed and all resampled data is output.
   */
  flush(): AudioFrame[] {
    const req = new FlushSoxResamplerRequest({
      resamplerHandle: this.#ffiHandle.handle,
    });

    const res = FfiClient.instance.request<FlushSoxResamplerResponse>({
      message: {
        case: 'flushSoxResampler',
        value: req,
      },
    });

    if (res.error) {
      throw new Error(res.error);
    }

    if (!res.outputPtr) {
      return [];
    }

    const outputData = FfiClient.instance.copyBuffer(res.outputPtr, res.size!);
    return [
      new AudioFrame(
        new Int16Array(outputData.buffer),
        this.#outputRate,
        this.#channels,
        Math.trunc(outputData.length / this.#channels / 2),
      ),
    ];
  }
}
