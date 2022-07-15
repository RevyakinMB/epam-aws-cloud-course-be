import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const corsHeaders = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  },
};

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    body: JSON.stringify(response),
    ...corsHeaders,
    statusCode: 200,
  };
};

export const formatJSONErrorResponse = (
  statusCode: number = 500,
  message: string
) => {
  return {
    body: JSON.stringify({ message }),
    ...corsHeaders,
    statusCode,
  };
};
