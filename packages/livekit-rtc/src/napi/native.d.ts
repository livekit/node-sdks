// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
export function livekitCopyBuffer(ptr: bigint, len: number): Uint8Array;
export function livekitFfiRequest(data: Uint8Array): Uint8Array;
export function livekitInitialize(callback: (data: Uint8Array) => void, captureLogs: boolean): void;
export function livekitRetrievePtr(handle: Uint8Array): bigint;
export class FfiHandle {
  constructor(handle: bigint);
  dispose(): void;
  get handle(): bigint;
}
