// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from 'vitest';
import { RingQueue, splitUtf8 } from './utils.js';

describe('splitUtf8', () => {
  it('splits a string into chunks of the given size', () => {
    expect(splitUtf8('hello world', 5)).toEqual([
      new TextEncoder().encode('hello'),
      new TextEncoder().encode(' worl'),
      new TextEncoder().encode('d'),
    ]);
  });

  it('splits a string with special characters into chunks of the given size', () => {
    expect(splitUtf8('héllo wörld', 5)).toEqual([
      new TextEncoder().encode('héll'),
      new TextEncoder().encode('o wö'),
      new TextEncoder().encode('rld'),
    ]);
  });

  it('splits a string with multi-byte utf8 characters correctly', () => {
    expect(splitUtf8('こんにちは世界', 5)).toEqual([
      new TextEncoder().encode('こ'),
      new TextEncoder().encode('ん'),
      new TextEncoder().encode('に'),
      new TextEncoder().encode('ち'),
      new TextEncoder().encode('は'),
      new TextEncoder().encode('世'),
      new TextEncoder().encode('界'),
    ]);
  });

  it('handles a string with a single multi-byte utf8 character', () => {
    expect(splitUtf8('😊', 5)).toEqual([new TextEncoder().encode('😊')]);
  });

  it('handles a string with mixed single and multi-byte utf8 characters', () => {
    expect(splitUtf8('a😊b', 4)).toEqual([
      new TextEncoder().encode('a'),
      new TextEncoder().encode('😊'),
      new TextEncoder().encode('b'),
    ]);
  });

  it('handles an empty string', () => {
    expect(splitUtf8('', 5)).toEqual([]);
  });
});

describe('RingQueue', () => {
  it('should push and get items', async () => {
    const queue = new RingQueue<number>(3);
    queue.push(1);
    queue.push(2);
    expect(await queue.get()).toBe(1);
    expect(await queue.get()).toBe(2);
  });

  it('should push and get items with a capacity', async () => {
    const queue = new RingQueue<number>(3);
    queue.push(1);
    queue.push(2);
    queue.push(3);
    queue.push(4);
    expect(await queue.get()).toBe(1);
    expect(await queue.get()).toBe(2);
    expect(await queue.get()).toBe(3);
  });

  it('should push and get items with a capacity of 0', async () => {
    const queue = new RingQueue<number>(0);
    queue.push(1);
    queue.push(2);
    queue.push(3);
  });
});
