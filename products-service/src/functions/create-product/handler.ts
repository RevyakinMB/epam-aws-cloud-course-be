import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { formatJSONResponse, formatJSONErrorResponse } from '@libs/api-gateway';
import { createNewProduct } from '@src/data';
import { end } from '@src/db';
import { HttpError } from '@src/utils/errors';

import schema from './schema';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    await createNewProduct(event.body);
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

export const main = middyfy(createProduct);
