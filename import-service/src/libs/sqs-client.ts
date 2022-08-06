import { SQSClient } from '@aws-sdk/client-sqs';

let sqsClient: SQSClient;

export const getSqsClient = () => {
  if (sqsClient) {
    return sqsClient;
  }

  const { REGION_ID } = process.env;
  if (!REGION_ID) {
    throw new Error('Region is not specified.');
  }

  sqsClient = new SQSClient({ region: REGION_ID });
  return sqsClient;
};
