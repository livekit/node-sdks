// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { VideoBufferType } from '@livekit/rtc-ffi-bindings';
import { describe, expect, it } from 'vitest';
import { VideoFrame } from './video_frame.js';

describe('VideoFrame', () => {
  it('passes only its own view of the data to native code', () => {
    // a 4x4 I420 frame is 16 bytes of Y plus 4 bytes each of U and V
    const size = 24;
    const backing = new Uint8Array(size * 2);
    for (let i = 0; i < size; i++) backing[size + i] = i + 1;

    // the frame starts halfway into its backing ArrayBuffer
    const frame = new VideoFrame(backing.subarray(size), 4, 4, VideoBufferType.I420);

    expect(frame.getPlane(0)).toEqual(backing.subarray(size, size + 16));
    expect(frame.getPlane(1)).toEqual(backing.subarray(size + 16, size + 20));
    expect(frame.getPlane(2)).toEqual(backing.subarray(size + 20, size + 24));
  });
});
