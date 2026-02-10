// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    maxConcurrency: 8,
  },
});
