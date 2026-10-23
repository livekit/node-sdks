// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { VideoBufferType } from '@livekit/rtc-ffi-bindings';
import { describe, expect, it } from 'vitest';
import { VideoFrame } from './video_frame.js';

describe('VideoFrame', () => {
  it('copies only the I420A planes of a converted frame', () => {
    // an 8x4 I420A frame is 32 bytes of Y, 8 bytes each of U and V, and 32 bytes of A
    const width = 8;
    const height = 4;
    const ySize = width * height;
    const chromaSize = 4 * 2;
    const data = new Uint8Array(ySize * 2 + chromaSize * 2);
    data.fill(16, 0, ySize);
    data.fill(128, ySize, ySize + chromaSize * 2);
    data.fill(255, ySize + chromaSize * 2);
    const frame = new VideoFrame(data, width, height, VideoBufferType.I420A);

    const converted = frame.convert(VideoBufferType.I420A);

    expect(converted.data.byteLength).toBe(data.byteLength);
    expect(converted.data).toEqual(data);
  });
});
