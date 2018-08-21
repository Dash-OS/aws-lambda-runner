/* @flow */
import type { Runner$RuntimeConfig } from '../types/runner';
import type { Lambda$ContextObject, Lambda$CallbackFunction } from '../types/lambda';

import { tryStringifyJSON, noNil } from './utils';
import { handleLogDebug, handleLogError } from './log';

export function handleDebugStartup(config: Runner$RuntimeConfig, context: Lambda$ContextObject) {
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

export function handleSuccess(callback: Lambda$CallbackFunction, config: Runner$RuntimeConfig) {
  const isDebug = config.settings.log;
  const response = config.request.isProxy
    ? {
        ...config.response,
        body: tryStringifyJSON(config.response.body, ...(isDebug ? [noNil, 2] : [])),
      }
    : config.response.body;
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

class InvalidLambdaRunnerErrorResponse extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidLambdaRunnerErrorResponse';
  }
}

export function handleError(callback: Lambda$CallbackFunction, config: Runner$RuntimeConfig) {
  const isDebug = config.settings.log;
  if (config.settings.log) {
    // Verified that log exists so we only format the log if necessary
    handleLogError(config, config.errors);
  }
  const error = config.handlers.onError(config);
  if (config.request.isProxy) {
    if (config.response.statusCode === config.settings.successCode) {
      config.response.statusCode = config.settings.errorCode || 400;
    }
    callback(null, {
      ...config.response,
      body: tryStringifyJSON(error, ...(isDebug ? [noNil, 2] : [])),
    });
  } else if (
    typeof error === 'string' ||
    error instanceof Error ||
    (typeof error === 'object' &&
      typeof error.name === 'string' &&
      typeof error.message === 'string')
  ) {
    callback(error);
  } else {
    // TODO - Handle calling a callback to take in errors array and output the error to use
    callback(new InvalidLambdaRunnerErrorResponse(error));
  }
}
