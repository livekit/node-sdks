// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// End-to-end tests for data streams (text/byte streams over the FFI-backed
// rust implementation). Ported from rust-sdks `livekit/tests/data_stream_test.rs`
// where the node API surface allows; see comments on individual tests for
// intentional deviations.
import { afterAll, expect, it as itRaw } from 'vitest';
import { dispose } from '../index.js';
import {
  concatUint8,
  connectTestRooms,
  describeE2E,
  testTimeoutMs,
  withTimeout,
} from './e2e_common.js';

// use concurrent testing if available on the runner (currently not supported by bun's api)
const it = typeof itRaw.concurrent === 'function' ? itRaw.concurrent : itRaw;

/** Pseudo-random lowercase text.
 *
 * Counterpart of rust's `pseudo_random_text`: random lowercase carries
 * ~4.7 bits of entropy per 8-bit byte, so deflate compresses it well under
 * its raw size — exercising the chunked-compressed wire path. */
function pseudoRandomText(length: number): string {
  const chars = new Array<string>(length);
  for (let i = 0; i < length; i++) {
    chars[i] = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }
  return chars.join('');
}

/** Pseudo-random bytes.
 *
 * Uniform random bytes are genuinely incompressible: deflate cannot shrink
 * them, so the send path must fall back to an uncompressed wire format. */
function pseudoRandomBytes(length: number): Uint8Array {
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    out[i] = Math.floor(Math.random() * 256);
  }
  return out;
}

