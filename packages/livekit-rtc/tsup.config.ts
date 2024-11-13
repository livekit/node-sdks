import { defineConfig } from 'tsup';

import defaults from '../../tsup.config';

export default defineConfig({
  ...defaults,
  external: [/\.\/.*\.cjs/, /\.\/.*.node/],
});
