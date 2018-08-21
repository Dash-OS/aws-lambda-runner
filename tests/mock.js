/* @flow */
export const data = {
  simple: {
    foo: 'bar',
  },
  proxy: {
    resource: '/{proxy+}',
    path: '/hello/world',
    httpMethod: 'POST',
    headers: {
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate',
      'cache-control': 'no-cache',
      'CloudFront-Forwarded-Proto': 'https',
      'CloudFront-Is-Desktop-Viewer': 'true',
      'CloudFront-Is-Mobile-Viewer': 'false',
      'CloudFront-Is-SmartTV-Viewer': 'false',
      'CloudFront-Is-Tablet-Viewer': 'false',
      'CloudFront-Viewer-Country': 'US',
      'Content-Type': 'application/json',
      headerName: 'headerValue',
      Host: 'gy415nuibc.execute-api.us-east-1.amazonaws.com',
      'Postman-Token': '9f583ef0-ed83-4a38-aef3-eb9ce3f7a57f',
      'User-Agent': 'PostmanRuntime/2.4.5',
      Via: '1.1 d98420743a69852491bbdea73f7680bd.cloudfront.net (CloudFront)',
      'X-Amz-Cf-Id': 'pn-PWIJc6thYnZm5P0NMgOUglL1DYtl0gdeJky8tqsg8iS_sgsKD1A==',
      'X-Forwarded-For': '54.240.196.186, 54.182.214.83',
      'X-Forwarded-Port': '443',
      'X-Forwarded-Proto': 'https',
    },
    queryStringParameters: {
      name: 'me',
    },
    pathParameters: {
      proxy: 'hello/world',
    },
    stageVariables: {
      stageVariableName: 'stageVariableValue',
    },
    requestContext: {
      accountId: '12345678912',
      resourceId: 'roq9wj',
      stage: 'testStage',
      requestId: 'deef4878-7910-11e6-8f14-25afc3e9ae33',
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        apiKey: null,
        sourceIp: '192.168.196.186',
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'PostmanRuntime/2.4.5',
        user: null,
      },
      resourcePath: '/{proxy+}',
      httpMethod: 'POST',
      apiId: 'gy415nuibc',
    },
    body: '{"foo":"bar"}',
    isBase64Encoded: false,
  },
  form: {
    resource: '/{proxy+}',
    path: '/hello/world',
    httpMethod: 'POST',
    headers: {
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate',
      'cache-control': 'no-cache',
      'CloudFront-Forwarded-Proto': 'https',
      'CloudFront-Is-Desktop-Viewer': 'true',
      'CloudFront-Is-Mobile-Viewer': 'false',
      'CloudFront-Is-SmartTV-Viewer': 'false',
      'CloudFront-Is-Tablet-Viewer': 'false',
      'CloudFront-Viewer-Country': 'US',
      'Content-Type': 'application/x-www-form-urlencoded',
      headerName: 'headerValue',
      Host: 'gy415nuibc.execute-api.us-east-1.amazonaws.com',
      'Postman-Token': '9f583ef0-ed83-4a38-aef3-eb9ce3f7a57f',
      'User-Agent': 'PostmanRuntime/2.4.5',
      Via: '1.1 d98420743a69852491bbdea73f7680bd.cloudfront.net (CloudFront)',
      'X-Amz-Cf-Id': 'pn-PWIJc6thYnZm5P0NMgOUglL1DYtl0gdeJky8tqsg8iS_sgsKD1A==',
      'X-Forwarded-For': '54.240.196.186, 54.182.214.83',
      'X-Forwarded-Port': '443',
      'X-Forwarded-Proto': 'https',
    },
    queryStringParameters: {
      name: 'me',
    },
    pathParameters: {
      proxy: 'hello/world',
    },
    stageVariables: {
      stageVariableName: 'stageVariableValue',
    },
    requestContext: {
      accountId: '12345678912',
      resourceId: 'roq9wj',
      stage: 'testStage',
      requestId: 'deef4878-7910-11e6-8f14-25afc3e9ae33',
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        apiKey: null,
        sourceIp: '192.168.196.186',
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'PostmanRuntime/2.4.5',
        user: null,
      },
      resourcePath: '/{proxy+}',
      httpMethod: 'POST',
      apiId: 'gy415nuibc',
    },
    body: 'one=two&three=four',
    isBase64Encoded: false,
  },
};

export const context = {
  simple: {
    getRemainingTimeInMillis: () => 999999,
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'Mockup',
    functionVersion: '1.0',
    invokedFunctionArn: 'arn:function:mockup',
    logGroupName: 'mockup:log:group:name',
    memoryLimitInMB: 'NA',
    awsRequestId: 'mockup:requestId',
    logStreamName: 'mockup:logstream:name',
    identity: null,
  },
};

export const callback = (
  err: Error | string | $Subtype<Error> | { name: string, message: string } | null,
  response?: any
) => {
  if (err) {
    console.error('[ERROR OCCURRED] | ', err);
    return;
  }
  console.log(
    '\n----------------------------\n',
    '[SUCCESSFULLY EXECUTED FUNCTION]',
    '\n----------------------------\n'
  );
  console.log(JSON.stringify(response, null, 2), '\n\n----------------------------\n');
};
