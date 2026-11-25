// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { VideoBufferType } from '@livekit/rtc-ffi-bindings';
import { describe, expect, it } from 'vitest';
import { getPlaneLength } from './video_frame.js';

describe('getPlaneLength', () => {
  it.each([
    // 8x4: luma 32, each chroma plane 4x2 = 8
    [VideoBufferType.I420, 8, 4, 32 + 8 * 2],
    [VideoBufferType.I420A, 8, 4, 32 * 2 + 8 * 2],
    [VideoBufferType.NV12, 8, 4, 32 + 8 * 2],
    // 4x8: luma 32, each chroma plane 2x4 = 8
    [VideoBufferType.I420, 4, 8, 32 + 8 * 2],
    [VideoBufferType.I420A, 4, 8, 32 * 2 + 8 * 2],
    [VideoBufferType.NV12, 4, 8, 32 + 8 * 2],
    // odd dimensions round the chroma planes up: 5x3 -> 3x2
    [VideoBufferType.I420A, 5, 3, 15 * 2 + 6 * 2],
    [VideoBufferType.NV12, 5, 3, 15 + 6 * 2],
  ])('sizes buffer type %i at %ix%i as %i bytes', (type, width, height, expected) => {
    expect(getPlaneLength(type, width, height)).toBe(expected);
  });

  it('sizes a 1280x720 NV12 frame from its chroma height', () => {
    expect(getPlaneLength(VideoBufferType.NV12, 1280, 720)).toBe(1_382_400);
  });
});
