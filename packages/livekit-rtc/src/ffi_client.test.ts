// SPDX-FileCopyrightText: 2025 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { FfiEvent } from '@livekit/rtc-ffi-bindings';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FfiClient, FfiClientEvent } from './ffi_client.js';

// We test waitFor by calling it directly on a plain FfiClient instance
// (not the singleton) and manually emitting events.
describe('FfiClient.waitFor', () => {
  let client: FfiClient;

  beforeEach(() => {
    // Construct without triggering livekitInitialize by stubbing it
    vi.mock(
      '@livekit/rtc-ffi-bindings',
      async (importOriginal) => {
        const orig = await importOriginal<typeof import('@livekit/rtc-ffi-bindings')>();
        return {
          ...orig,
          livekitInitialize: vi.fn(),
        };
      },
    );
    client = new FfiClient();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    client.removeAllListeners();
  });

  it('resolves when the predicate matches', async () => {
    const event = new FfiEvent({
      message: { case: 'connect', value: { asyncId: 1n } },
    });

    const promise = client.waitFor<{ asyncId: bigint }>(
      (ev) => ev.message.case === 'connect',
      { timeout: 1000 },
    );

    client.emit(FfiClientEvent.FfiEvent, event);

    const result = await promise;
    expect(result).toHaveProperty('asyncId');
  });

  it('removes the listener after the predicate matches', async () => {
    const event = new FfiEvent({
      message: { case: 'connect', value: { asyncId: 1n } },
    });

    const promise = client.waitFor(
      (ev) => ev.message.case === 'connect',
      { timeout: 1000 },
    );

    client.emit(FfiClientEvent.FfiEvent, event);
    await promise;

    expect(client.listenerCount(FfiClientEvent.FfiEvent)).toBe(0);
  });

  it('rejects with a timeout error when the predicate never matches', async () => {
    const promise = client.waitFor(
      () => false,
      { timeout: 50 },
    );

    await expect(promise).rejects.toThrow('waitFor timed out');
  });

  it('removes the listener after timeout', async () => {
    const promise = client.waitFor(
      () => false,
      { timeout: 50 },
    );

    await promise.catch(() => {});

    expect(client.listenerCount(FfiClientEvent.FfiEvent)).toBe(0);
  });

  it('rejects when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort(new Error('cancelled'));

    const promise = client.waitFor(
      () => true,
      { signal: controller.signal },
    );

    await expect(promise).rejects.toThrow('cancelled');
    expect(client.listenerCount(FfiClientEvent.FfiEvent)).toBe(0);
  });

  it('rejects when the signal is aborted while waiting', async () => {
    const controller = new AbortController();

    const promise = client.waitFor(
      () => false,
      { timeout: 5000, signal: controller.signal },
    );

    controller.abort(new Error('disconnect'));

    await expect(promise).rejects.toThrow('disconnect');
    expect(client.listenerCount(FfiClientEvent.FfiEvent)).toBe(0);
  });
});
