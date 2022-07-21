import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsList`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        responseData: {
          200: 'Regular response',
          500: 'Internal server error',
        },
        queryStringParameters: {
          skipDataProvider: {
            type: 'string',
            required: false,
            description: 'An option to skip dummy data provider',
          },
        },
      },
    },
  ],
};
