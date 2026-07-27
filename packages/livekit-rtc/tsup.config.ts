import { defineConfig } from 'tsup';

import defaults from '../../tsup.config';

export default defineConfig({
  ...defaults,
  // Emit a single CJS implementation only. A thin ESM wrapper
  // (dist/index.js, written by scripts/write-esm-wrapper.mjs) re-exports from
  // it so that `import` and `require` resolve to the same module instance.
  // This avoids the dual-package hazard (duplicate class constructors) that
  // bites consumers who depend on @livekit/rtc-node as a shared peer dependency.
  format: ['cjs'],
  external: [/\.\/.*\.cjs/, /\.\/.*.node/],
});
