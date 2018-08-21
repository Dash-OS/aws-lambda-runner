/* @flow */

export type Lambda$RunnerResponse = (
  event: Lambda$EventObject,
  context: Lambda$ContextObject,
  callback: Lambda$CallbackFunction
) => any;

export type Lambda$CallbackFunction = (
  error: Error | string | $Subtype<Error> | { name: string, message: string } | null,
  data?: | {|
        statusCode: number,
        headers: {
          [headerName: string]: string,
        },
        body: string,
      |}
    | mixed
) => void;

export type Lambda$Data = mixed;

export type Lambda$ProxyEvent = {|
  path: string,
  headers: {
    [headerName: string]: string,
  },
  pathParameters: {
    [paramID: string]: string,
  },
  requestContext: {
    accountId: string,
    resourceId: string,
    stage: string,
    requestId: string,
    identity: {
      cognitoIdentityPoolId: string,
      accountId: string,
      cognitoIdentityId: string,
      caller: string,
      apiKey: string,
      sourceIp: string,
      cognitoAuthenticationType: string,
      cognitoAuthenticationProvider: string,
      userArn: string,
      userAgent: string,
      user: string,
    },
    resourcePath: string,
    httpMethod: string,
    apiId: string,
  },
  resource: string,
  httpMethod: string,
  queryStringParameters: {
    [queryStringID: string]: string,
  },
  stageVariables: {
    [varName: string]: string,
  },
  body?: string,
|};

export type Lambda$EventObject = Lambda$ProxyEvent | Object | string;

export type Lambda$ContextObject = {|
  /* Returns the approximate remaining execution time (before timeout occurs) of the Lambda function that is
     currently executing. The timeout is one of the Lambda function configuration. When the timeout reaches,
     AWS Lambda terminates your Lambda function. */
  +getRemainingTimeInMillis: () => number,

  /* The default value is true. This property is useful only to modify the default behavior of the callback.
     By default, the callback will wait until the Node.js runtime event loop is empty before freezing the process
     and returning the results to the caller. You can set this property to false to request AWS Lambda to freeze
     the process soon after the callback is called, even if there are events in the event loop. AWS Lambda will
     freeze the process, any state data and the events in the Node.js event loop (any remaining events in the
     event loop processed when the Lambda function is called next and if AWS Lambda chooses to use the frozen
     process). For more information about callback, see Using the Callback Parameter. */
  callbackWaitsForEmptyEventLoop: boolean,

  /* Name of the Lambda function that is executing. */
  +functionName: string,

  /* The Lambda function version that is executing. If an alias is used to invoke the function, then function_version
     will be the version the alias points to. */
  +functionVersion: string,

  /* The ARN used to invoke this function. It can be a function ARN or an alias ARN. An unqualified ARN executes the
     $LATEST version and aliases execute the function version it is pointing to. */
  +invokedFunctionArn: string,

  /* The name of the CloudWatch log group where you can find logs written by your Lambda function. */
  +logGroupName: string,

  /* Memory limit, in MB, you configured for the Lambda function. You set the memory limit at the time you create a
     Lambda function and you can change it later. */
  +memoryLimitInMB: string,

  /* AWS request ID associated with the request. This is the ID returned to the client that called the invoke method.

     Note: If AWS Lambda retries the invocation (for example, in a situation where the Lambda function that is processing
           Kinesis records throws an exception), the request ID remains the same. */
  +awsRequestId: string,

  /* The name of the CloudWatch log group where you can find logs written by your Lambda function. The log stream may or
     may not change for each invocation of the Lambda function.

     Note: The value is null if your Lambda function is unable to create a log stream, which can happen if the execution role
           that grants necessary permissions to the Lambda function does not include permissions for the CloudWatch actions. */
  +logStreamName: null | string,

  /* Information about the Amazon Cognito identity provider when invoked through the AWS Mobile SDK. It can be null. */
  +identity: null | {|
    /* For more information about the exact values for a specific mobile platform, see Identity Context in the AWS Mobile SDK for iOS Developer Guide,
       and Identity Context in the AWS Mobile SDK for Android Developer Guide.

       iOS: https://docs.aws.amazon.com/aws-mobile/latest/developerguide/getting-started.html
       Android: http://docs.aws.amazon.com/mobile/sdkforandroid/developerguide/lambda.html#client-context
    */
    +cognitoIdentityId: string,
    +cognitoIdentityPoolId: string,
    +clientContext: {|
      +client: null | {
        +installation_id: string,
        +app_title: string,
        +app_version_name: string,
        +app_version_code: string,
        +app_package_name: string,
      },
      /* Custom values set by the mobile client application. */
      +Custom?: Object,
      +env: null | {
        +platform_version: string,
        +platform: string,
        +make: string,
        +model: string,
        +locale: string,
      },
    |},
  |},
|};
