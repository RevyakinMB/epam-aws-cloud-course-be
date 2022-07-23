import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.createProduct`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        responseData: {
          201: 'A new product created',
          400: 'Invalid product data',
          500: 'Internal server error',
        },
      },
    },
  ],
};
