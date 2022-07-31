/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

import importFileParser from '@src/functions/import-file-parser';
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
      BUCKET_NAME: '${self:custom.s3BucketName}',
      REGION_ID: '${self:provider.region}',
    },
    iam: {
      role: {
        statements: [{
          Effect: 'Allow',
          Action: [
            's3:CopyObject',
            's3:DeleteObject',
            's3:GetObject',
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
  resources: {
    Resources: {
      S3FileStorage: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:custom.s3BucketName}',
          CorsConfiguration: {
            CorsRules: [{
              AllowedMethods: [
                'PUT',
                'POST',
                'DELETE',
              ],
              AllowedHeaders: [
                '*',
              ],
              AllowedOrigins: [
                '*',
              ],
            }],
          },
        },
      },
    },
  },
  functions: {
    importFileParser,
    importProductsFile,
  },
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
