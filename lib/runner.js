/* @flow */
import qs from 'qs';

import type {
  LambdaCallbackFunction,
  LambdaContextObject,
  LambdaEventObject,
  LambdaData,
} from './types/lambda';

import type {
  RunnerFunction,
  RunnerTopConfig,
  RunnerUserConfig,
  RunnerRuntimeConfig,
} from './types/runner';

import RunnerPlugin from './plugin';

import parseArgs from './utils/parseArgs';
import parseProxy from './utils/parseProxy';

import { getRuntimeConfig } from './utils/getConfig';

import { handleError, handleSuccess, handleDebugStartup } from './utils/handlers';

import { tryParseJSON } from './utils/utils';

const pluginHooks = Object.freeze({
  onExecute: new Set(),
  onComplete: new Set(),
  onError: new Set(),
});

type LambdaRunnerResponse = (
  event: LambdaEventObject,
  context: LambdaContextObject,
  callback: LambdaCallbackFunction
) => any;

async function runFunctionInstance(
  runner: RunnerFunction,
  config: RunnerRuntimeConfig,
  event: LambdaEventObject,
  context: LambdaContextObject,
  callback: LambdaCallbackFunction
) {
  let data: LambdaData;

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

  await Promise.all(
    [...pluginHooks.onExecute]
      /* Map Each Promise */
      .map(plugin => plugin.onExecute(data, config, context, callback))
  );

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
  ...args: [RunnerUserConfig, RunnerFunction]
): LambdaRunnerResponse {
  const top: RunnerTopConfig = {
    config: {
      plugins: [],
      errors: [],
    },
  };

  let runner: void | RunnerFunction;
  let plugins: RunnerPlugin<any>[];

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

  if (!top.config.errors.length) {
    /*
      If there were not any errors while parsing the arguments we will
      instatiate the plugins.
    */
    plugins = top.config.plugins.length
      ? top.config.plugins.reduce((arr, PluginSchema) => {
          let p: RunnerPlugin<any>;
          if (Array.isArray(PluginSchema)) {
            const [Plugin, pluginSettings] = PluginSchema;
            p = new Plugin(pluginSettings);
          } else {
            p = new PluginSchema();
          }
          Object.keys(pluginHooks).forEach(hook => {
            if (typeof p[hook] === 'function') {
              pluginHooks[hook].add(p);
            }
          });
          if (p) {
            arr.push(p);
          }
          return arr;
        }, [])
      : [];
  }

  return function runAWSLambdaRunnerStartupEvaluation(
    event: LambdaEventObject,
    context: LambdaContextObject,
    callback: LambdaCallbackFunction
  ) {
    let data: LambdaData;
    let result: any;

    /*
      This is the entry point of each execution of the lambda and will utilize the shared state
      included within the closure provided above to execute your function.
    */
    const config = getRuntimeConfig(top.config, plugins);

    if (config.errors.length || typeof runner !== 'function') {
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
          result = _result;
          return result;
        })
        .catch((err: Error) => {
          config.errors.push(err);
        })
        .finally(async () => {
          if (config.errors.length && pluginHooks.onError.size) {
            await Promise.all(
              [...pluginHooks.onError].map(plugin =>
                plugin.onError(data, config, context, callback)
              )
            );
          }
          if (pluginHooks.onComplete.size) {
            await Promise.all(
              [...pluginHooks.onComplete].map(plugin =>
                plugin.onComplete(result, data, config, context, callback)
              )
            );
          }
          if (config.errors.length) {
            handleError(callback, config);
          } else {
            handleSuccess(callback, config, result);
          }
        });
    }
    config.errors.push(new Error('Invalid Arguments, cannot start Runner Function'));
    return handleError(callback, config);
  };
}

export { default as Plugin } from './plugin';
