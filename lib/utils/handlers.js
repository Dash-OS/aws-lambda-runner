/* @flow */
import type { RunnerRuntimeConfig } from '../types/runner';
import type { LambdaContextObject, LambdaCallbackFunction } from '../types/lambda';

import { tryStringifyJSON, noNil } from './utils';
import { handleLogDebug, handleLogError } from './log';

export function handleDebugStartup(config: RunnerRuntimeConfig, context: LambdaContextObject) {
  return handleLogDebug(
    config,

    config.request.isProxy
      ? tryStringifyJSON(
          {
            timeRemaining: context.getRemainingTimeInMillis(),
            settings: config.settings,
            request: config.request,
          },
          noNil,
          2
        )
      : tryStringifyJSON(
          {
            timeRemaining: context.getRemainingTimeInMillis(),
          },
          noNil,
          2
        ),
    'Starting Function Execution'
  );
}

export function handleSuccess(
  callback: LambdaCallbackFunction,
  config: RunnerRuntimeConfig,
  result: mixed
) {
  const isDebug = config.settings.log;
  const response = config.request.isProxy
    ? {
        ...config.response,
        body: tryStringifyJSON(result, ...(isDebug ? [noNil, 2] : [])),
      }
    : result;
  if (isDebug) {
    handleLogDebug(
      config,
      response,
      config.request.isProxy
        ? `${config.response.statusCode} | Returning Response to Caller`
        : 'Returning Response to Caller:'
    );
  }
  return callback(null, response);
}

export function handleError(callback: LambdaCallbackFunction, config: RunnerRuntimeConfig) {
  if (config.request.isProxy && config.response.statusCode === 200) {
    config.response.statusCode = config.settings.errorCode || 400;
  }
  if (config.settings.log) {
    // Verified that log exists so we only format the log if necessary
    handleLogError(config, config.errors);
  }
}
