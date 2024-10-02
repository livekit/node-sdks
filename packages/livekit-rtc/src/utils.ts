// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
export class Mutex {
  #locking: Promise<void>;
  #locks: number;
  #limit: number;

  constructor(limit = 1) {
    this.#locking = Promise.resolve();
    this.#locks = 0;
    this.#limit = limit;
  }

  isLocked(): boolean {
    return this.#locks >= this.#limit;
  }

  async lock(): Promise<() => void> {
    this.#locks += 1;

    let unlockNext: () => void;

    const willLock = new Promise<void>(
      (resolve) =>
        (unlockNext = () => {
          this.#locks -= 1;
          resolve();
        }),
    );

    const willUnlock = this.#locking.then(() => unlockNext);
    this.#locking = this.#locking.then(() => willLock);
    return willUnlock;
  }
}
