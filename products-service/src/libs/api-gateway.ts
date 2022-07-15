import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    body: JSON.stringify(response),
    statusCode: 200,
  };
};

export const formatJSONErrorResponse = (
  statusCode: number = 500,
  message: string
) => {
  return {
    body: JSON.stringify({ message }),
    statusCode,
  };
};
