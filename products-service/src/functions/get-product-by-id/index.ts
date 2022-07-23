import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductById`,
  events: [
    {
      http: {
        method: 'get',
        path: '/products/{productId}',
        responseData: {
          200: 'Regular response',
          400: 'No product id provided',
          404: 'Product not found',
          500: 'Internal server error',
        },
      },
    },
  ],
};
