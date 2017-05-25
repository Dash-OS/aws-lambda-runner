# AWS Lambda Runner

A tiny (2KB Compressed & Minified) wrapper utility to make running your
aws lambda functions cleaner.  Inspired heavily/completely by the [node-apex](https://github.com/apex/node-apex) 
library.  

### Features

 - Pairs perfectly with the [apex](https://github.com/apex/apex) serverless solution.
 - Supports [Lambda Proxy Integrations](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html) w/ [API Gateway Proxy](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-input-format).
 - Provide custom headers & status codes to include with the response.
 - Enable cors for the requests.
 - One function can handle methods and paths.

### Installation

```
yarn add aws-lambda-runner
```

***OR***

```
npm install --save aws-lambda-runner
```

### Example

#### Without Default Configuration

```js
import run from 'aws-lambda-runner'

export default run(
  async (body, config) => {
    return {
      hello: 'world'
    }
  }
)
```

#### With Default Configuration

```js
import run from 'aws-lambda-runner'

export default run({
  // Do we want the runner to log to cloudwatch (via console)
  log: true,
  // default status code to return to the caller when using proxy integration.
  statusCode: 200,
  // do we want to add the 'Access-Control-Allow-Origin' header to our response?
  cors: true,
  // do we want to add any headers to the response?  We can add new headers by
  // mutating the received config object
  headers: null,
  // do we want to allow the lambda process to flush the event loop before it freezes
  // this process? If false, all processing will be frozen immediately upon resolution 
  // of the runner Promise (which calls our function below). (defaults: true)
  awaitEventLoop: false
}, async (body, config, ctx, cb) => {
  /*
    Handle our function, the resolution of the promise will be used to 
    populate the body.  This does not need to be an async function, we 
    can return a standard object or promise to be resolved.  
    
    Errors during execution are caught and passed to the caller.
  */
  return {
    hello: 'world'
  }
})
```

### Plugins

Lambda-Runner supports a simple plugin system which allows you to handle various 
hooks during the lifecycle of your Lambda's execution.

Plugins are classes which will be instatiated for each request.  One may optionally 
pass settings to the plugin.

Plugins can mutate the various objects.  This allows them to add functionality to 
your requests such as adding response headers, formatting responses, or anything 
they might want to accomplish.

If a plugin returns a `Promise`, the promise will be resolved before continuing.

#### Plugin Hooks

 - onBuild
 - onComplete

> At some point we plan to add a few extra hooks such as "onError" and "onSuccess"

#### Plugin Example

Here is a very simple example of a plugin which attempts to capture the 
authorizer claims and/or API Key that was used for the request and moves 
the data into `config.auth`.



##### Function

```js
export default run({
  log: 'debug',
  cors: true,
  headers: null,
  awaitEventLoop: false,
  plugins: [
    [ AuthorizerPlugin, {
      removeAuthorizer: false
    } ],
    PromiseMapPlugin
  ]
}, async (body, config, ctx) => {
  /* Your Function */
}
```

### Configuration Object

#### Dynamic Configuration Values 

By mutating the `config` object (or setting the values in the runner configuration), 
you can change how the request will be handled.  This allows you to set the response 
code, add cors headers, add errors, and control the function.

 - log (default: false) <_Boolean_|_Array_> - what level of runner logging should be performed?
   - "errors", "exceptions", "debug"
 - headers (default: null) <_null_|_Object Literal_> - headers to include with the response.
 - cors | (default: false) <_Boolean_> - should the "Access-Control-Allow-Origin" header be added to the response?
 - statusCode (default: 200) <_Number_> - the default status code to respond with if the request is successful.
 - errorCode (default: 400) <_Number_> - the default status code to respond with if errors are encountered.
 - errors (default: []) <_Array_> - an array of errors that should be provided.  If any errors are pushed into this array, an error will be assumed.
 - plugins (default: []) <_Array_> - provided in the initial runner configuration, plugins allow extending the capabilities of the runner through hooks.
 - onError (default: null) <_null_|_Function_> - a function to allow extra handling of encountered errors.
 - [awaitEventLoop](http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html) (default: true) <_Boolean_> - see the provided link, this controls context.callbackWaitsForEmptyEventLoop.

#### Static Configuration Values

These values are set internally on the config object.  Mutating these values will generally not affect the normal 
operation of the runner (although it shouldn't be done as plugins may expect these values to be intact).

 - isProxy
 - resource
 - path
 - method 
 - request
 - client
 - queries (url queries) 
 - params (pathParameters)
 - stage (stageVariables)

> More Information will come about these values, here is a stringified example of the `config` object.

```json
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
      "Accept": "application/json, text/plain, */*",
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
```

### Useful Links & Resources

 - [Webpack 2 / Apex / AWS Lambda Runner Example Project](https://github.com/Dash-OS/aws-lambda-runner-example)
 - [apex.run (docs)](http://apex.run/)