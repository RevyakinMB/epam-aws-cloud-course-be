import type { AWS } from '@serverless/typescript';

import catalogBatchProcess from '@functions/catalog-batch-process';
import createProduct from '@functions/create-product';
import getProductById from '@functions/get-product-by-id';
import getProductsList from '@functions/get-products-list';

import { serverlessDbEnvConfiguration } from './env.serverless';

const serverlessConfiguration: AWS = {
  service: 'products-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-esbuild',
  ],
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
      ...serverlessDbEnvConfiguration,
    },
  },
  functions: {
    catalogBatchProcess,
    createProduct,
    getProductById,
    getProductsList,
  },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-items-queue',
          MessageRetentionPeriod: 200,
          RedrivePolicy: {
            deadLetterTargetArn: {
              'Fn::GetAtt': ['CatalogItemsDeadLetterQueue', 'Arn'],
            },
            maxReceiveCount: 3,
          },
          VisibilityTimeout: 15,
        },
      },
      CatalogItemsDeadLetterQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-items-dead-letter-queue',
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: [
        'aws-sdk',
        'pg-native',
      ],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      basePath: '/dev',
      host: 'vzxop304db.execute-api.eu-west-1.amazonaws.com',
    },
  },
};

module.exports = serverlessConfiguration;
