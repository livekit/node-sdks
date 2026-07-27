// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

// Runs after `tsup` (which emits the single CJS build + `.d.cts` declarations).
//
// 1. Emit the ESM-facing `.d.ts` declarations via tsc (tsup only produces the
//    `.d.cts` files for the `require` condition).
// 2. Write the ESM entry point as a thin wrapper that re-exports the single CJS
//    build. esbuild emits a cjs-module-lexer-friendly `module.exports` marker,
//    so Node's ESM loader statically resolves every named export from
//    `index.cjs` and `export *` needs no per-export maintenance.
//
// Keeping a single physical implementation (index.cjs) means `import` and
// `require` share one module instance, avoiding the dual-package hazard.
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

execSync('tsc --declaration --emitDeclarationOnly', { stdio: 'inherit' });

writeFileSync(new URL('../dist/index.js', import.meta.url), "export * from './index.cjs';\n");
