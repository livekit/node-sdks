// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

/** A frame published on a data track, consisting of a payload and optional metadata. */
export type DataTrackFrame = {
  /** The frame's payload. */
  payload: Uint8Array;
  /** The frame's user timestamp, if one is associated. */
  userTimestamp?: bigint;
};

/** Information about a published data track. */
export type DataTrackInfo = {
  /**
   * Unique track identifier assigned by the SFU.
   *
   * This identifier may change if a reconnect occurs. Use {@link DataTrackInfo.name | name}
   * if a stable identifier is needed.
   */
  sid: string;
  /** Name of the track assigned by the publisher. */
  name: string;
  /** Whether or not frames sent on the track use end-to-end encryption. */
  usesE2ee: boolean;
};

/** Options for publishing a data track. */
export type DataTrackOptions = {
  name: string;
};

export type DataTrackSubscribeOptions = {
  /**
   * The number of {@link DataTrackFrame}s to hold in the ReadableStream before discarding
   * extra frames. When omitted, the default buffer size is used.
   */
  bufferSize?: number;
};

/** An error that can occur when publishing a data track. */
export class PublishDataTrackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PublishDataTrackError';
  }
}

/**
 * Frame could not be pushed to a data track.
 *
 * Pushing a frame can fail for several reasons:
 *
 * - The track has been unpublished by the local participant or SFU
 * - The room is no longer connected
 * - Frames are being pushed too fast
 */
export class DataTrackPushFrameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataTrackPushFrameError';
  }
}
