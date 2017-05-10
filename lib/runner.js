
import Errors from './utils/errors'
import parseProxy from './utils/parseProxy'

import { isLogLevel, handleLogError, handleLogDebug } from './utils/log'
import { tryStringifyJSON, tryParseJSON } from './utils/utils'

const DEFAULT_CONFIG = {
  isProxy: false,
  // Log Level Desired ( true || [ ...levels ] )
  log: false,
  // Default Response Handling (Proxy Only)
  statusCode: 200,
  cors: false,
  headers: null,
  // Default Error Handling
  errorCode: 400,
  onError: undefined
}

function handleResponse (cb, data, config, result) {
  if ( isLogLevel(config, 'debug') ) {
    handleLogDebug(
      config,
      config.isProxy === true
        ? `${config.statusCode} | Returning Response to Caller`
        : 'Returning Response to Caller:',
      JSON.stringify(result, null, 2)
    )
  }
  if ( config.isProxy === true ) {
    return cb(null, {
      statusCode: config.statusCode || config.errorCode,
      body: tryStringifyJSON(result),
      headers: {
        ...config.cors 
          ? { 'Access-Control-Allow-Origin': '*' }
          : undefined,
        ...config.headers
      },
    })
  } else {
    return cb(null, result)
  }
}

function handleError (cb, data, config, result, exception) {
  const error_response = {
    result: 'error',
    errors: config.errors
  }
  if ( config.isProxy === true && config.statusCode === 200 ) {
    config.statusCode = config.errorCode || 400
  }
  if ( config.log ) {
    // Verified that log exists so we only format the log if necessary
    handleLogError(
      config,
      config.errors.join(', \n   '),
      exception
    )
  }
  if ( typeof config.onError === 'function' ) {
    // Call the Error Handler - it should mutate the error_response argument
    // which we will report to the caller when completed.
    Promise.resolve(
      config.onError(error_response, config, { data, result }, exception, cb)
    ).then(r => {
      if ( r === false ) { 
        /* Do Not Handle the Response : handled by onError handler */
        return
      } else {
        return handleResponse(cb, data, config, error_response)
      }
    }).catch(err => {
      // If an error occurs during the handler, add the error to the response
      // and report the final result.
      handleLogError(
        config, 
        err.message, 
        err,
        'An Error Occurred During the Provided Error Handler',
        'ERROR HANDLER'
      )
      config.errors.push(err.message)
      // just in case
      error_response.errors = config.errors
      return handleResponse(cb, data, config, error_response)
    })
  } else {
    // Report the Errors
    return handleResponse(cb, data, config, error_response)
  }
}

function parseArgs (config, errors, ...args) {
  let fn
  switch(args.length) {
    case 1: {
      fn = args[0]
      Object.assign(config, DEFAULT_CONFIG)
      break
    }
    case 2: {
      if ( typeof args[0] !== 'object' ) {
        if ( typeof args[1] === 'object' ) {
          errors.push(Errors.argumentsOrder(...args))
        } else {
          errors.push(Errors.invalidConfig(...args))
        }
      } else {
        Object.assign(config, DEFAULT_CONFIG, args[0])
        fn = args[1]
      }
      break
    }
    default: {
      errors.push(Errors.wrongArguments(...args))
      break
    }
  }
  return fn
}

export default function (...args) {
  let call_config = {}, startup_errors = []
  const fn = parseArgs(call_config, startup_errors, ...args)
  return (e, ctx, cb) => {
    let data
    const config = Object.assign({}, call_config, { errors: [].concat(startup_errors) })
    try {
      if ( isLogLevel(config, 'debug') ) {
        handleLogDebug(
          config,
          'Starting Function Execution',
          config.isProxy === true
            ? JSON.stringify({
              timeRemaining: ctx.getRemainingTimeInMillis(),
              path: config.path,
              method: config.method,
              queries: config.queries,
              params: config.params,
              stage: config.stage
            }, null, 2)
            : JSON.stringify({
              timeRemaining: ctx.getRemainingTimeInMillis()
            }, null, 2)
        )
      }
      if ( e && e.requestContext !== undefined && e.headers !== undefined ) {
        // We will mutate the config object
        parseProxy(e, config)
        // Try to parse as json, return untouched if it fails
        data = tryParseJSON(e.body)
      } else { data = e }
      if ( config.errors.length > 0 || typeof fn !== 'function' ) {
        // Return an Error to the caller letting them know what happend
        return handleError(cb, data, config)
      }
      Promise.resolve(fn(data, config, ctx, cb))
        .then(result => {
          if ( config.errors.length > 0 ) {
            // Errors were added to the errors array - report errors to caller
            return handleError(cb, data, config, result)
          } else {
            // Successful Response Received
            return handleResponse(cb, data, config, result)
          }
        }).catch(err => {
          config.errors.push(err.message)
          return handleError(cb, data, config)
        })
    } catch (err) { 
      config.errors.push(err.message)
      return handleError(cb, data, config)
    }
  }
}