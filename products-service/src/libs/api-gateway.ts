import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

const CORS_HEADERS = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
  },
};

export const formatJSONResponse = (response: Record<string, unknown>, statusCode = 200) => ({
  body: JSON.stringify(response),
  ...CORS_HEADERS,
  statusCode,
});

export const formatJSONErrorResponse = (
  statusCode: number,
  message: string,
) => ({
  body: JSON.stringify({ message }),
  ...CORS_HEADERS,
  statusCode,
});
