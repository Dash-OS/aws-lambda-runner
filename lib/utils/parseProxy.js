// what params from the proxy do we want to handle?
// const parseParams = [
//   'httpMethod',
//   'path',
//   'resource',
//   'queryStringParameters',
//   'pathParameters',
//   'stageVariables',
//   'headers',
//   'requestContext',
//   'isBase64Encoded',
// ];

// rawParams will be added to config.request - otherwise they will
// be formatted and added in a cleaner way
// const rawParams = ['headers', 'requestContext', 'isBase64Encoded'];

const handleHeader = {
  'User-Agent': (value, config) => {
    config.client.agent = value;
  },
  'X-Forwarded-For': (value, config) => {
    config.client.forwardedFor = value.split(',');
  },
  'X-Forwarded-Port': (value, config) => {
    config.client.forwardedPort = Number(value);
  },
  'CloudFront-Viewer-Country': (value, config) => {
    config.client.country = value;
  },
};

// If we want to handle the given parameter in some special way we add
// a function for it here.
const handleParam = {
  httpMethod: (value, config) => {
    config.method = value;
    if (Array.isArray(config.methods) && !config.methods.includes(value)) {
      throw new Error(`Invalid HTTP Method: ${value}`);
    }
    return true;
  },
  path: (value, config) => {
    config.path = value;
    return true;
  },
  resource: (value, config) => {
    config.resource = value;
    return true;
  },
  queryStringParameters: (value, config) => {
    config.queries = value && Object.assign({}, value);
    return true;
  },
  pathParameters: (value, config) => {
    config.params = value && Object.assign({}, value);
    return true;
  },
  stageVariables: (value, config) => {
    config.stage = Object.assign({}, value);
    return true;
  },
  requestContext: (value, config) => {
    if (value && value.identity && value.identity.sourceIp) {
      config.client.sourceIP = value.identity.sourceIp;
    }
    config.request.requestContext = value;
  },
  // If none are provided, we will assign to config.request[key] by default
  DEFAULT: (key, value, config) => {
    config.request[key] = value;
  },
  // headers will be read and further parsed to capture useful information
  headers: (value, config) => {
    config.request.headers = value;
    const handledHeaders = Object.keys(handleHeader);
    const receivedHeaders = Object.keys(value);
    const callHandler = hdr => {
      if (value[hdr] === undefined) {
        return;
      }
      if (typeof handleHeader[hdr] === 'function') {
        handleHeader[hdr](value[hdr], config);
      }
    };
    if (handledHeaders.length >= receivedHeaders.length) {
      receivedHeaders.forEach(callHandler);
    } else {
      handledHeaders.forEach(callHandler);
    }
  },
};

export default function (e, config) {
  // We will take values from e and format them into our configuration
  if (typeof e !== 'object') {
    return;
  }
  // Indicate that we have a proxy
  config.isProxy = true;
  if (!config.request) {
    config.request = {};
  }
  // iterate thorugh our parameters and call the handler for each.
  for (const param in e) {
    if (handleParam[param] === undefined) {
      handleParam.DEFAULT(param, e[param], config);
    } else {
      const remove = handleParam[param](e[param], config);
      if (remove === true) {
        delete e[param];
      }
    }
  }
}
