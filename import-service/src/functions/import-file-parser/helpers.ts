export const validateEnvProps = (env: Record<string, unknown>) => {
  const { BUCKET_NAME, SQS_URL } = env;
  if (!BUCKET_NAME) {
    throw new Error('Bucket name is not specified.');
  }
  if (!SQS_URL) {
    throw new Error('SQS URL is not specified.');
  }
};
