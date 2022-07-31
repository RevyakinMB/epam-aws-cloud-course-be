// eslint-disable-next-line import/no-extraneous-dependencies
import { APIGatewayProxyHandler } from 'aws-lambda';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import { getS3Client } from '@libs/s3-client';
import logger from '@src/utils/logger';
import { SIGNED_URL_EXPIRES_IN } from '@functions/constants';
import { getObjectName } from './helpers';

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  const { name } = event.queryStringParameters || {};
  logger.log(`importProductsFile fired, name = ${name || '<empty string>'}.`);
  if (!name) {
    return formatJSONErrorResponse(400, 'No filename provided.');
  }

  const { BUCKET_NAME } = process.env;
  if (!BUCKET_NAME) {
    return formatJSONErrorResponse(400, 'Bucket name is not specified.');
  }

  let s3Client;
  try {
    s3Client = getS3Client();
  } catch (err) {
    logger.error(err);
    return formatJSONErrorResponse(500, err);
  }

  const bucketParams: PutObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: getObjectName(name),
  };
  try {
    const command = new PutObjectCommand(bucketParams);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: SIGNED_URL_EXPIRES_IN,
    });
    return formatJSONResponse(signedUrl);
  } catch (err) {
    logger.error(err);
    return formatJSONErrorResponse(500, 'An error occurred during signed URL creation.');
  }
};
