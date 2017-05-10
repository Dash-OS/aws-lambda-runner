
// what params from the proxy do we want to handle?
const parse_params = [ 
  'httpMethod',
  'path',
  'resource',
  'queryStringParameters',
  'pathParameters',
  'stageVariables',
  'headers',
  'requestContext',
  'isBase64Encoded'
]

// raw_params will be added to config.request - otherwise they will
// be formatted and added in a cleaner way
const raw_params = [
  'headers',
  'requestContext',
  'isBase64Encoded'
]

// If we want to handle the given parameter in some special way we add
// a function for it here.
const handle_param = {
  httpMethod: (value, config) => { config.method = value },
  path: (value, config) => { config.path = value },
  resource: (value, config) => { config.resource = value },
  queryStringParameters: (value, config) => { config.queries = value },
  pathParameters: (value, config) => { config.params = value },
  stageVariables: (value, config) => { config.stage = value },
  // If none are provided, we will assign to config.request[key] by default
  DEFAULT: (key, value, config) => { config.request[key] = value },
}

export default function (e, config) {
  // We will take values from e and format them into our configuration
  if ( typeof e !== 'object' ) { return }
  // Indicate that we have a proxy
  config.isProxy = true
  if ( ! config.request ) { config.request = {} }
  // iterate thorugh our parameters and call the handler for each.
  for ( let param in e ) {
    if ( handle_param[param] === undefined ) {
      handle_param.DEFAULT(param, e[param], config)
    } else {
      handle_param[param](e[param], config)
    }
  }
}