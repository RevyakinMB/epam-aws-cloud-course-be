// eslint-disable-next-line import/no-extraneous-dependencies
import { Handler, S3Event } from 'aws-lambda';
import { GetObjectCommand, DeleteObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import csv from 'csv-parser';

import { getS3Client } from '@libs/s3-client';
import logger from '@src/utils/logger';
import { UPLOADED_FOLDER, PARSED_FOLDER, FAILED_FOLDER } from '@functions/constants';

const moveFile = async (objectKey: string, success: boolean) => {
  logger.log('moveFile', objectKey, success);
  const s3Client = getS3Client();

  const copyCommand = new CopyObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    CopySource: `${process.env.BUCKET_NAME}/${objectKey}`,
    Key: objectKey.replace(
      UPLOADED_FOLDER,
      success ? PARSED_FOLDER : FAILED_FOLDER,
    ),
  });
  await s3Client.send(copyCommand);

  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: objectKey,
  });
  await s3Client.send(deleteCommand);
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
      file.Body.pipe(csv()).on('data', logger.log).on('end', resolve).on('error', reject);
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

  const { BUCKET_NAME } = process.env;
  if (!BUCKET_NAME) {
    logger.error('Bucket name is not specified.');
    return { statusCode: 400 };
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
