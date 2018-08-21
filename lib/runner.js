/* @flow */
import qs from 'qs';

import type {
  Lambda$RunnerResponse,
  Lambda$CallbackFunction,
  Lambda$ContextObject,
  Lambda$EventObject,
  Lambda$Data,
} from './types/lambda';

import type {
  Runner$Function,
  Runner$TopConfig,
  Runner$UserConfig,
  Runner$RuntimeConfig,
} from './types/runner';

import { handleError, handleSuccess, handleDebugStartup } from './utils/handlers';
import { buildParallelPluginHooks } from './utils/context';

import { getRuntimeConfig } from './utils/getConfig';
import { tryParseJSON } from './utils/utils';

import handleExecuteHooks from './utils/hooks';

import parsePlugins from './utils/parsePlugins';
import parseProxy from './utils/parseProxy';
import parseArgs from './utils/parseArgs';

const pluginHooks = buildParallelPluginHooks();

async function runFunctionInstance(
  runner: Runner$Function,
  config: Runner$RuntimeConfig,
  event: Lambda$EventObject,
  context: Lambda$ContextObject,
  callback: Lambda$CallbackFunction
) {
  let data: Lambda$Data;

  /**
   * AWS allows you to modify if we should await the end of Node's Event Loop before
   * stopping the function execution.  This can cause problems with some 3rd parties
   * and services such as Firebase.
   */
  if (context.callbackWaitsForEmptyEventLoop != null) {
    if (config.settings.awaitEventLoop === false) {
      context.callbackWaitsForEmptyEventLoop = false;
    } else {
      context.callbackWaitsForEmptyEventLoop = true;
    }
  }
  /*
    We attempt to auto-detect if the lambda is being executed within a proxy.  If it is,
    we normalize the received data and parse the proxy to normalize the event object.
  */
  if (typeof event === 'object' && (event.requestContext && event.headers)) {
    // We will mutate the config object
    parseProxy(event, config);
    switch (config.request.headers && config.request.headers['content-type']) {
      case 'application/x-www-form-urlencoded': {
        data = event.body && qs.parse(event.body);
        break;
      }
      case 'application/json':
      default: {
        data = event.body && tryParseJSON(event.body);
        break;
      }
    }
  } else {
    data = event;
  }

  if (config.settings.log) {
    handleDebugStartup(config, context);
  }

  if (pluginHooks.onExecute.size > 0) {
    await handleExecuteHooks(pluginHooks.onExecute, data, config, context, callback);
  }

  if (config.errors.length > 0) {
    // Return an Error to the caller letting them know what happend
    return handleError(callback, config);
  }

  // resolve as promise regardless of return style
  return Promise.resolve(runner(data, config, context, callback)).then(result => ({
    result,
    data,
  }));
}

/**
 * This part of the function will be run during initialization of the function and will
 * not be run with subsequent executions of our function.  We will use this portion to
 * handle any initial setup required and to optimize the general execution.
 * @param {*} args
 */
export default function awsLambdaRunner(
  ...args: [Runner$UserConfig, Runner$Function]
): Lambda$RunnerResponse {
  const top: Runner$TopConfig = {
    config: {
      errors: [],
    },
  };

  let runner: void | Runner$Function;

  try {
    /*
      We start by parsing the arguments that we receive from the user.  
      These will define how they want to configure the function. We expect 
      one of two sets of arguments currently:

      1. [RunnerFunction] - Currently Deprecated
      2. [RunnerConfig, RunnerFunction]
    */
    runner = parseArgs(top, args);
  } catch (e) {
    top.config.errors.push(e);
  }

  if (!top.config.errors.length && top.config.plugins) {
    /*
      If there were not any errors while parsing the arguments we will
      instatiate the plugins.
    */
    parsePlugins(top.config.plugins, pluginHooks);
  }

  return function runAWSLambdaRunnerStartupEvaluation(
    event: Lambda$EventObject,
    context: Lambda$ContextObject,
    callback: Lambda$CallbackFunction
  ) {
    let data: Lambda$Data;

    /*
      This is the entry point of each execution of the lambda and will utilize the shared state
      included within the closure provided above to execute your function.
    */
    const config = getRuntimeConfig(top.config);

    if (config.errors.length > 0 || typeof runner !== 'function') {
      if (typeof runner !== 'function') {
        config.errors.push(new Error('Invalid Lambda Runner Arguments (runner is not a function)'));
      }
      return handleError(callback, config);
    }

    if (typeof runner === 'function') {
      return runFunctionInstance(runner, config, event, context, callback)
        .then(({ result: _result, data: _data } = {}) => {
          /* Function Completed Running */
          data = _data;
          config.response.body = _result;
          return config.response.body;
        })
        .catch((err: Error) => {
          config.errors.push(err);
        })
        .finally(async () => {
          if (config.errors.length > 0 && pluginHooks.onError.size > 0) {
            await handleExecuteHooks(pluginHooks.onError, data, config, context, callback);
          }
          if (pluginHooks.onComplete.size > 0) {
            await handleExecuteHooks(pluginHooks.onComplete, data, config, context, callback);
          }
          if (config.errors.length > 0) {
            await handleError(callback, config);
          } else {
            await handleSuccess(callback, config);
          }
        });
    }
    config.errors.push(new Error('Invalid Arguments, cannot start Runner Function'));
    return handleError(callback, config);
  };
}
