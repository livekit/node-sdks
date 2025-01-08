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
