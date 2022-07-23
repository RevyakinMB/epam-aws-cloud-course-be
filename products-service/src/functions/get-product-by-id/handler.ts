import { APIGatewayProxyHandler } from 'aws-lambda';

import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import { getProduct } from '@src/data';
import { end } from '@src/db';
import { Product } from '@src/types/product';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { productId } = event.pathParameters || {};
  if (!productId) {
    return formatJSONErrorResponse(400, 'No product id provided.');
  }

  let product: Product | null = null;
  try {
    product = await getProduct(productId);
  } catch (err) {
    console.error(err);
    return formatJSONErrorResponse(500, 'An error occurred during data loading.');
  } finally {
    end().catch((e) => console.error(e));
  }

  if (!product) {
    return formatJSONErrorResponse(404, 'Product not found.');
  }
  return formatJSONResponse(product);
};
