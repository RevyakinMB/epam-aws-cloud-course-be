// eslint-disable-next-line import/no-extraneous-dependencies
import { APIGatewayProxyHandler } from 'aws-lambda';

import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import { getProducts } from '@src/data';
import { end } from '@src/db';
import { Product } from '@src/types/product';
import logger from '@src/utils/logger';

export const getProductsList: APIGatewayProxyHandler = async () => {
  logger.log('getProductsList fired.');
  let products: Product[];

  try {
    products = await getProducts();
  } catch (err) {
    logger.error(err);
    return formatJSONErrorResponse(500, 'An error occurred during data loading.');
  } finally {
    end().catch((e) => logger.error(e));
  }

  return formatJSONResponse({
    data: products,
    count: products.length,
  });
};
