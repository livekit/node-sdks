// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
// Loads both published entry points of this package in a single process -- `dist/index.js`
// through `import` and `dist/index.cjs` through `createRequire` -- and checks that `instanceof`
// works across the two copies. This is the dual package hazard that unbranded classes hit; run
// `pnpm build` first.
//
//   node scripts/verify-dual-package-instanceof.mjs
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import * as esm from '../dist/index.js';

const require = createRequire(import.meta.url);
const cjs = require('../dist/index.cjs');

let failures = 0;

const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}: ${actual} (expected ${expected})`);
};

console.log(`esm entry: ${fileURLToPath(new URL('../dist/index.js', import.meta.url))}`);
console.log(`cjs entry: ${require.resolve('../dist/index.cjs')}`);
console.log('');

// Sanity check: the two entry points really are two distinct copies of the same classes.
check('esm.AudioFrame !== cjs.AudioFrame', esm.AudioFrame !== cjs.AudioFrame, true);
check('esm.VideoFrame !== cjs.VideoFrame', esm.VideoFrame !== cjs.VideoFrame, true);
check('esm.RpcError !== cjs.RpcError', esm.RpcError !== cjs.RpcError, true);
console.log('');

const esmAudioFrame = esm.AudioFrame.create(48000, 1, 480);
const cjsAudioFrame = cjs.AudioFrame.create(48000, 1, 480);
check(
  'cjs-built AudioFrame instanceof esm.AudioFrame',
  cjsAudioFrame instanceof esm.AudioFrame,
  true,
);
check(
  'esm-built AudioFrame instanceof cjs.AudioFrame',
  esmAudioFrame instanceof cjs.AudioFrame,
  true,
);

const esmVideoFrame = new esm.VideoFrame(
  new Uint8Array(16 * 16 * 4),
  16,
  16,
  esm.VideoBufferType.RGBA,
);
const cjsVideoFrame = new cjs.VideoFrame(
  new Uint8Array(16 * 16 * 4),
  16,
  16,
  cjs.VideoBufferType.RGBA,
);
check(
  'cjs-built VideoFrame instanceof esm.VideoFrame',
  cjsVideoFrame instanceof esm.VideoFrame,
  true,
);
check(
  'esm-built VideoFrame instanceof cjs.VideoFrame',
  esmVideoFrame instanceof cjs.VideoFrame,
  true,
);

const esmRpcError = new esm.RpcError(1500, 'boom');
const cjsRpcError = new cjs.RpcError(1500, 'boom');
check('cjs-built RpcError instanceof esm.RpcError', cjsRpcError instanceof esm.RpcError, true);
check('esm-built RpcError instanceof cjs.RpcError', esmRpcError instanceof cjs.RpcError, true);

const esmConnectError = new esm.ConnectError('boom');
const cjsConnectError = new cjs.ConnectError('boom');
check(
  'cjs-built ConnectError instanceof esm.ConnectError',
  cjsConnectError instanceof esm.ConnectError,
  true,
);
check(
  'esm-built ConnectError instanceof cjs.ConnectError',
  esmConnectError instanceof cjs.ConnectError,
  true,
);
console.log('');

// Branding must not make unrelated values match.
check('{} instanceof esm.AudioFrame', {} instanceof esm.AudioFrame, false);
check('null instanceof esm.AudioFrame', null instanceof esm.AudioFrame, false);
check('undefined instanceof esm.AudioFrame', undefined instanceof esm.AudioFrame, false);
check(
  'unbranded lookalike instanceof esm.AudioFrame',
  { data: new Int16Array(480), sampleRate: 48000, channels: 1, samplesPerChannel: 480 } instanceof
    esm.AudioFrame,
  false,
);
check(
  'esm-built VideoFrame instanceof esm.AudioFrame',
  esmVideoFrame instanceof esm.AudioFrame,
  false,
);
check(
  'esm-built AudioFrame instanceof esm.VideoFrame',
  esmAudioFrame instanceof esm.VideoFrame,
  false,
);
console.log('');

// Handle-backed classes are deliberately left alone: they are live resources, not values.
check('esm.Room !== cjs.Room', esm.Room !== cjs.Room, true);
check(
  'cjs Room.prototype instanceof-safe brand absent',
  Object.getOwnPropertySymbols(cjs.Room.prototype).some((s) =>
    s.description?.startsWith('lk.rtc-node.'),
  ),
  false,
);
console.log('');

console.log(failures === 0 ? 'PASS: all checks passed' : `FAIL: ${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
