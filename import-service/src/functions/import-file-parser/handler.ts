// eslint-disable-next-line import/no-extraneous-dependencies
import { Handler, S3Event } from 'aws-lambda';
import { GetObjectCommand, DeleteObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import csv from 'csv-parser';

import { getS3Client } from '@libs/s3-client';
import { getSqsClient } from '@libs/sqs-client';
import logger from '@src/utils/logger';
import { UPLOADED_FOLDER, PARSED_FOLDER, FAILED_FOLDER } from '@functions/constants';
import { ProductPayload } from '@src/types/product';
import { validateEnvProps } from './helpers';

const moveFile = async (objectKey: string, success: boolean) => {
  const moveTo = success ? PARSED_FOLDER : FAILED_FOLDER;
  logger.log('moveFile', objectKey, '->', moveTo);
  const s3Client = getS3Client();

  const copyCommand = new CopyObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    CopySource: `${process.env.BUCKET_NAME}/${objectKey}`,
    Key: objectKey.replace(
      UPLOADED_FOLDER,
      moveTo,
    ),
  });
  await s3Client.send(copyCommand);
  logger.log(`${objectKey} copied to ${moveTo}.`);

  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: objectKey,
  });
  await s3Client.send(deleteCommand);
  logger.log(`Source file ${objectKey} is deleted.`);
};

const sendIntoSqs = async (product: ProductPayload) => {
  try {
    const sqsClient = getSqsClient();
    const command = new SendMessageCommand({
      QueueUrl: process.env.SQS_URL,
      MessageBody: JSON.stringify(product),
    });
    await sqsClient.send(command);
  } catch (err) {
    logger.error(err);
  }
};

const parseFile = async (key) => {
  const s3Client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });
  const file = await s3Client.send(command);

  let success = true;
  try {
    await new Promise((resolve, reject) => {
      file.Body.pipe(csv()).on('data', sendIntoSqs).on('end', resolve).on('error', reject);
    });
  } catch (err) {
    logger.error(err);
    success = false;
  }

  try {
    await moveFile(key, success);
  } catch (err) {
    logger.error(err);
  }
};

export const importFileParser: Handler<S3Event, { statusCode: number }> = async (
  event: S3Event,
) => {
  logger.log('importFileParser fired.');

  try {
    validateEnvProps(process.env);
  } catch (err) {
    logger.error(err);
    return { statusCode: 500 };
  }

  try {
    await event.Records.reduce((p, record) => p.then(
      () => parseFile(record.s3.object.key),
    ), Promise.resolve());
  } catch (err) {
    logger.error(err);
    return { statusCode: err.$metadata?.httpStatusCode || 500 };
  }

  return { statusCode: 200 };
};
