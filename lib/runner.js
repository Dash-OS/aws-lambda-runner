import Errors from './utils/errors';
import parseProxy from './utils/parseProxy';

import { isLogLevel, handleLogError, handleLogDebug } from './utils/log';
import { tryStringifyJSON, tryParseJSON, noNil } from './utils/utils';

const DEFAULT_CONFIG = {
  isProxy: false,
  // Log Level Desired ( true || [ ...levels ] )
  log: false,
  // Default Response Handling (Proxy Only)
  statusCode: 200,
  // respond with cors headers?
  cors: false,
  headers: null,
  // Default Error Handling
  errorCode: 400,
  // Function to execute onError
  onError: undefined,
  // await event loop before finishing lambda?
  awaitEventLoop: true,
  client: {},
  // received queries ?foo=bar&baz=qux
  queries: {},
  // received parameters /{param1}/{param2}
  params: {},
  // received stage variables
  stage: {},
  plugins: [],
  // what methods should we accept (if this is a proxy request)
  methods: null,
};

const buildCORSHeaders = config => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
  'Access-Control-Allow-Headers': Object.keys(config.headers || {}).reduce((p, c) => {
    p += `,${c}`;
    return p;
  }, 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'),
});

function handleResponse(cb, data, config, result) {
  if (isLogLevel(config, 'debug')) {
    handleLogDebug(
      config,
      config.isProxy === true
        ? `${config.statusCode} | Returning Response to Caller`
        : 'Returning Response to Caller:',
      config.isProxy === true
        ? JSON.stringify(
          {
            statusCode: config.statusCode || config.errorCode,
            body: result,
            headers: {
              ...(config.cors ? buildCORSHeaders(config) : undefined),
              ...config.headers,
            },
          },
            null,
            2,
          )
        : tryStringifyJSON(result, null, 2),
    );
  }
  if (config.isProxy === true) {
    return cb(null, {
      statusCode: config.statusCode || config.errorCode,
      body: tryStringifyJSON(result),
      headers: {
        ...(config.cors ? buildCORSHeaders(config) : undefined),
        ...config.headers,
      },
    });
  }
  return cb(null, result);
}

function handleError(cb, data, config, result, exception) {
  const errorResponse = {
    result: 'error',
    errors: config.errors,
  };
  if (config.isProxy === true && config.statusCode === 200) {
    config.statusCode = config.errorCode || 400;
  }
  if (config.log) {
    // Verified that log exists so we only format the log if necessary
    handleLogError(config, config.errors.join(', \n   '), exception);
  }
  if (typeof config.onError === 'function') {
    // Call the Error Handler - it should mutate the errorResponse argument
    // which we will report to the caller when completed.
    Promise.resolve(config.onError(errorResponse, config, { data, result }, exception, cb))
      .then(r => {
        if (r === false) {
          /* Do Not Handle the Response : handled by onError handler */
          return;
        }
        return handleResponse(cb, data, config, errorResponse);
      })
      .catch(err => {
        // If an error occurs during the handler, add the error to the response
        // and report the final result.
        handleLogError(
          config,
          err.message,
          err,
          'An Error Occurred During the Provided Error Handler',
          'ERROR HANDLER',
        );
        config.errors.push(err.message);
        // just in case
        errorResponse.errors = config.errors;
        return handleResponse(cb, data, config, errorResponse);
      });
  } else {
    // Report the Errors
    return handleResponse(cb, data, config, errorResponse);
  }
}

function parseArgs(config, errors, ...args) {
  let fn;
  switch (args.length) {
    case 1: {
      fn = args[0];
      Object.assign(config, DEFAULT_CONFIG);
      break;
    }
    case 2: {
      if (typeof args[0] !== 'object') {
        if (typeof args[1] === 'object') {
          errors.push(Errors.argumentsOrder(...args));
        } else {
          errors.push(Errors.invalidConfig(...args));
        }
      } else {
        Object.assign(config, DEFAULT_CONFIG, args[0]);
        fn = args[1];
      }
      break;
    }
    default: {
      errors.push(Errors.wrongArguments(...args));
      break;
    }
  }
  return fn;
}

export default function awsLambdaRunner(...args) {
  const callConfig = {};
  const startupErrors = [];
  const fn = parseArgs(callConfig, startupErrors, ...args);

  return function runAWSLambdaRunnerStartupEvaluation(e, ctx, cb) {
    let data;

    const config = Object.assign({}, callConfig, {
      errors: [].concat(startupErrors),
    });

    if (config.awaitEventLoop === false) {
      // We do not want to wait for the event loop to complete before freezing
      // this process
      ctx.callbackWaitsForEmptyEventLoop = false;
    } else if (config.awaitEventLoop === true) {
      ctx.callbackWaitsForEmptyEventLoop = true;
    }

    try {
      if (e && e.requestContext !== undefined && e.headers !== undefined) {
        // We will mutate the config object
        parseProxy(e, config, ctx);
        // Try to parse as json, return untouched if it fails
        data = tryParseJSON(e.body);
      } else {
        data = e;
      }

      if (isLogLevel(config, 'debug')) {
        handleLogDebug(
          config,
          'Starting Function Execution',
          config.isProxy === true
            ? JSON.stringify(
              {
                timeRemaining: ctx.getRemainingTimeInMillis(),
                path: config.path,
                method: config.method,
                queries: config.queries,
                params: config.params,
                stage: config.stage,
              },
                noNil,
                2,
              )
            : JSON.stringify(
              {
                timeRemaining: ctx.getRemainingTimeInMillis(),
              },
                noNil,
                2,
              ),
        );
      }

      // Each plugin will be called with the given values and is expected to
      // mutate the given objects
      const plugins = config.plugins.map(Plugin => {
        let val;
        let p;
        if (Array.isArray(Plugin)) {
          // This means we have settings to pass to the plugin
          const [Pclass, ...pluginSettings] = Plugin;
          p = new Pclass(...pluginSettings);
        } else {
          p = new Plugin();
        }
        if (typeof p.onBuild === 'function') {
          val = p.onBuild(data, config, ctx, cb);
        } else {
          val = p;
        }
        return Promise.resolve(val).then(() => p);
      });

      return Promise.all(plugins).then(nextPlugins => {
        if (config.errors.length > 0 || typeof fn !== 'function') {
          // Return an Error to the caller letting them know what happend
          return handleError(cb, data, config);
        }

        return Promise.resolve(fn(data, config, ctx, cb))
          .then(result => {
            const pluginPromises = [];

            for (const plugin of nextPlugins) {
              if (typeof plugin.onComplete === 'function') {
                pluginPromises.push(plugin.onComplete(result, data, config, ctx, cb));
              }
            }

            return Promise.all(pluginPromises).then(() => result);
          })
          .then(result => {
            if (config.errors.length > 0) {
              // Errors were added to the errors array - report errors to caller
              return handleError(cb, data, config, result);
            }

            // Successful Response Received
            return handleResponse(cb, data, config, result);
          })
          .catch(err => {
            config.errors.push(err.message);
            return handleError(cb, data, config, e);
          });
      });
    } catch (err) {
      config.errors.push(err.message);
      return handleError(cb, data, config, err.message, err);
    }
  };
}
