/* @flow */

import type { Lambda$ContextObject, Lambda$CallbackFunction, Lambda$Data } from './lambda';

type Runner$PluginHookFunction = <
  D: Lambda$Data,
  C: Runner$RuntimeConfig,
  T: Lambda$ContextObject,
  F: Lambda$CallbackFunction
>(
  data: D,
  config: C,
  context: T,
  callback: F
) => Promise<void> | void;

export type Runner$PluginHooks$Sequential = Array<
  Runner$PluginHookFunction | Runner$PluginHooks$Parallel
>;

export type Runner$PluginHooks$Parallel = Set<
  Runner$PluginHookFunction | Runner$PluginHooks$Sequential
>;

export type Runner$PluginHooks = 'onComplete' | 'onError' | 'onExecute';

export type Runner$PluginHooksIndex$Sequential = {
  [hook: Runner$PluginHooks]: Runner$PluginHooks$Sequential,
};

export type Runner$PluginHooksIndex$Parallel = {
  [hook: Runner$PluginHooks]: Runner$PluginHooks$Parallel,
};

// export interface RunnerPluginInterface<PC, PRC = {}, PS = any> {
//   config: PC;
//   state: PS;

//   constructor(config: PRC): any;

//   +onExecute?: PluginHookFunction;
//   +onComplete?: PluginHookFunction;
//   +onError?: PluginHookFunction;
// }
export type Runner$PluginInterface = {|
  onExecute?: Runner$PluginHookFunction,
  onComplete?: Runner$PluginHookFunction,
  onError?: Runner$PluginHookFunction,
|};
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

export type Runner$PluginDefinition$Sequential = $ReadOnlyArray<
  Runner$PluginDefinition$Parallel | Runner$PluginInterface
>;

export type Runner$PluginDefinition$Parallel = Set<
  Runner$PluginDefinition$Sequential | Runner$PluginInterface
>;

export type Runner$UserConfig = {|
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
      config: Runner$RuntimeConfig
    ) => Error | { name: string, message: string } | { [key: string]: any },
  |},
  response?: {|
    headers?: { [headerName: string]: string },
  |},
  plugins?: Runner$PluginDefinition$Parallel,
|};

export type Runner$Config = {|
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
      config: Runner$RuntimeConfig
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

  plugins?: Runner$PluginDefinition$Parallel,
|};

export type Runner$RuntimeConfig = $ReadOnly<
  $Rest<
    $Exact<Runner$Config>,
    {|
      plugins: void | Runner$PluginDefinition$Parallel,
    |}
  >
>;

export type Runner$TopConfig = {
  config: $Shape<Runner$Config>,
};

export type Runner$Function = (<D: *>(data: D, config: Runner$RuntimeConfig) => any) &
  (<D: *, T: Lambda$ContextObject>(data: D, config: Runner$RuntimeConfig, context: T) => any) &
  (<D: *, T: Lambda$ContextObject, F: Lambda$CallbackFunction>(
    data: D,
    config: Runner$RuntimeConfig,
    context: T,
    callback: F
  ) => any) &
  ((...args: Array<any>) => any) &
  (<D: *>(data: D, ...args: Array<any>) => any);

export type Runner$Arguments = [Runner$UserConfig, Runner$Function];
