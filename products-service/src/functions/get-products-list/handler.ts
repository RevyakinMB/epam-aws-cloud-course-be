import { APIGatewayProxyHandler } from 'aws-lambda';

import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import { getProducts } from '@src/data';
import { end } from '@src/db';
import { Product } from '@src/types/product';

export const getProductsList: APIGatewayProxyHandler = async () => {
  let products: Product[];

  try {
    products = await getProducts();
  } catch (err) {
    console.error(err);
    return formatJSONErrorResponse(500, 'An error occurred during data loading.');
  } finally {
    end().catch((e) => console.error(e));
  }

  return formatJSONResponse({
    data: products,
    count: products.length,
  });
};
