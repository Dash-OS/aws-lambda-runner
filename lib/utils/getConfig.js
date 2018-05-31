/* @flow */
/*
  Clones the `config` object so that the user mutating it will not cause issues.
*/
import type { RunnerConfig, RunnerRuntimeConfig, RunnerUserConfig } from '../types/runner';
import type RunnerPlugin from '../plugin';

const getDefaultConfig = (
  topconfig: $Shape<RunnerConfig>,
  config: $Shape<RunnerUserConfig>,
): RunnerConfig => ({
  plugins: config.plugins || [],
  errors: topconfig.errors || [],

  settings: {
    cors: (config.settings && config.settings.cors) === true,
    isBase64Encoded: (config.settings && config.settings.isBase64Encoded) === true,
    errorCode: (config.settings && config.settings.errorCode) || 400,
    successCode: (config.settings && config.settings.successCode) || 200,
    log: (config.settings && config.settings.log) || false,
    // await event loop before finishing lambda?
    awaitEventLoop:
      config.settings && typeof config.settings.awaitEventLoop === 'boolean'
        ? config.settings.awaitEventLoop
        : true,
  },

  request: {
    isProxy: (topconfig.request && topconfig.request.isProxy) === true,
    path: topconfig.request && topconfig.request.path,
    method: topconfig.request && topconfig.request.method,
    resource: topconfig.request && topconfig.request.resource,
    headers: (topconfig.request && topconfig.request.headers) || {},
    // received queries ?foo=bar&baz=qux
    queries: (topconfig.request && topconfig.request.queries) || {},
    // received parameters /{param1}/{param2}
    params: (topconfig.request && topconfig.request.params) || {},
    // received stage variables
    stage: (topconfig.request && topconfig.request.stage) || {},
  },

  response: {
    isBase64Encoded: (config.settings && config.settings.isBase64Encoded) === true,
    // Default Response Handling (Proxy Only)
    statusCode: (config.settings && config.settings.successCode) || 200,
    // Default code if errors are detected (Proxy Only)
    headers:
      config.response && config.response.headers
        ? {
          ...config.response.headers,
        }
        : {},
  },
});

const getRuntimeConfig = (
  config: RunnerConfig,
  plugins: RunnerPlugin<Object>[],
): RunnerRuntimeConfig =>
  Object.freeze({
    plugins,
    errors: config.errors || [],

    settings: {
      isBase64Encoded: (config.settings && config.settings.isBase64Encoded) === true,
      errorCode: (config.settings && config.settings.errorCode) || 400,
      successCode: (config.settings && config.settings.successCode) || 200,
      log: (config.settings && config.settings.log) || false,
      cors: (config.settings && config.settings.cors) === true,
      // await event loop before finishing lambda?
      awaitEventLoop:
        config.settings && typeof config.settings.awaitEventLoop === 'boolean'
          ? config.settings.awaitEventLoop
          : true,
    },

    request: {
      isProxy: (config.request && config.request.isProxy) === true,
      path: config.request && config.request.path,
      method: config.request && config.request.method,
      resource: config.request && config.request.resource,
      headers: (config.request && config.request.headers) || {},
      // received queries ?foo=bar&baz=qux
      queries: (config.request && config.request.queries) || {},
      // received parameters /{param1}/{param2}
      params: (config.request && config.request.params) || {},
      // received stage variables
      stage: (config.request && config.request.stage) || {},
    },

    response: {
      isBase64Encoded: (config.settings && config.settings.isBase64Encoded) === true,
      // Default Response Handling (Proxy Only)
      statusCode: (config.settings && config.settings.successCode) || 200,
      // Default code if errors are detected (Proxy Only)
      headers:
        config.response && config.response.headers
          ? {
            ...config.response.headers,
          }
          : {},
    },
  });

export { getDefaultConfig, getRuntimeConfig };
