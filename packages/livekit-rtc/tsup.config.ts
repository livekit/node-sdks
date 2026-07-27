import { defineConfig } from 'tsup';

import defaults from '../../tsup.config';

export default defineConfig({
  ...defaults,
  // Emit a single CJS implementation only with a thin ESM wrapper
  // to avoid dual-package hazard
  format: ['cjs'],
  external: [/\.\/.*\.cjs/, /\.\/.*.node/],
});
