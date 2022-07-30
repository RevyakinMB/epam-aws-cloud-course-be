/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

import importProductsFile from '@src/functions/import-products-file';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      // TODO: create bucket using serverless
      BUCKET_NAME: '${self:custom.s3BucketName}',
      REGION_ID: '${self:provider.region}',
    },
    iam: {
      role: {
        statements: [{
          Effect: 'Allow',
          Action: [
            's3:PutObject',
          ],
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:aws:s3:::',
                '${self:custom.s3BucketName}',
                '/*',
              ],
            ],
          },
        }],
      },
    },
  },
  functions: { importProductsFile },
  package: { individually: true },
  custom: {
    s3BucketName: 'epam-clouddevcourse-products',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
