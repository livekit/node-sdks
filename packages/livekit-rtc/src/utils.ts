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
    if (this.#locks >= this.#limit) {
      await this.#locking;
    }

    this.#locks += 1;

    let unlockNext: () => void;
    let unlocked = false;

    const willLock = new Promise<void>(
      (resolve) =>
        (unlockNext = () => {
          if (unlocked) {
            throw new Error('This unlock method has already been called');
          }
          unlocked = true;
          this.#locks -= 1;
          resolve();
        }),
    );

    const willUnlock = () => unlockNext();
    this.#locking = this.#locking.then(() => willLock);
    return willUnlock;
  }
}
