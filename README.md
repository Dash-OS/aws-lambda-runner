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
  // default status code to return to the caller when using proxy integration.
  statusCode: 200,
  // do we want to add the 'Access-Control-Allow-Origin' header to our response?
  cors: true,
  // do we want to add any headers to the response?  We can add new headers by
  // mutating the received config object
  headers: null,
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

### Configuration Object

#### Dynamic Configuration Values 

 - headers
 - cors
 - statusCode

#### Static Configuration Values

 - isProxy
 - request
 - query
 - path
 - method
 - pathParameters
 - stageVariables

### Useful Links & Resources

 - [Webpack 2 / Apex / AWS Lambda Runner Example Project](https://github.com/Dash-OS/aws-lambda-runner-example)
 - [apex.run (docs)](http://apex.run/)