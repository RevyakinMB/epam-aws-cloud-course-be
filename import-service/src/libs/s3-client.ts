import { S3Client } from '@aws-sdk/client-s3';

let s3Client: S3Client;

export const getS3Client = () => {
  if (s3Client) {
    return s3Client;
  }

  const { REGION_ID } = process.env;
  if (!REGION_ID) {
    throw new Error('Region is not specified.');
  }

  s3Client = new S3Client({ region: REGION_ID });
  // TODO: consider s3Client.destroy();
  return s3Client;
};
