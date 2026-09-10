// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { VideoBufferType } from '@livekit/rtc-ffi-bindings';
import { describe, expect, it } from 'vitest';
import { AudioFrame } from './audio_frame.js';
import { AudioResampler } from './audio_resampler.js';
import { AudioSource } from './audio_source.js';
import { AudioStream } from './audio_stream.js';
import { brandDataClass } from './brand.js';
import { LocalParticipant, RemoteParticipant } from './participant.js';
import { ConnectError, Room } from './room.js';
import { RpcError } from './rpc.js';
import { Track } from './track.js';
import { VideoFrame } from './video_frame.js';

type AnyClass = new (...args: never[]) => object;

const AUDIO_FRAME_BRAND = 'lk.rtc-node.AudioFrame';
const VIDEO_FRAME_BRAND = 'lk.rtc-node.VideoFrame';

/**
 * Stands in for a class loaded from a second copy of this package: a distinct class object with a
 * distinct prototype, carrying the same brand from the global symbol registry.
 */
const secondCopyOf = (brand: string): AnyClass => {
  class Foreign {}
  brandDataClass(Foreign, Symbol.for(brand));
  return Foreign;
};

const cases: Array<{ name: string; brand: string; Class: AnyClass; create: () => object }> = [
  {
    name: 'AudioFrame',
    brand: AUDIO_FRAME_BRAND,
    Class: AudioFrame,
    create: () => AudioFrame.create(48000, 1, 480),
  },
  {
    name: 'VideoFrame',
    brand: VIDEO_FRAME_BRAND,
    Class: VideoFrame,
    create: () => new VideoFrame(new Uint8Array(4), 1, 1, VideoBufferType.RGBA),
  },
  {
    name: 'RpcError',
    brand: 'lk.rtc-node.RpcError',
    Class: RpcError,
    create: () => new RpcError(1500, 'boom'),
  },
  {
    name: 'ConnectError',
    brand: 'lk.rtc-node.ConnectError',
    Class: ConnectError,
    create: () => new ConnectError('boom'),
  },
];

describe.each(cases)('$name cross-copy instanceof', ({ brand, Class, create }) => {
  it('matches a genuine local instance', () => {
    expect(create()).toBeInstanceOf(Class);
  });

  it('matches an instance built by a second copy of the package', () => {
    const Foreign = secondCopyOf(brand);

    expect(Foreign).not.toBe(Class);
    expect(new Foreign()).toBeInstanceOf(Class);
  });

  it('does not match values that carry no brand', () => {
    expect({}).not.toBeInstanceOf(Class);
    expect(null).not.toBeInstanceOf(Class);
    expect(undefined).not.toBeInstanceOf(Class);
    expect('a string').not.toBeInstanceOf(Class);
    expect(42).not.toBeInstanceOf(Class);
    expect(Object.create(null)).not.toBeInstanceOf(Class);
    expect(create).not.toBeInstanceOf(Class);
  });

  it('does not match a same-shaped but unbranded lookalike', () => {
    expect({ ...create() }).not.toBeInstanceOf(Class);
  });

  it('does not match an instance branded as a different class', () => {
    const Other = secondCopyOf(brand === AUDIO_FRAME_BRAND ? VIDEO_FRAME_BRAND : AUDIO_FRAME_BRAND);

    expect(new Other()).not.toBeInstanceOf(Class);
  });

  it('leaves subclasses on prototype identity', () => {
    class Subclass extends Class {}

    // A subclass instance inherits the brand, so it is still an instance of the branded parent.
    expect(new Subclass()).toBeInstanceOf(Class);
    // The reverse must not hold, for local or foreign instances of the parent.
    expect(create()).not.toBeInstanceOf(Subclass);
    expect(new (secondCopyOf(brand))()).not.toBeInstanceOf(Subclass);
  });
});

describe('brandDataClass', () => {
  it('resolves the same symbol from every copy of the module', () => {
    expect(Symbol.for(AUDIO_FRAME_BRAND)).toBe(Symbol.for(AUDIO_FRAME_BRAND));
  });

  it('brands the prototype, not each instance', () => {
    const frame = AudioFrame.create(48000, 1, 480);

    expect(Object.getOwnPropertySymbols(AudioFrame.prototype)).toContain(
      Symbol.for(AUDIO_FRAME_BRAND),
    );
    expect(Object.getOwnPropertySymbols(frame)).toEqual([]);
  });

  it('keeps the brand out of enumerable properties', () => {
    const frame = AudioFrame.create(48000, 1, 480);

    expect(Object.keys(frame)).toEqual([
      'data',
      'sampleRate',
      'channels',
      'samplesPerChannel',
      '_userdata',
    ]);
    expect(Object.getOwnPropertySymbols({ ...frame })).toEqual([]);
  });

  it('does not disturb the fields of a branded class', () => {
    const frame = new AudioFrame(new Int16Array([1, 2]), 48000, 1, 2, { source: 'test' });

    expect(frame.data).toEqual(new Int16Array([1, 2]));
    expect(frame.sampleRate).toBe(48000);
    expect(frame.channels).toBe(1);
    expect(frame.samplesPerChannel).toBe(2);
    expect(frame.userdata).toEqual({ source: 'test' });
  });
});

describe('classes that wrap a live FFI resource', () => {
  // Two copies of these are genuinely not interchangeable -- they own handles, event wiring and
  // internal state that the other copy's methods do not know about -- so they must keep failing
  // `instanceof` across a copy boundary rather than failing more quietly somewhere downstream.
  it.each([
    ['Room', Room],
    ['AudioStream', AudioStream],
    ['AudioSource', AudioSource],
    ['AudioResampler', AudioResampler],
    ['LocalParticipant', LocalParticipant],
    ['RemoteParticipant', RemoteParticipant],
    ['Track', Track],
  ] as const)('leaves %s unbranded', (_name, ctor) => {
    expect(Object.getOwnPropertyDescriptor(ctor, Symbol.hasInstance)).toBeUndefined();
    expect(
      Object.getOwnPropertySymbols(ctor.prototype).filter((symbol) =>
        symbol.description?.startsWith('lk.rtc-node.'),
      ),
    ).toEqual([]);
  });
});
