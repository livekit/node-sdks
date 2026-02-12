// SPDX-FileCopyrightText: 2025 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { type AudioFrame } from './audio_frame.js';
import { type VideoFrame } from './video_frame.js';

export type FrameProcessorStreamInfo = {
  roomName: string;
  participantIdentity: string;
  publicationSid: string;
};

export type FrameProcessorCredentials = {
  token: string;
  url: string;
};

export const FrameProcessorSymbol = Symbol.for('lk.frame-processor');

export type FrameProcessorType = 'audio' | 'video';

export function isFrameProcessor<Type extends 'audio' | 'video'>(
  maybeProcessor: unknown,
  type?: Type,
): maybeProcessor is FrameProcessor<
  Type extends 'audio' ? AudioFrame : Type extends 'video' ? VideoFrame : AudioFrame | VideoFrame
> {
  return (
    maybeProcessor !== null &&
    typeof maybeProcessor === 'object' &&
    'symbol' in maybeProcessor &&
    maybeProcessor.symbol === FrameProcessorSymbol &&
    (!type || ('type' in maybeProcessor && maybeProcessor.type === type))
  );
}

export function isAudioFrameProcessor(
  maybeProcessor: unknown,
): maybeProcessor is FrameProcessor<AudioFrame> {
  return isFrameProcessor(maybeProcessor, 'audio');
}

export function isVideoFrameProcessor(
  maybeProcessor: unknown,
): maybeProcessor is FrameProcessor<VideoFrame> {
  return isFrameProcessor(maybeProcessor, 'video');
}

export abstract class FrameProcessor<Frame extends VideoFrame | AudioFrame> {
  readonly symbol = FrameProcessorSymbol;
  abstract readonly type: FrameProcessorType;
  abstract isEnabled(): boolean;
  abstract setEnabled(enabled: boolean): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStreamInfoUpdated(_info: FrameProcessorStreamInfo): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCredentialsUpdated(_credentials: FrameProcessorCredentials): void {}

  abstract process(frame: Frame): Frame;
  abstract close(): void;
}
