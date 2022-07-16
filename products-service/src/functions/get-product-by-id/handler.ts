import { APIGatewayProxyHandler } from 'aws-lambda';

import { defaultProducts, getProducts } from '@api/index';
import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import { Product } from '@ptypes/product';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { productId } = event.pathParameters || {};
  if (!productId) {
    return formatJSONErrorResponse(400, 'No product id provided.');
  }

  let products: Product[];
  const { skipDataProvider } = event.queryStringParameters || {};
  if (skipDataProvider) {
    products = defaultProducts;
  } else {
    try {
      products = await getProducts();
    } catch (err) {
      return formatJSONErrorResponse(
        err.code || 500,
        err.message || 'An error occurred during data loading.',
      );
    }
  }

  const product = products.find(({ id }) => productId === id);
  if (!product) {
    return formatJSONErrorResponse(404, 'Product not found');
  }
  return formatJSONResponse(product);
};