describeE2E('livekit-rtc data streams e2e', () => {
  afterAll(async () => {
    await dispose();
  });

  // Port of rust `test_send_text`. The `is_compressed` / `is_inline` info
  // assertions are not portable: the FFI stream-info protos don't expose them.
  it(
    'sends and receives a small text stream',
    async () => {
      const { rooms } = await connectTestRooms(2);
      const [receivingRoom, sendingRoom] = rooms;
      const senderIdentity = sendingRoom!.localParticipant!.identity;

      const topic = 'some-topic';
      const textToSend = 'some-text';

      const receivedText = withTimeout(
        new Promise<string>((resolve) => {
          receivingRoom!.registerTextStreamHandler(topic, async (reader, sender) => {
            expect(sender.identity).toBe(senderIdentity);
            resolve(await reader.readAll());
          });
        }),
        testTimeoutMs,
        'Timed out waiting for text stream',
      );

      const textInfo = await sendingRoom!.localParticipant!.sendText(textToSend, { topic });
      expect(textInfo.streamId).toBeTruthy();
      expect(Math.abs(textInfo.timestamp - Date.now())).toBeLessThanOrEqual(1_000);
      expect(textInfo.totalSize).toBe(textToSend.length);
      expect(textInfo.mimeType).toBe('text/plain');
      expect(textInfo.topic).toBe(topic);

      expect(await receivedText).toBe(textToSend);

      await Promise.all(rooms.map((r) => r.disconnect()));
    },
    testTimeoutMs,
  );

  // Port of rust `test_send_bytes`. Node has no `sendBytes` (in-memory one-shot)
  // wrapper yet, so this uses the incremental `streamBytes` writer — which by
  // design is never inlined or compressed on the wire.
  it(
    'sends and receives a small byte stream',
    async () => {
      const { rooms } = await connectTestRooms(2);
      const [receivingRoom, sendingRoom] = rooms;
      const senderIdentity = sendingRoom!.localParticipant!.identity;

      const topic = 'some-topic';
      const bytesToSend = new Uint8Array(16).fill(0xfa);

      const receivedBytes = withTimeout(
        new Promise<Uint8Array>((resolve) => {
          receivingRoom!.registerByteStreamHandler(topic, async (reader, sender) => {
            expect(sender.identity).toBe(senderIdentity);
            const chunks = await reader.readAll();
            resolve(concatUint8(chunks));
          });
        }),
        testTimeoutMs,
        'Timed out waiting for byte stream',
      );

      const writer = await sendingRoom!.localParticipant!.streamBytes({
        topic,
        totalSize: bytesToSend.byteLength,
      });
      await writer.write(bytesToSend);
      await writer.close();

      const byteInfo = writer.info;
      expect(byteInfo.streamId).toBeTruthy();
      expect(Math.abs(byteInfo.timestamp - Date.now())).toBeLessThanOrEqual(1_000);
      expect(byteInfo.mimeType).toBe('application/octet-stream');
      expect(byteInfo.topic).toBe(topic);

      expect(await receivedBytes).toEqual(bytesToSend);

      await Promise.all(rooms.map((r) => r.disconnect()));
    },
    testTimeoutMs,
  );

  // Port of rust `test_send_large_compressible_text`: ~50 KB of deterministic
  // pseudo-random lowercase is too big to inline and compresses well under its
  // raw size, so the sender emits chunked deflate-raw and the receiver
  // decompresses — validating the v2 compression path on the real wire.
  it(
    'round-trips a large compressible text (chunked + compressed wire path)',
    async () => {
      const { rooms } = await connectTestRooms(2);
      const [receivingRoom, sendingRoom] = rooms;

      const topic = 'large-compressible-text';
      const text = pseudoRandomText(50_000);

      const receivedText = withTimeout(
        new Promise<string>((resolve) => {
          receivingRoom!.registerTextStreamHandler(topic, async (reader) => {
            resolve(await reader.readAll());
          });
        }),
        testTimeoutMs,
        'Timed out waiting for large text stream',
      );

      const info = await sendingRoom!.localParticipant!.sendText(text, { topic });
      expect(info.totalSize).toBe(text.length);

      expect(await receivedText).toBe(text);

      await Promise.all(rooms.map((r) => r.disconnect()));
    },
    testTimeoutMs,
  );

  // Port of rust `test_send_large_incompressible_random_bytes`, adapted to the
  // incremental `streamBytes` writer (no `sendBytes` wrapper in node yet):
  // uniform random bytes exercise the chunked, uncompressed wire path with a
  // payload spanning many chunks.
  it(
    'round-trips large incompressible random bytes',
    async () => {
      const { rooms } = await connectTestRooms(2);
      const [receivingRoom, sendingRoom] = rooms;

      const topic = 'large-random-bytes';
      const payload = pseudoRandomBytes(1_800_000);

      const receivedBytes = withTimeout(
        new Promise<Uint8Array>((resolve) => {
          receivingRoom!.registerByteStreamHandler(topic, async (reader) => {
            resolve(concatUint8(await reader.readAll()));
          });
        }),
        testTimeoutMs * 2,
        'Timed out waiting for large byte stream',
      );

      const writer = await sendingRoom!.localParticipant!.streamBytes({
        topic,
        totalSize: payload.byteLength,
      });
      const writeChunkSize = 64 * 1024;
      for (let offset = 0; offset < payload.byteLength; offset += writeChunkSize) {
        await writer.write(payload.subarray(offset, offset + writeChunkSize));
      }
      await writer.close();

      const received = await receivedBytes;
      expect(received.byteLength).toBe(payload.byteLength);
      expect(received).toEqual(payload);

      await Promise.all(rooms.map((r) => r.disconnect()));
    },
    testTimeoutMs * 3,
  );

  // Port of rust `test_send_large_bytes`: a 50 KB patterned (compressible)
  // payload via the byte-stream path.
  it(
    'round-trips large patterned bytes',
    async () => {
      const { rooms } = await connectTestRooms(2);
      const [receivingRoom, sendingRoom] = rooms;

      const topic = 'large-patterned-bytes';
      const payload = new Uint8Array(50_000);
      for (let i = 0; i < payload.length; i++) payload[i] = i % 251;

      const receivedBytes = withTimeout(
        new Promise<Uint8Array>((resolve) => {
          receivingRoom!.registerByteStreamHandler(topic, async (reader) => {
            resolve(concatUint8(await reader.readAll()));
          });
        }),
        testTimeoutMs,
        'Timed out waiting for patterned byte stream',
      );

      const writer = await sendingRoom!.localParticipant!.streamBytes({
        topic,
        totalSize: payload.byteLength,
      });
      await writer.write(payload);
      await writer.close();

      expect(await receivedBytes).toEqual(payload);

      await Promise.all(rooms.map((r) => r.disconnect()));
    },
    testTimeoutMs,
  );

  // Incremental writer path for text (multi-write, unicode content): ensures
  // UTF-8-aware chunking on the sender doesn't split multi-byte characters.
  it(
    'round-trips an incremental text stream with multi-byte characters',
    async () => {
      const { rooms } = await connectTestRooms(2);
      const [receivingRoom, sendingRoom] = rooms;

      const topic = 'incremental-unicode-text';
      const pieces = ['héllo wörld — ', '日本語のテキスト、', '🌍🚀 emoji tail'];
      const expected = pieces.join('');

      const receivedText = withTimeout(
        new Promise<string>((resolve) => {
          receivingRoom!.registerTextStreamHandler(topic, async (reader) => {
            resolve(await reader.readAll());
          });
        }),
        testTimeoutMs,
        'Timed out waiting for incremental text stream',
      );

      const writer = await sendingRoom!.localParticipant!.streamText({ topic });
      for (const piece of pieces) {
        await writer.write(piece);
      }
      await writer.close();

      expect(await receivedText).toBe(expected);

      await Promise.all(rooms.map((r) => r.disconnect()));
    },
    testTimeoutMs,
  );

  // Moved from e2e.test.ts (kept alongside the other data-stream coverage).
  it(
    'cleans up stream controllers when disconnecting during an active stream',
    async () => {
      const { rooms } = await connectTestRooms(2);
      const [receivingRoom, sendingRoom] = rooms;
      const topic = 'cleanup-stream-topic';

      // Register a handler on the receiving side that will intentionally
      // NOT fully consume the stream — simulating an abandoned transfer.
      let readerReceived = false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      receivingRoom!.registerTextStreamHandler(topic, async (_reader, _sender) => {
        readerReceived = true;
        // Deliberately do not call reader.readAll() so the stream stays open
      });

      // Start sending a text stream but don't close it
      const writer = await sendingRoom!.localParticipant!.streamText({ topic });
      await writer.write('partial data');

      // Wait for the receiving side to get the stream header
      const deadline = Date.now() + 5000;
      while (!readerReceived && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 50));
      }
      expect(readerReceived).toBe(true);

      // Disconnect the receiving room while the stream is still open.
      // This should close the stream controller without throwing.
      await receivingRoom!.disconnect();

      // Also close the writer and disconnect the sender
      await writer.close();
      await sendingRoom!.disconnect();

      // If we got here without hanging or throwing, the stream controller
      // was properly cleaned up on disconnect.
    },
    testTimeoutMs,
  );
});
