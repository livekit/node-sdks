import { describe, expect, it } from 'vitest';
import { splitUtf8 } from './utils.js';

describe('splitUtf8', () => {
  it('splits a string into chunks of the given size', () => {
    expect(splitUtf8('hello world', 5)).toEqual([
      new TextEncoder().encode('hello'),
      new TextEncoder().encode(' worl'),
      new TextEncoder().encode('d'),
    ]);
  });

  it('splits a string with utf8 characters into chunks of the given size', () => {
    expect(splitUtf8('héllo wörld', 5)).toEqual([
      new TextEncoder().encode('héll'),
      new TextEncoder().encode('o wö'),
      new TextEncoder().encode('rld'),
    ]);
  });

  it('splits a string with multi-byte utf8 characters correctly', () => {
    expect(splitUtf8('こんにちは世界', 5)).toEqual([
      new TextEncoder().encode('こん'),
      new TextEncoder().encode('にち'),
      new TextEncoder().encode('は世'),
      new TextEncoder().encode('界'),
    ]);
  });

  it('handles a string with a single multi-byte utf8 character', () => {
    expect(splitUtf8('😊', 5)).toEqual([new TextEncoder().encode('😊')]);
  });

  it('handles a string with mixed single and multi-byte utf8 characters', () => {
    expect(splitUtf8('a😊b', 2)).toEqual([
      new TextEncoder().encode('a'),
      new TextEncoder().encode('😊'),
      new TextEncoder().encode('b'),
    ]);
  });

  it('handles an empty string', () => {
    expect(splitUtf8('', 5)).toEqual([]);
  });
});
