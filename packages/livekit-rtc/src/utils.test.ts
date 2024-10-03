import { describe, expect, it } from 'vitest';
import { Mutex } from './utils';

describe('Mutex', () => {
  it('should not be locked initially', () => {
    const mutex = new Mutex();
    expect(mutex.isLocked()).toBe(false);
  });

  it('should lock and unlock correctly', async () => {
    const mutex = new Mutex();
    const unlock = await mutex.lock();
    expect(mutex.isLocked()).toBe(true);
    unlock();
    expect(mutex.isLocked()).toBe(false);
  });

  it('should handle multiple locks', async () => {
    const mutex = new Mutex(2);
    const unlock1 = await mutex.lock();
    const unlock2 = await mutex.lock();
    expect(mutex.isLocked()).toBe(true);
    unlock1();
    expect(mutex.isLocked()).toBe(false);
    const unlock3 = await mutex.lock();
    expect(mutex.isLocked()).toBe(true);
    unlock2();
    expect(mutex.isLocked()).toBe(false);
    unlock3();
    expect(mutex.isLocked()).toBe(false);
  });

  it('should throw an error when unlocking the same lock twice', async () => {
    const mutex = new Mutex(2);
    const unlock1 = await mutex.lock();
    const unlock2 = await mutex.lock();
    expect(mutex.isLocked()).toBe(true);
    unlock1();
    expect(mutex.isLocked()).toBe(false);
    expect(() => unlock1()).toThrow('This unlock method has already been called');
    unlock2();
    expect(mutex.isLocked()).toBe(false);
  });
});
