/* @flow */

import type { LambdaContextObject, LambdaCallbackFunction, LambdaData } from './lambda';

import RunnerPlugin from '../plugin';

export interface RunnerPluginInterface<PC, PS = void> {
  settings: PC;
  state: PS;

  constructor(settings?: void | PC): any;

  onExecute?: (
    data: LambdaData,
    config: RunnerRuntimeConfig,
    context: LambdaContextObject,
    callback: LambdaCallbackFunction
  ) => Promise<void> | void;
  onComplete?: (
    data: LambdaData,
    config: RunnerRuntimeConfig,
    context: LambdaContextObject,
    callback: LambdaCallbackFunction
  ) => Promise<void> | void;
  onError?: (
    data: LambdaData,
    config: RunnerRuntimeConfig,
    context: LambdaContextObject,
    callback: LambdaCallbackFunction
  ) => Promise<void> | void;
}

/*
{
  "isProxy": true,
  "resource": "/web/session",
  "path": "/v2/web/session",
  "method": "POST",
  "log": "debug",
  "statusCode": 200,
  "cors": true,
  "headers": null,
  "errorCode": 400,
  "awaitEventLoop": false,
  "client": {
    "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "forwardedFor": [
      "<masked-ip>",
      "<masked-ip>"
    ],
    "forwardedPort": 443,
    "country": "US",
    "sourceIP": "<masked-ip>"
  },
  "queries": {
    "version": "2.0",
  },
  "params": {
    "user": "example_user",
  },
  "stage": null,
  "errors": [],
  "request": {
    "headers": {
      "Accept": "application/json, text/plain, \*\/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.8",
      "Authorization": "<masked-authorization-header>",
      "CloudFront-Forwarded-Proto": "https",
      "CloudFront-Is-Desktop-Viewer": "true",
      "CloudFront-Is-Mobile-Viewer": "false",
      "CloudFront-Is-SmartTV-Viewer": "false",
      "CloudFront-Is-Tablet-Viewer": "false",
      "CloudFront-Viewer-Country": "US",
      "Content-Type": "application/json charset=UTF-8",
      "Host": "<masked-host>",
      "Origin": "<masked-origin>",
      "Referer": "<masked-referer>",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      "Via": "<masked>",
      "X-Amz-Cf-Id": "<masked>",
      "X-Amzn-Trace-Id": "<masked>",
      "x-api-key": "<masked-api-key>",
      "X-Forwarded-For": "<masked>, <masked>",
      "X-Forwarded-Port": "443",
      "X-Forwarded-Proto": "https"
    },
    "requestContext": {
      "path": "/v2/web/session",
      "accountId": "<masked-account-id>",
      "resourceId": "<masked-resource-id>",
      "stage": "production",
      "requestId": "63851d0d-40d1-11e7-9be4-d54b94333e61",
      "identity": {
        "cognitoIdentityPoolId": null,
        "accountId": null,
        "cognitoIdentityId": null,
        "caller": null,
        "apiKey": "<masked-api-key>",
        "sourceIp": "<masked-ip>",
        "accessKey": null,
        "cognitoAuthenticationType": null,
        "cognitoAuthenticationProvider": null,
        "userArn": null,
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        "user": null
      },
      "resourcePath": "/web/session",
      "httpMethod": "POST",
      "apiId": "95r35czxwj"
    },
    "isBase64Encoded": false
  }
}
*/

type PluginTuple = <C, S>(
  RunnerPluginInterface<C, S>
) => [Class<RunnerPluginInterface<C, S>>, $Shape<C>];

export type RunnerUserConfig = {|
  settings?: {|
    isBase64Encoded?: boolean | false,
    log?: boolean,
    successCode?: number | 200,
    errorCode?: number | 400,
    awaitEventLoop?: boolean | true,
    cors?: boolean | false,
  |},
  handlers?: {|
    onError: (
      config: RunnerRuntimeConfig
    ) => Error | { name: string, message: string } | { [key: string]: any },
  |},
  response?: {|
    headers?: { [headerName: string]: string },
  |},
  plugins?: Array<RunnerPluginDefinition<*>>,
|};

export type RunnerConfig = {|
  settings: {|
    +awaitEventLoop: boolean | true,
    +isBase64Encoded: boolean | false,
    +log: boolean,
    successCode: number | 200,
    errorCode: number | 400,
    cors: boolean | false,
  |},

  request: {
    /* Static Properites */
    isProxy: boolean,
    path: void | string,
    body: mixed,
    resource: void | string,
    headers: { [headerName: string]: string },
    method: 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT',
    queries: {
      [queryName: string]: string,
    },
    params: {
      [paramName: string]: string,
    },
    stage: {
      [varName: string]: string,
    },
  },

  handlers: {|
    onError: (
      config: RunnerRuntimeConfig
    ) => Error | { name: string, message: string } | { [key: string]: any },
  |},

  response: {
    statusCode: number,
    isBase64Encoded?: boolean,
    /* These are modifiable but the original values should not be mutated / changed */
    headers: { [headerName: string]: string },
    body: mixed,
  },

  state: {
    [stateID: string]: any,
  },

  errors: Array<Error>,

  plugins: Array<RunnerPluginDefinition<*>>,
|};

export type RunnerPluginDefinition<S: RunnerPluginInterface<*, *>> =
  | $Call<PluginTuple, S>
  | Class<RunnerPlugin<*, *>>;

export type RunnerRuntimeConfig = $ReadOnly<{
  ...RunnerConfig,

  plugins: RunnerPlugin<Object>[],
}>;

export type RunnerTopConfig = {
  config: $Shape<RunnerConfig>,
};

export type RunnerFunction = (<D: *>(data: D, config: RunnerRuntimeConfig) => any) &
  (<D: *, T: LambdaContextObject>(data: D, config: RunnerRuntimeConfig, context: T) => any) &
  (<D: *, T: LambdaContextObject, F: LambdaCallbackFunction>(
    data: D,
    config: RunnerRuntimeConfig,
    context: T,
    callback: F
  ) => any) &
  ((...args: Array<any>) => any) &
  (<D: *>(data: D, ...args: Array<any>) => any);

// export type RunnerFunction = <D: *, T: LambdaContextObject, F: LambdaCallbackFunction>(
//   data: D,
//   config: RunnerRuntimeConfig,
//   context?: T,
//   callback?: F,
// ) => any;

export type RunnerArguments = [RunnerUserConfig, RunnerFunction];
