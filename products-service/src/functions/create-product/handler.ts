import { APIGatewayProxyHandler } from 'aws-lambda';

import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import { createNewProduct } from '@src/data';
import { end } from '@src/db';
import { ProductPayload } from '@src/types/product';
import { HttpError } from '@src/utils/errors';

export const createProduct: APIGatewayProxyHandler = async (event) => {
  let product: ProductPayload;
  try {
    product = JSON.parse(event.body);
  } catch (err) {
    console.error(err);
    return formatJSONErrorResponse(400, 'Invalid request.');
  }

  try {
    await createNewProduct(product);
  } catch (err) {
    if (err instanceof HttpError && err.statusCode === 400) {
      return formatJSONErrorResponse(400, 'Invalid request.');
    }

    console.error(err);
    return formatJSONErrorResponse(500, 'An error occurred during product creation.');
  } finally {
    end().catch((e) => console.error(e));
  }

  return formatJSONResponse({ success: true }, 201);
};
