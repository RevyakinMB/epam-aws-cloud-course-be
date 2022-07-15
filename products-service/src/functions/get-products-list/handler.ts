import { APIGatewayProxyHandler } from 'aws-lambda';

import { getMockedProducts } from '@api/index';
import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import { Product } from '@ptypes/product';

const defaultProducts: Product[] = [
  { id: 1, name: 'Product 1', description: 'Description 1', price: 1 },
  { id: 2, name: 'Product 2', description: 'Description 2', price: 2 },
  { id: 3, name: 'Product 3', description: 'Description 3', price: 3 },
];

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
    products = await getMockedProducts();
  } catch (err) {
    return formatJSONErrorResponse(500, err.message || 'An error occurred during data loading.');
  }

  return formatJSONResponse({
    data: products,
    count: products.length,
  });
};
