import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.basicAuthorizer`,
  // events: [{
  //   http: {
  //     path: 'token',
  //     method: 'get',
  //     cors: true,
  //     authorizer: {},
  //   },
  // }],
};
