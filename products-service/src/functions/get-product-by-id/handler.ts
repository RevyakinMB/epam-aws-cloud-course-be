// eslint-disable-next-line import/no-extraneous-dependencies
import { APIGatewayProxyHandler } from 'aws-lambda';

import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import { getProduct } from '@src/data';
import { end } from '@src/db';
import { Product } from '@src/types/product';
import logger from '@src/utils/logger';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { productId } = event.pathParameters || {};
  logger.log(`getProductById fired, productId = ${productId}.`);
  if (!productId) {
    return formatJSONErrorResponse(400, 'No product id provided.');
  }

  let product: Product | null = null;
  try {
    product = await getProduct(productId);
  } catch (err) {
    logger.error(err);
    return formatJSONErrorResponse(500, 'An error occurred during data loading.');
  } finally {
    end().catch((e) => logger.error(e));
  }

  if (!product) {
    return formatJSONErrorResponse(404, 'Product not found.');
  }
  return formatJSONResponse(product);
};
