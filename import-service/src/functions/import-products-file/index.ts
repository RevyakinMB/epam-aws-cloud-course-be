import { handlerPath } from '@libs/handler-resolver';
import type { AwsArn } from '@serverless/typescript';

const authorizerArn: AwsArn = {
  'Fn::Join': [
    ':',
    [
      'arn:aws:lambda',
      { Ref: 'AWS::Region' },
      { Ref: 'AWS::AccountId' },
      'function',
      'authorization-service-dev-basicAuthorizer',
    ],
  ],
};

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: {
          origin: '*',
          headers: [
            '*',
          ],
        },
        request: {
          parameters: {
            querystrings: {
              name: {
                required: true,
              },
            },
          },
        },
        authorizer: {
          type: 'token',
          name: 'tokenAutorizer',
          arn: authorizerArn,
          resultTtlInSeconds: 0,
          // identitySource: 'method.request.header.Authorization',
        },
      },
    },
  ],
};
