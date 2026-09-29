// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { ChatMessage as ProtoChatMessage } from '@livekit/rtc-ffi-bindings';
import { describe, expect, it } from 'vitest';
import { chatMessageFromProto, splitUtf8 } from './utils.js';

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

describe('chatMessageFromProto', () => {
  it('leaves editTimestamp undefined for a message that was never edited', () => {
    const message = chatMessageFromProto(
      new ProtoChatMessage({ id: 'msg-1', message: 'hello', timestamp: 1700000000000n }),
    );

    expect(message).toEqual({
      id: 'msg-1',
      message: 'hello',
      timestamp: 1700000000000,
      editTimestamp: undefined,
      generated: undefined,
    });
  });

  it('converts editTimestamp and generated for an edited message', () => {
    const message = chatMessageFromProto(
      new ProtoChatMessage({
        id: 'msg-2',
        message: 'hello again',
        timestamp: 1700000000000n,
        editTimestamp: 1700000005000n,
        generated: true,
      }),
    );

    expect(message.editTimestamp).toBe(1700000005000);
    expect(message.generated).toBe(true);
  });
});
