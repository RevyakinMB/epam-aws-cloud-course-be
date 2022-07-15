import { APIGatewayProxyHandler } from 'aws-lambda';

import { getMockedProducts } from '@api/index';
import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import { Product } from '@ptypes/product';

export const getProductsList: APIGatewayProxyHandler = async () => {
  let products: Product[];
  try {
    products = await getMockedProducts();
  } catch (err) {
    return formatJSONErrorResponse(500, err.message || 'An error occurred during data loading.');
  }

  return formatJSONResponse({
    data: products,
    count: products.length,
  });
};
