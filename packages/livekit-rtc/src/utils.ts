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

export function splitUtf8(s: string, n: number): string[] {
  // adapted from https://stackoverflow.com/a/6043797
  const result: string[] = [];
  while (s.length > n) {
    let k = n;
    // Move back to find the start of a UTF-8 character
    while ((s.charCodeAt(k) & 0xc0) === 0x80) {
      k--;
    }
    result.push(s.slice(0, k));
    s = s.slice(k);
  }
  result.push(s);
  return result;
}
