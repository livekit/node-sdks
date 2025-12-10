import { AudioFrame } from "./audio_frame.js";
import { VideoFrame } from "./video_frame.js";

export type FrameProcessorStreamInfo = {
  roomName: string;
  participantIdentity: string;
  publicationSid: string;
};

export type FrameProcessorCredentials = {
  participantToken: string;
  serverUrl: string;
};

export abstract class FrameProcessor<Frame extends VideoFrame | AudioFrame> {
  abstract isEnabled(): boolean;
  abstract setEnabled(enabled: boolean): void;

  abstract updateStreamInfo(info: FrameProcessorStreamInfo): void;
  abstract updateCredentials(credentials: FrameProcessorCredentials): void;

  abstract process(frame: Frame): Frame;
  abstract close(): void;
};
