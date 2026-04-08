// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

export type DataTrackFrame = {
  payload: Uint8Array;
  userTimestamp?: bigint;
};

export type DataTrackInfo = {
  sid: string;
  name: string;
  usesE2ee: boolean;
};

export type DataTrackOptions = {
  name: string;
};

export type DataTrackSubscribeOptions = {
  bufferSize?: number;
};

export class PublishDataTrackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PublishDataTrackError';
  }
}

export class DataTrackPushFrameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataTrackPushFrameError';
  }
}
