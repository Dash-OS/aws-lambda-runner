/* @flow */
import type { RunnerRuntimeConfig } from '../types/runner';

type LogTypes = 'log' | 'error' | 'warn' | 'info';

function log(
  message: mixed[] | mixed,
  category?: string = 'LOG',
  type?: LogTypes = 'log',
  ...extra: any[]
) {
  console[type](
    `
---------------------------------
${category} ${message != null ? '\n---------------------------------\n' : ''}`,
    message,
    `${extra.length ? '\n' : ''}`,
    ...extra,
    `
---------------------------------\n`,
  );
}

export function handleLogError(config: RunnerRuntimeConfig<*>, errors: Error[]) {
  if (!config.settings.log) {
    return;
  }
  errors.forEach(err => log(err.message, 'ERROR', 'error', err));
}

export function handleLogDebug(
  config: RunnerRuntimeConfig<*>,
  message: mixed[] | mixed,
  category?: string = 'LOG',
  type: LogTypes = 'log',
) {
  if (config.settings.log) {
    log(message, category, type);
  }
}
