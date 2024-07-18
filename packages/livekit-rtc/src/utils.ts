// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

export function diffAttributes(
  oldValues: Record<string, string> | undefined,
  newValues: Record<string, string> | undefined,
) {
  if (oldValues === undefined) {
    oldValues = {};
  }
  if (newValues === undefined) {
    newValues = {};
  }
  const allKeys = [...Object.keys(newValues), ...Object.keys(oldValues)];
  const diff: Record<string, string> = {};

  for (const key of allKeys) {
    if (oldValues[key] !== newValues[key]) {
      diff[key] = newValues[key] ?? '';
    }
  }

  return diff;
}
