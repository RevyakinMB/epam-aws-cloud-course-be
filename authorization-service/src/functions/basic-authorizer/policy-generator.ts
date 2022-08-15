import type { PolicyDocument } from 'aws-lambda';

export const generatePolicy = (principalId: string, effect: string, arn: string) => {
  const policyDocument: PolicyDocument = {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: arn,
    }],
  };
  return {
    principalId,
    policyDocument,
  };
};
