/* eslint-disable no-template-curly-in-string */
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [{
    s3: {
      bucket: '${self:custom.s3BucketName}',
      event: 's3:ObjectCreated:*',
      existing: true,
      rules: [{
        prefix: 'uploaded/',
      }],
    },
  }],
};
