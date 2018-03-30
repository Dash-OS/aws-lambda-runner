/* @flow */
/*
  Clones the `config` object so that the user mutating it will not cause issues.
*/
import type { RunnerConfig, RunnerRuntimeConfig, RunnerUserConfig } from '../types/runner';
import type RunnerPlugin from '../plugin';

const getDefaultConfig = (
  topconfig: $Shape<RunnerConfig<*>>,
  config: $Shape<RunnerUserConfig<*>>,
): RunnerConfig<*> => ({
  plugins: config.plugins || [],
  errors: topconfig.errors || [],

  settings: {
    isBase64Encoded: config.settings?.isBase64Encoded === true,
    errorCode: config.settings?.errorCode || 400,
    successCode: config.settings?.successCode || 200,
    // Log Level Desired ( true || [ ...levels ] )
    log: ['debug', true].includes(config.settings?.log) ? config.settings.log : false,
    // await event loop before finishing lambda?
    awaitEventLoop:
      typeof config.settings?.awaitEventLoop === 'boolean' ? config.settings.awaitEventLoop : true,
  },

  request: {
    isProxy: topconfig.request?.isProxy === true,
    path: topconfig.request?.path,
    method: topconfig.request?.method,
    resource: topconfig.request?.resource,
    headers: topconfig.request?.headers || {},
    // received queries ?foo=bar&baz=qux
    queries: topconfig.request?.queries || {},
    // received parameters /{param1}/{param2}
    params: topconfig.request?.params || {},
    // received stage variables
    stage: topconfig.request?.stage || {},
  },

  response: {
    isBase64Encoded: config.settings?.isBase64Encoded === true,
    // Default Response Handling (Proxy Only)
    statusCode: config.settings?.successCode || 200,
    // Default code if errors are detected (Proxy Only)
    headers: config.response?.headers
      ? {
        ...config.response.headers,
      }
      : {},
  },
});

const getRuntimeConfig = (
  config: RunnerConfig<*>,
  plugins: RunnerPlugin<*>[],
): RunnerRuntimeConfig<*> =>
  Object.freeze({
    plugins,
    errors: config.errors || [],

    settings: {
      isBase64Encoded: config.settings?.isBase64Encoded === true,
      errorCode: config.settings?.errorCode || 400,
      successCode: config.settings?.successCode || 200,
      // Log Level Desired ( true || [ ...levels ] )
      log: ['debug', true].includes(config.settings?.log) ? config.settings.log : false,
      // await event loop before finishing lambda?
      awaitEventLoop:
        typeof config.settings?.awaitEventLoop === 'boolean'
          ? config.settings.awaitEventLoop
          : true,
    },

    request: {
      isProxy: config.request?.isProxy === true,
      path: config.request?.path,
      method: config.request?.method,
      resource: config.request?.resource,
      headers: config.request?.headers || {},
      // received queries ?foo=bar&baz=qux
      queries: config.request?.queries || {},
      // received parameters /{param1}/{param2}
      params: config.request?.params || {},
      // received stage variables
      stage: config.request?.stage || {},
    },

    response: {
      isBase64Encoded: config.settings?.isBase64Encoded === true,
      // Default Response Handling (Proxy Only)
      statusCode: config.settings?.successCode || 200,
      // Default code if errors are detected (Proxy Only)
      headers: config.response?.headers
        ? {
          ...config.response.headers,
        }
        : {},
    },
  });

export { getDefaultConfig, getRuntimeConfig };
