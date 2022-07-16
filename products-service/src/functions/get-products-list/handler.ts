import { APIGatewayProxyHandler } from 'aws-lambda';

import { getProducts, defaultProducts } from '@api/index';
import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import { Product } from '@ptypes/product';

export const getProductsList: APIGatewayProxyHandler = async (event) => {
  // an escape hatch for the case when dummy data provider refuses to work
  const { skipDataProvider } = event.queryStringParameters || {};
  if (skipDataProvider) {
    return formatJSONResponse({
      data: defaultProducts,
      count: defaultProducts.length,
    });
  }

  let products: Product[];
  try {
    products = await getProducts();
  } catch (err) {
    return formatJSONErrorResponse(500, err.message || 'An error occurred during data loading.');
  }

  return formatJSONResponse({
    data: products,
    count: products.length,
  });
};
