// SPDX-FileCopyrightText: 2025 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { AudioFrame } from './audio_frame.js';
import { VideoFrame } from './video_frame.js';

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

  abstract onStreamInfoUpdated(info: FrameProcessorStreamInfo): void;
  abstract onCredentialsUpdated(credentials: FrameProcessorCredentials): void;

  abstract process(frame: Frame): Frame;
  abstract close(): void;
}
