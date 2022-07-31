import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3Client } from '@libs/s3-client';
import { importProductsFile } from './handler';

jest.mock('@libs/api-gateway', () => ({
  formatJSONResponse: jest.fn((data) => data),
  formatJSONErrorResponse: jest.fn((statusCode) => statusCode),
}));

jest.mock('@libs/s3-client', () => ({
  getS3Client: jest.fn(),
}));

jest.mock('@aws-sdk/client-s3', () => ({
  PutObjectCommand: jest.fn(),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

const BUCKET_NAME = 'some-bucket-name';
const FILENAME = 'products.csv';
const getMockedSignedUrl = (filename) => `https://${
  BUCKET_NAME}.s3.eu-west-1.amazonaws.com/uploaded/${filename}?signed=parameters`;

describe.skip('createProduct', () => {
  const INITIAL_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    process.env = {
      ...INITIAL_ENV,
      BUCKET_NAME,
    };
  });

  afterAll(() => {
    process.env = INITIAL_ENV;
  });

  it('should return status code 400 if no filename is provided', async () => {
    const event = {
      queryStringParameters: {
        name: '',
      },
    };
    const result = await importProductsFile(event);
    expect(result).toEqual(400);
  });

  it('should return status code 500 on s3 client initialization error', async () => {
    getS3Client.mockImplementation(() => {
      throw new Error('An unknown error happened.');
    });
    const result = await importProductsFile({
      queryStringParameters: { name: FILENAME },
    });
    expect(result).toEqual(500);
  });

  it('should return signedUrl', async () => {
    getS3Client.mockReturnValue(() => undefined);
    PutObjectCommand.mockReturnValue({});
    getSignedUrl.mockReturnValue(Promise.resolve(getMockedSignedUrl(FILENAME)));

    const result = await importProductsFile({
      queryStringParameters: { name: FILENAME },
    });
    expect(result).toEqual(getMockedSignedUrl(FILENAME));
  });
});
