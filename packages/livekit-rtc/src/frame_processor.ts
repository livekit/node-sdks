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

export function isFrameProcessor<
  T extends FrameProcessor<AudioFrame> | FrameProcessor<VideoFrame> | unknown,
>(
  maybeProcessor: unknown,
): maybeProcessor is T extends FrameProcessor<AudioFrame>
  ? FrameProcessor<AudioFrame>
  : T extends FrameProcessor<VideoFrame>
    ? FrameProcessor<VideoFrame>
    : FrameProcessor<AudioFrame> | FrameProcessor<VideoFrame> {
  return (
    maybeProcessor !== null &&
    typeof maybeProcessor === 'object' &&
    'symbol' in maybeProcessor &&
    maybeProcessor.symbol === FrameProcessorSymbol
  );
}

export abstract class FrameProcessor<Frame extends VideoFrame | AudioFrame> {
  readonly symbol = FrameProcessorSymbol;

  abstract isEnabled(): boolean;
  abstract setEnabled(enabled: boolean): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStreamInfoUpdated(_info: FrameProcessorStreamInfo): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCredentialsUpdated(_credentials: FrameProcessorCredentials): void {}

  abstract process(frame: Frame): Frame;
  abstract close(): void;
}
