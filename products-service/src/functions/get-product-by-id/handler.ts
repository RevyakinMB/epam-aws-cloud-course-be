import { APIGatewayProxyHandler } from 'aws-lambda';

import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import { Product } from '@src/types/product';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { productId } = event.pathParameters || {};
  if (!productId) {
    return formatJSONErrorResponse(400, 'No product id provided.');
  }

  let products: Product[];
  try {
    products = [];
  } catch (err) {
    return formatJSONErrorResponse(
      err.code || 500,
      err.message || 'An error occurred during data loading.',
    );
  }

  const product = products.find(({ id }) => productId === id);
  if (!product) {
    return formatJSONErrorResponse(404, 'Product not found');
  }
  return formatJSONResponse(product);
};
