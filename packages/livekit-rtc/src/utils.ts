// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import EventEmitter, { once } from "events";

/** @internal */
export class Queue<T> {
  #items: T[] = [];
  #limit?: number;
  #events = new EventEmitter();

  constructor(limit?: number) {
    this.#limit = limit;
  }

  async get(): Promise<T> {
    if (this.#items.length === 0) {
      await once(this.#events, 'put');
    }
    const item = this.#items.shift()!;
    this.#events.emit('get');
    return item;
  }

  async put(item: T) {
    if (this.#limit && this.#items.length >= this.#limit) {
      await once(this.#events, 'get');
    }
    this.#items.push(item);
    this.#events.emit('put');
  }
}
