export const decodeBase64 = (encoded: string) => {
  const buffer = Buffer.from(encoded, 'base64');
  const decoded = buffer.toString('utf8');
  return decoded;
};
