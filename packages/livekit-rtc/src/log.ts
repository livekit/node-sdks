// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { LevelWithSilent, LoggerOptions } from 'pino';
import { pino } from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const defaultOptions: LoggerOptions = { name: 'lk-rtc' };

/**
 * temporarily disabling the transport option as there might be a memory leak in some corner cases related to it
 * see https://github.com/pinojs/pino/issues/2370
 */
// const devOptions: LoggerOptions = {
//   ...defaultOptions,
//   transport: {
//     target: 'pino-pretty',
//     options: {
//       colorize: true,
//     },
//   },
// };

const log = pino(defaultOptions);
log.level = isProduction ? 'info' : 'debug';

export type LogLevel = LevelWithSilent;
export { log };
