// eslint-disable-next-line import/no-extraneous-dependencies
import { APIGatewayProxyHandler } from 'aws-lambda';

import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import logger from '@src/utils/logger';

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  const { name } = event.pathParameters || {};
  logger.log(`importProductsFile fired, name = ${name}.`);
  if (!name) {
    return formatJSONErrorResponse(400, 'No filename provided.');
  }

  return formatJSONResponse({
    message: 'Hello, welcome to the exciting Serverless world!',
    event,
  });
};
