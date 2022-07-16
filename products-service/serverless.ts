import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/get-products-list';
import getProductById from '@functions/get-product-by-id';

const serverlessConfiguration: AWS = {
  service: 'products-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-plugin-swagger-ui',
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
    },
  },
  // import the function via paths
  functions: {
    getProductById,
    getProductsList,
  },
  package: { individually: true },
  custom: {
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
    swaggerUi: {
      s3Bucket: 'products-service-api-swagger',
      exportType: 'oas30',
      accepts: 'application/yaml',
      extensions: 'integrations',
      swaggerUiDirectoryName: '.swagger-ui',
      swaggerUiConfig: {
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          'SwaggerUIBundle.presets.apis',
          'SwaggerUIStandalonePreset',
        ],
        plugins: [
          'SwaggerUIBundle.plugins.DownloadUrl',
        ],
        layout: [
          'StandaloneLayout',
        ],
      },
    },
  },
  resources: {
    Resources: {
      S3BucketApiDocs: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:custom.swaggerUi.s3Bucket}',
          AccessControl: 'PublicRead',
          WebsiteConfiguration: {
            IndexDocument: 'index.html',
          },
        },
      },
      S3BucketPolicyApiDocs: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: {
            Ref: 'S3BucketApiDocs',
          },
          PolicyDocument: {
            Statement: [{
              Action: [
                's3:GetObject',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::Sub': 'arn:aws:s3:::${S3BucketApiDocs}/*',
              },
              Principal: '*',
            }],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
