import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        cors: true,
        path: 'products',
        bodyType: 'ProductRequestBody',
        responseData: {
          201: 'A new product created',
          400: 'Invalid product data',
          500: 'Internal server error',
        },
      },
    },
  ],
};
