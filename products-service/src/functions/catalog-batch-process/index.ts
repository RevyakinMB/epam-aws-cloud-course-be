import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.catalogBatchProcess`,
  events: [{
    sqs: {
      arn: {
        'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'],
      },
      batchSize: 5,
      enabled: true,
      functionResponseType: 'ReportBatchItemFailures' as const,
    },
  }],
};
