import { SNSClient } from '@aws-sdk/client-sns';

let snsClient: SNSClient;

export const getSnsClient = () => {
  if (snsClient) {
    return snsClient;
  }

  const { REGION_ID } = process.env;
  if (!REGION_ID) {
    throw new Error('Region is not specified.');
  }

  snsClient = new SNSClient({ region: REGION_ID });
  return snsClient;
};
