import type { APIGatewayTokenAuthorizerHandler, Callback, APIGatewayAuthorizerResult } from 'aws-lambda';

import { authorize } from './authorizer';
import { decodeBase64 } from './decoder';
import { generatePolicy } from './policy-generator';

type ProvideResponsePayload = {
  cb: Callback<APIGatewayAuthorizerResult>;
  errorMessage?: string;
  successMessage?: string;
  login?: string;
  effect?: 'Allow' | 'Deny';
  resource: string;
};
const provideResponse = ({
  cb,
  errorMessage,
  successMessage,
  login,
  effect = 'Deny',
  resource,
}: ProvideResponsePayload) => {
  if (errorMessage) {
    console.error(errorMessage);
  }
  if (successMessage) {
    console.error(successMessage);
  }
  cb(null, generatePolicy(login || '', effect, resource));
};

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (event, _ctx, cb) => {
  console.log('basicAuthorizer fired:', event);

  if (event.type !== 'TOKEN') {
    console.error(`Unexpected event type: ${event.type}.`);
    cb('Unauthorized');
    return;
  }

  const { authorizationToken } = event;
  if (!authorizationToken) {
    provideResponse({
      cb,
      errorMessage: 'No authorizationToken provided.',
      resource: event.methodArn,
    });
    return;
  }

  const [basic, base64EncodedCredendials] = authorizationToken.split(' ');
  if (basic !== 'Basic' || !base64EncodedCredendials) {
    provideResponse({
      cb,
      errorMessage: 'No authorizationToken provided.',
      resource: event.methodArn,
    });
    return;
  }

  const decoded = decodeBase64(base64EncodedCredendials);
  const [login, password] = decoded.split(':');
  if (!login || !password) {
    provideResponse({
      cb,
      errorMessage: 'Invalid authorizationToken format.',
      resource: event.methodArn,
    });
    return;
  }

  try {
    authorize({ login, password });
  } catch (err) {
    provideResponse({
      cb,
      errorMessage: err as string,
      login,
      resource: event.methodArn,
    });
    return;
  }

  provideResponse({
    cb,
    successMessage: `Successfully authorized: ${login}.`,
    login,
    resource: event.methodArn,
    effect: 'Allow',
  });
};
