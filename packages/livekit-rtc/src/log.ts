// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { LevelWithSilent, LoggerOptions } from 'pino';
import { pino } from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const defaultOptions: LoggerOptions = { name: 'lk-rtc' };

const devOptions: LoggerOptions = {
  ...defaultOptions,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
};

const log = pino(isProduction ? defaultOptions : devOptions);
log.level = isProduction ? 'info' : 'debug';

export type LogLevel = LevelWithSilent;
export { log };
