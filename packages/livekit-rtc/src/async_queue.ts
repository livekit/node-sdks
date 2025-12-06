// SPDX-FileCopyrightText: 2025 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { Deque } from '@datastructures-js/deque';

/**
 * AsyncQueue is a bounded queue with async support for both producers and consumers.
 *
 * This queue simplifies the AudioMixer implementation by handling backpressure and
 * synchronization automatically:
 * - Producers can await put() until the queue has space (when queue is full)
 * - Consumers can await waitForItem() until data is available (when queue is empty)
 *
 * This eliminates the need for manual coordination logic, polling loops, and
 * complex state management throughout the rest of the codebase.
 */
export class AsyncQueue<T> {
  private items: T[] = [];
  private waitingProducers = new Deque<{ resolve: () => void; reject: (err: Error) => void }>();
  private waitingConsumers = new Deque<() => void>();
  closed = false;

  constructor(private capacity: number = Infinity) {}

  async put(item: T) {
    if (this.closed) throw new Error('Queue closed');

    while (this.items.length >= this.capacity) {
      await new Promise<void>((resolve, reject) =>
        this.waitingProducers.pushBack({ resolve, reject }),
      );
      // Re-check if closed after waking up
      if (this.closed) throw new Error('Queue closed');
    }

    this.items.push(item);

    // Wake up one waiting consumer
    if (this.waitingConsumers.size() > 0) {
      const resolve = this.waitingConsumers.popFront()!;
      resolve();
    }
  }

  get(): T | undefined {
    const item = this.items.shift();
    if (this.waitingProducers.size() > 0) {
      const producer = this.waitingProducers.popFront()!;
      producer.resolve(); // wakes up one waiting producer
    }
    return item;
  }

  /**
   * Wait until an item is available or the queue is closed.
   * Returns immediately if items are already available.
   */
  async waitForItem(): Promise<void> {
    if (this.items.length > 0 || this.closed) {
      return;
    }
    await new Promise<void>((resolve) => this.waitingConsumers.pushBack(resolve));
  }

  close() {
    this.closed = true;
    // Reject all waiting producers with an error
    this.waitingProducers
      .toArray()
      .forEach((producer) => producer.reject(new Error('Queue closed')));
    // Resolve all waiting consumers so they can see the queue is closed
    this.waitingConsumers.toArray().forEach((resolve) => resolve());
    this.waitingProducers.clear();
    this.waitingConsumers.clear();
  }

  get length() {
    return this.items.length;
  }
}
