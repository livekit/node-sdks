// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from 'vitest';

// Guard: the "Bun" CI job runs vitest via `bun --bun run test` so test bodies
// execute on the bun runtime (with vitest still providing module mocking). The
// `--bun` flag is load-bearing — without it, bun honors vitest's
// `#!/usr/bin/env node` shebang and silently runs everything under node, making
// the bun job a meaningless duplicate of the node job.
//
// When EXPECT_BUN_RUNTIME=1 (set only by the bun CI step), assert that this test
// body is actually executing under bun. It runs through the exact same vitest
// path as the real suite, so it catches a regression where the runtime falls
// back to node. In every other run (the node CI job, local dev) the var is
// unset and this is skipped.
describe('bun runtime guard', () => {
  const enforced = process.env.EXPECT_BUN_RUNTIME === '1';

  it.skipIf(!enforced)('test bodies execute on the bun runtime', () => {
    expect(
      process.versions.bun,
      'EXPECT_BUN_RUNTIME=1 but tests are not running under bun — `bun --bun run test` ' +
        'fell back to node (check the --bun flag / invocation).',
    ).toBeTruthy();
  });
});
