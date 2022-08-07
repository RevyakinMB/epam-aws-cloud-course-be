// eslint-disable-next-line import/no-extraneous-dependencies
import { SQSEvent, SQSHandler, SQSBatchItemFailure } from 'aws-lambda';
import { PublishCommand, MessageAttributeValue, SNSClient } from '@aws-sdk/client-sns';

import { getSnsClient } from '@libs/sns-client';
import { createNewProduct } from '@src/data';
import { ProductPayload } from '@src/types/product';
import logger from '@src/utils/logger';

type ProcessedMessage = {
  title: string;
  price: number;
  messageId: string;
  handled: boolean;
};

const notify = async (processedMessages: ProcessedMessage[]) => {
  const { CATALOG_NOTIFICATION_TOPIC_ARN } = process.env;
  if (!CATALOG_NOTIFICATION_TOPIC_ARN) {
    logger.error('No catalog notification topic ARN provided.');
    return;
  }

  const successfullySavedMessages = processedMessages.filter((item) => item.handled);
  if (!successfullySavedMessages.length) {
    return;
  }

  let client: SNSClient;
  try {
    client = getSnsClient();
  } catch (err) {
    logger.error(err);
    return;
  }

  const message = `New products added to the database: ${
    successfullySavedMessages.map((product) => `"${product.title}"`).join(',')
  }.`;

  const messageAttributes: Record<string, MessageAttributeValue> = {
    maxPrice: {
      DataType: 'Number',
      StringValue: `${successfullySavedMessages.reduce(
        (max, { price }) => Math.max(price, max),
        0,
      )}`,
    },
  };

  logger.log('Sending notification:', message, 'with attributes', messageAttributes);
  const command = new PublishCommand({
    Subject: 'New products',
    Message: message,
    TopicArn: process.env.CATALOG_NOTIFICATION_TOPIC_ARN,
    MessageAttributes: messageAttributes,
  });

  try {
    await client.send(command);
  } catch (err) {
    logger.error(err);
  }
};

export const catalogBatchProcess: SQSHandler = async (
  event: SQSEvent,
) => {
  logger.log('catalogBatchProcess fired, amount of items received:', event.Records.length);

  const processedMessages: ProcessedMessage[] = await Promise.all(
    event.Records.map(async (record) => {
      let productPayload: ProductPayload;
      try {
        productPayload = JSON.parse(record.body);
      } catch (err) {
        logger.error('Invalid product payload provided:', record.body);
        return {
          title: '',
          price: 0,
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
          title: productPayload.title,
          price: productPayload.price,
          messageId: record.messageId,
          handled: false,
        };
      }

      logger.log(`New product "${productPayload.title}" successfully imported into the database.`);
      return {
        title: productPayload.title,
        price: productPayload.price,
        messageId: record.messageId,
        handled: true,
      };
    }),
  );

  const batchItemFailures: SQSBatchItemFailure[] = processedMessages
    .filter((item) => !item.handled)
    .map((item) => ({
      itemIdentifier: item.messageId,
    }));

  await notify(processedMessages);

  if (batchItemFailures.length) {
    logger.log('Providing failed items back to the queue', batchItemFailures);
  }
  return {
    batchItemFailures,
  };
};
