// SPDX-FileCopyrightText: 2025 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from 'vitest';
import { AsyncQueue } from './async_queue.js';

describe('AsyncQueue', () => {
  it('allows basic put and get operations', async () => {
    const queue = new AsyncQueue<number>();

    await queue.put(1);
    await queue.put(2);
    await queue.put(3);

    expect(queue.get()).toBe(1);
    expect(queue.get()).toBe(2);
    expect(queue.get()).toBe(3);
    expect(queue.get()).toBe(undefined);
  });

  it('respects capacity limits', async () => {
    const queue = new AsyncQueue<number>(2);

    // Fill the queue to capacity
    await queue.put(1);
    await queue.put(2);

    // Try to put a third item - this should block
    let putCompleted = false;
    const putPromise = queue.put(3).then(() => {
      putCompleted = true;
    });

    // Wait a bit to ensure put() is blocked
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(putCompleted).toBe(false);

    // Get an item to make space
    expect(queue.get()).toBe(1);

    // Now the put should complete
    await putPromise;
    expect(putCompleted).toBe(true);

    expect(queue.get()).toBe(2);
    expect(queue.get()).toBe(3);
  });

  it('blocks consumers when queue is empty', async () => {
    const queue = new AsyncQueue<number>();

    // Start waiting for an item
    let itemAvailable = false;
    const waitPromise = queue.waitForItem().then(() => {
      itemAvailable = true;
    });

    // Wait a bit to ensure waitForItem() is blocked
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(itemAvailable).toBe(false);

    // Put an item
    await queue.put(42);

    // Now waitForItem should resolve
    await waitPromise;
    expect(itemAvailable).toBe(true);

    expect(queue.get()).toBe(42);
  });

  it('returns immediately from waitForItem if items exist', async () => {
    const queue = new AsyncQueue<number>();

    await queue.put(1);
    await queue.put(2);

    // Should return immediately since items are available
    await queue.waitForItem();
    expect(queue.get()).toBe(1);
  });

  it('handles close correctly', async () => {
    const queue = new AsyncQueue<number>();

    // Add some items
    await queue.put(1);
    await queue.put(2);

    // Close the queue
    queue.close();

    // Should be able to get existing items
    expect(queue.get()).toBe(1);
    expect(queue.get()).toBe(2);

    // Trying to put should throw
    await expect(queue.put(3)).rejects.toThrow('Queue closed');

    // waitForItem should return immediately when closed
    await queue.waitForItem();
    expect(queue.closed).toBe(true);
  });

  it('wakes up waiting producers when closed', async () => {
    const queue = new AsyncQueue<number>(1);

    // Fill the queue
    await queue.put(1);

    // Try to put another item (will block)
    let putRejected = false;
    const putPromise = queue.put(2).catch(() => {
      putRejected = true;
    });

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Close the queue
    queue.close();

    // The blocked put should reject
    await putPromise;
    expect(putRejected).toBe(true);
  });

  it('wakes up waiting consumers when closed', async () => {
    const queue = new AsyncQueue<number>();

    // Start waiting for an item
    const waitPromise = queue.waitForItem();

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Close the queue
    queue.close();

    // waitForItem should resolve
    await waitPromise;
    expect(queue.closed).toBe(true);
  });

  it('handles multiple waiting producers', async () => {
    const queue = new AsyncQueue<number>(1);

    // Fill the queue
    await queue.put(1);

    // Start multiple producers waiting
    const put2 = queue.put(2);
    const put3 = queue.put(3);

    // Get items to allow producers to proceed
    expect(queue.get()).toBe(1);
    await put2;
    expect(queue.get()).toBe(2);
    await put3;
    expect(queue.get()).toBe(3);
  });

  it('handles multiple waiting consumers', async () => {
    const queue = new AsyncQueue<number>();

    // Start multiple consumers waiting
    const wait1 = queue.waitForItem();
    const wait2 = queue.waitForItem();

    // Put items
    await queue.put(1);
    await queue.put(2);

    // Both waits should resolve
    await Promise.all([wait1, wait2]);

    expect(queue.length).toBe(2);
  });

  it('reports length correctly', async () => {
    const queue = new AsyncQueue<number>();

    expect(queue.length).toBe(0);

    await queue.put(1);
    expect(queue.length).toBe(1);

    await queue.put(2);
    expect(queue.length).toBe(2);

    queue.get();
    expect(queue.length).toBe(1);

    queue.get();
    expect(queue.length).toBe(0);
  });

  it('handles unbounded queue (infinite capacity)', async () => {
    const queue = new AsyncQueue<number>(); // No capacity specified

    // Should be able to add many items without blocking
    for (let i = 0; i < 1000; i++) {
      await queue.put(i);
    }

    expect(queue.length).toBe(1000);

    // Get them all back
    for (let i = 0; i < 1000; i++) {
      expect(queue.get()).toBe(i);
    }

    expect(queue.length).toBe(0);
  });

  it('handles concurrent put and get operations', async () => {
    const queue = new AsyncQueue<number>(5);

    const consumed: number[] = [];

    // Start concurrent producers
    const producers = Array.from({ length: 10 }, (_, i) =>
      (async () => {
        await queue.put(i);
      })(),
    );

    // Start concurrent consumers - each consumer tries to get items until queue is empty
    const consumers = Array.from({ length: 10 }, () =>
      (async () => {
        while (true) {
          await queue.waitForItem();
          const item = queue.get();
          if (item !== undefined) {
            consumed.push(item);
            break; // Each consumer gets one item
          }
          // If item is undefined, another consumer got it first, try again
        }
      })(),
    );

    // Wait for all to complete
    await Promise.all([...producers, ...consumers]);

    // Should have consumed all items
    expect(consumed.length).toBe(10);
    expect(consumed.sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
