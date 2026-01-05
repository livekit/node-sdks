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

export abstract class FrameProcessor<Frame extends VideoFrame | AudioFrame> {
  abstract isEnabled(): boolean;
  abstract setEnabled(enabled: boolean): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStreamInfoUpdated(_info: FrameProcessorStreamInfo): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCredentialsUpdated(_credentials: FrameProcessorCredentials): void {}

  abstract process(frame: Frame): Frame;
  abstract close(): void;
}
