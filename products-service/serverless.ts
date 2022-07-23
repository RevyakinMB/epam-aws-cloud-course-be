import type { AWS } from '@serverless/typescript';

import createProduct from '@functions/create-product';
import getProductsList from '@functions/get-products-list';
import getProductById from '@functions/get-product-by-id';

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
    createProduct,
    getProductById,
    getProductsList,
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
      typefiles: [],
      basePath: '/dev',
      host: 'vzxop304db.execute-api.eu-west-1.amazonaws.com'
    },
  },
};

module.exports = serverlessConfiguration;
