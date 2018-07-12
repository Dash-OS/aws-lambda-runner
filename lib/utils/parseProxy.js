/* @flow */

import type { RunnerRuntimeConfig } from '../types/runner';
import type { LambdaProxyEvent } from '../types/lambda';

import schema from './schema';

// rawParams will be added to config.request - otherwise they will
// be formatted and added in a cleaner way
// const rawParams = ['headers', 'requestContext', 'isBase64Encoded'];

// const handleHeader = {
//   'User-Agent': (value, config) => {
//     config.client.agent = value;
//   },
//   'X-Forwarded-For': (value, config) => {
//     config.client.forwardedFor = value.split(',');
//   },
//   'X-Forwarded-Port': (value, config) => {
//     config.client.forwardedPort = Number(value);
//   },
//   'CloudFront-Viewer-Country': (value, config) => {
//     config.client.country = value;
//   },
// };

// If we want to handle the given parameter in some special way we add
// a function for it here.
const handleParam: {
  DEFAULT: (key: string, value: *, config: RunnerRuntimeConfig) => boolean,
  [key: $Keys<LambdaProxyEvent>]: (value: any, config: RunnerRuntimeConfig) => boolean,
} = {
  httpMethod: (value, config) => {
    if (schema.methods.includes(value)) {
      config.request.method = value;
    }
    return true;
  },
  path: (value, config) => {
    if (typeof value === 'string') {
      config.request.path = value;
    }
    return true;
  },
  resource: (value, config) => {
    if (typeof value === 'string') {
      config.request.resource = value;
    }
    return true;
  },
  queryStringParameters: (value, config) => {
    if (typeof value === 'object') {
      Object.assign(config.request.queries, { ...value });
    }
    return true;
  },
  pathParameters: (value, config) => {
    if (typeof value === 'object') {
      Object.assign(config.request.params, { ...value });
    }
    return true;
  },
  stageVariables: (value, config) => {
    if (typeof value === 'object') {
      Object.assign(config.request.stage, { ...value });
    }
    return true;
  },
  // requestContext: (value, config) => {
  //   if (value?.identity?.sourceIp) {
  //     config.client.sourceIP = value.identity.sourceIp;
  //   }
  //   config.request.requestContext = value;
  //   return false;
  // },
  // If none are provided, we will assign to config.request[key] by default
  DEFAULT: (key, value, config) => {
    if (!config.request[key]) {
      config.request[key] = value;
    } else if (typeof config.request[key] === 'object') {
      Object.assign(config.request[key], value);
    }
    return false;
  },
  // headers will be normalized to lower case to handle non-compliant assholes
  headers: (value, config) => {
    if (!config.request.headers) {
      config.request.headers = {};
    }
    for (const headerKey in value) {
      if (Object.prototype.hasOwnProperty.call(value, headerKey)) {
        // $FlowIgnore
        config.request.headers[headerKey.toLowerCase()] = value[headerKey];
      }
    }
  },
};

export default function<+D: LambdaProxyEvent, +C: RunnerRuntimeConfig>(data: D, config: C) {
  // We will take values from e and format them into our configuration
  if (typeof data !== 'object') {
    return;
  }
  // Indicate that we have a proxy
  config.request.isProxy = true;
  // iterate thorugh our parameters and call the handler for each.
  for (const param of Object.keys(data)) {
    if (!handleParam[param]) {
      handleParam.DEFAULT(param, data[param], config);
    } else {
      const remove = handleParam[param](data[param], config);
      if (remove === true) {
        delete data[param];
      }
    }
  }
}
