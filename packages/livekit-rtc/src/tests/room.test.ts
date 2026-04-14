// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { DataStream_Chunk, DataStream_Header } from '@livekit/rtc-ffi-bindings';
import { describe, expect, it } from 'vitest';
import { Room } from '../room.js';

function createMockStreamController() {
  let controller!: ReadableStreamDefaultController<DataStream_Chunk>;
  const stream = new ReadableStream<DataStream_Chunk>({
    start(c) {
      controller = c;
    },
  });

  // Keep a reader so the stream stays alive
  const reader = stream.getReader();

  return {
    header: new DataStream_Header(),
    controller,
    startTime: Date.now(),
    reader,
  };
}

describe('Room', () => {
  describe('cleanupStreamControllers', () => {
    it('should clear byteStreamControllers on disconnect cleanup', () => {
      const room = new Room();
      const roomAny = room as any;

      const mock = createMockStreamController();
      roomAny.byteStreamControllers.set('stream-1', {
        header: mock.header,
        controller: mock.controller,
        startTime: mock.startTime,
      });

      expect(roomAny.byteStreamControllers.size).toBe(1);

      roomAny.cleanupStreamControllers();

      expect(roomAny.byteStreamControllers.size).toBe(0);
    });

    it('should clear textStreamControllers on disconnect cleanup', () => {
      const room = new Room();
      const roomAny = room as any;

      const mock = createMockStreamController();
      roomAny.textStreamControllers.set('stream-1', {
        header: mock.header,
        controller: mock.controller,
        startTime: mock.startTime,
      });

      expect(roomAny.textStreamControllers.size).toBe(1);

      roomAny.cleanupStreamControllers();

      expect(roomAny.textStreamControllers.size).toBe(0);
    });

    it('should error open stream controllers so consumers are not left hanging', async () => {
      const room = new Room();
      const roomAny = room as any;

      const mock = createMockStreamController();
      roomAny.byteStreamControllers.set('stream-1', {
        header: mock.header,
        controller: mock.controller,
        startTime: mock.startTime,
      });

      roomAny.cleanupStreamControllers();

      await expect(mock.reader.read()).rejects.toThrow('Room disconnected');
    });

    it('should handle cleanup when controllers are already closed', () => {
      const room = new Room();
      const roomAny = room as any;

      const mock = createMockStreamController();
      // Close the controller before cleanup
      mock.controller.close();

      roomAny.byteStreamControllers.set('stream-1', {
        header: mock.header,
        controller: mock.controller,
        startTime: mock.startTime,
      });

      // Should not throw
      roomAny.cleanupStreamControllers();

      expect(roomAny.byteStreamControllers.size).toBe(0);
    });

    it('should clean up multiple streams from both maps', () => {
      const room = new Room();
      const roomAny = room as any;

      const byteMock1 = createMockStreamController();
      const byteMock2 = createMockStreamController();
      const textMock1 = createMockStreamController();

      roomAny.byteStreamControllers.set('byte-1', {
        header: byteMock1.header,
        controller: byteMock1.controller,
        startTime: byteMock1.startTime,
      });
      roomAny.byteStreamControllers.set('byte-2', {
        header: byteMock2.header,
        controller: byteMock2.controller,
        startTime: byteMock2.startTime,
      });
      roomAny.textStreamControllers.set('text-1', {
        header: textMock1.header,
        controller: textMock1.controller,
        startTime: textMock1.startTime,
      });

      expect(roomAny.byteStreamControllers.size).toBe(2);
      expect(roomAny.textStreamControllers.size).toBe(1);

      roomAny.cleanupStreamControllers();

      expect(roomAny.byteStreamControllers.size).toBe(0);
      expect(roomAny.textStreamControllers.size).toBe(0);
    });
  });
});
