// eslint-disable-next-line import/no-extraneous-dependencies
import { SQSEvent, SQSHandler, SQSBatchItemFailure } from 'aws-lambda';

import { createNewProduct } from '@src/data';
import { ProductPayload } from '@src/types/product';
import logger from '@src/utils/logger';

export const catalogBatchProcess: SQSHandler = async (
  event: SQSEvent,
) => {
  logger.log('catalogBatchProcess fired, amount of items received:', event.Records.length);

  const processedMessages = await Promise.all(event.Records.map(async (record) => {
    let productPayload: ProductPayload;
    try {
      productPayload = JSON.parse(record.body);
    } catch (err) {
      logger.error('Invalid product payload provided:', record.body);
      return {
        messageId: record.messageId,
        handled: false,
      };
    }

    try {
      await createNewProduct(productPayload);
    } catch (err) {
      logger.error(err);
      logger.error('An error happened during product creation:', productPayload);
      return {
        messageId: record.messageId,
        handled: false,
      };
    }

    logger.log(`New product "${productPayload.title}" successfully imported into the database.`);
    return {
      messageId: record.messageId,
      handled: true,
    };
  }));

  const batchItemFailures: SQSBatchItemFailure[] = processedMessages
    .filter((item) => !item.handled)
    .map((item) => ({
      itemIdentifier: item.messageId,
    }));

  if (batchItemFailures.length) {
    logger.log('Providing failed items back to the queue', batchItemFailures);
  }
  return {
    batchItemFailures,
  };
};
