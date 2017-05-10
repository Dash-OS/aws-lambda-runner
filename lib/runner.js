
import Errors from './utils/errors'
import parseProxy from './utils/parseProxy'

// Try to parse as body -- return untouched if it fails
function tryParseJSON(j) {
  try {
    return typeof j === 'string' && JSON.parse(j) || j
  } catch (e) { return j }
}

// Try to stringify, return untouched if fails.
function tryStringifyJSON(o) {
  try {
    return typeof o === 'object' && JSON.stringify(o) || o
  } catch (e) { return o }
}

const DEFAULT_CONFIG = {
  statusCode: 200,
  headers: null,
  cors: false,
  isProxy: false,
}

const response = (config, body, cb) => cb(null, {
  statusCode: config.statusCode || 400,
  body: tryStringifyJSON(body),
  headers: {
    ...config.cors 
      ? { 'Access-Control-Allow-Origin': '*' }
      : undefined,
    ...config.headers
  },
})

export default (...args) => {
  let config, fn, errors = []
  switch(args.length) {
    case 1: {
      fn = args[0]
      config = Object.assign({}, DEFAULT_CONFIG)
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
        config = Object.assign({}, DEFAULT_CONFIG, args[0])
        fn = args[1]
      }
      break
    }
    default: {
      errors.push(Errors.wrongArguments(...args))
      break
    }
  }
  return (e, ctx, cb) => {
    let data
    if ( errors.length > 0 || typeof fn !== 'function' || typeof config !== 'object' ) {
      // Return an Error to the caller letting them know what happend
      config.statusCode = 400
      return response(config, { result: 'error', errors }, cb)
    }
    if ( e && e.requestContext !== undefined && e.headers !== undefined ) {
      // We will mutate the config object
      parseProxy(e, config)
      data = tryParseJSON(e.body)
    } else { data = e }
    try {
      Promise.resolve(fn(data, config, ctx, cb))
        .then(result => {
          if ( config.isProxy === false ) {
            return cb(null, result)
          } else {
            return response(config, result, cb)
          }
        }).catch(cb)
    } catch (err) { cb(err) }
  }
}