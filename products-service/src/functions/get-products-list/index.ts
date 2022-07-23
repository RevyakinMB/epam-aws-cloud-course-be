import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsList`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        responseData: {
          200: {
            description: 'Regular response',
            bodyType: 'ProductListResponse',
          },
          500: 'Internal server error',
        },
      },
    },
  ],
};
