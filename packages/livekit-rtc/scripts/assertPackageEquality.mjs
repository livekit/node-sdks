import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as esm from '../dist/index.js';

const require = createRequire(import.meta.url);
const cjs = require('../dist/index.cjs');

assert.equal(esm.Room, cjs.Room);
assert.equal(esm.AudioFrame, cjs.AudioFrame);
