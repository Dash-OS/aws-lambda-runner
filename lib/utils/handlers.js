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
          timeRemaining: context.getRemainingTimeInMillis?.(),
          settings: config.settings,
          request: config.request,
        },
        noNil,
        2,
      )
      : tryStringifyJSON(
        {
          timeRemaining: context.getRemainingTimeInMillis?.(),
        },
        noNil,
        2,
      ),
    'Starting Function Execution',
  );
}

export function handleSuccess(
  callback: LambdaCallbackFunction,
  config: RunnerRuntimeConfig,
  result: mixed,
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
        : 'Returning Response to Caller:',
    );
  }
  return callback(null, response);
}

export function handleError(callback: LambdaCallbackFunction, config: RunnerRuntimeConfig) {
  // const errorResponse = {
  //   result: 'error',
  //   errors: config.errors,
  // };
  if (config.request.isProxy && config.response.statusCode === 200) {
    config.response.statusCode = config.settings.errorCode || 400;
  }
  if (config.settings.log) {
    // Verified that log exists so we only format the log if necessary
    handleLogError(config, config.errors);
  }
  // if (typeof config.onError === 'function') {
  //   // Call the Error Handler - it should mutate the errorResponse argument
  //   // which we will report to the caller when completed.
  //   Promise.resolve(config.onError(errorResponse, config, { data, result }, exception, cb))
  //     .then(r => {
  //       if (r === false) {
  //         /* Do Not Handle the Response : handled by onError handler */
  //         return;
  //       }
  //       return handleSuccess(cb, data, config, errorResponse);
  //     })
  //     .catch(err => {
  //       // If an error occurs during the handler, add the error to the response
  //       // and report the final result.
  //       handleLogError(
  //         config,
  //         err.message,
  //         err,
  //         'An Error Occurred During the Provided Error Handler',
  //         'ERROR HANDLER',
  //       );
  //       config.errors.push(err.message);
  //       // just in case
  //       errorResponse.errors = config.errors;
  //       return handleSuccess(cb, data, config, errorResponse);
  //     });
  // } else {
  //   // Report the Errors
  //   return handleSuccess(cb, data, config, errorResponse);
  // }
}
