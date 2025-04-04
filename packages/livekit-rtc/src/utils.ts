// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

/** convert bigints to numbers preserving undefined values */
export function bigIntToNumber<T extends bigint | undefined>(
  value: T,
): T extends bigint ? number : undefined {
  return (value !== undefined ? Number(value) : undefined) as T extends bigint ? number : undefined;
}

/** convert numbers to bigints preserving undefined values */
export function numberToBigInt<T extends number | undefined>(
  value: T,
): T extends number ? bigint : undefined {
  return (value !== undefined ? BigInt(value) : undefined) as T extends number ? bigint : undefined;
}

export function splitUtf8(s: string, n: number): Uint8Array[] {
  if (n < 4) {
    throw new Error('n must be at least 4 due to utf8 encoding rules');
  }
  // adapted from https://stackoverflow.com/a/6043797
  const result: Uint8Array[] = [];
  let encoded = new TextEncoder().encode(s);
  while (encoded.length > n) {
    let k = n;
    while (k > 0) {
      const byte = encoded[k];
      if (byte !== undefined && (byte & 0xc0) !== 0x80) {
        break;
      }
      k--;
    }
    result.push(encoded.slice(0, k));
    encoded = encoded.slice(k);
  }
  if (encoded.length > 0) {
    result.push(encoded);
  }
  return result;
}

/**
 * A ring queue that stores a fixed number of items. If capacity is
 * set to 0, the buffer will grow indefinitely.
 *
 * WARNING: THIS IS NOT THREAD SAFE.
 */
export class RingQueue<T> {
  private buffer: T[] = [];
  // If the buffer is empty, this will be a promise that resolves when
  // a new item is pushed, bypassing the internal queue.
  private resolve: ((value: T) => void) | null = null;

  constructor(private readonly capacity: number = 0) {
    this.resolve = null;
    this.capacity = capacity;
  }

  /**
   * Push an item into the buffer. If the buffer is full, the newest will
   * be removed.
   */
  push(item: T) {
    if (this.resolve) {
      this.resolve(item);
      this.resolve = null;
    } else {
      if (this.capacity > 0 && this.buffer.length > this.capacity) {
        this.buffer.pop();
      }
      this.buffer.push(item);
    }
  }

  /**
   * Get an item from the buffer. If the buffer is empty, this will return a promise
   * that resolves when a new item is pushed.
   */
  async get(): Promise<T> {
    if (this.buffer.length === 0) {
      return new Promise((resolve) => {
        this.resolve = resolve;
      });
    }
    return this.buffer.shift()!;
  }
}
