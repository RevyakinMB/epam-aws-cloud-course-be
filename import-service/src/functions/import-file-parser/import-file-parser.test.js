import fs from 'fs';
import { GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { getS3Client } from '@libs/s3-client';
import { getSqsClient } from '@libs/sqs-client';
import { importFileParser } from './handler';

jest.mock('@libs/api-gateway', () => ({
  formatJSONResponse: jest.fn((data) => data),
  formatJSONErrorResponse: jest.fn((statusCode) => statusCode),
}));

jest.mock('@libs/s3-client', () => ({
  getS3Client: jest.fn(),
}));

jest.mock('@libs/sqs-client', () => ({
  getSqsClient: jest.fn(),
}));

jest.mock('@aws-sdk/client-s3', () => ({
  GetObjectCommand: jest.fn(),
  CopyObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
}));

jest.mock('@aws-sdk/client-sqs', () => ({
  SendMessageCommand: jest.fn(),
}));

const BUCKET_NAME = 'some-bucket-name';
const SQS_URL = 'https://sqs.region.amazonaws.com/1323/sqs';

describe('createProduct', () => {
  const INITIAL_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    process.env = {
      ...INITIAL_ENV,
      BUCKET_NAME,
      SQS_URL,
    };
  });

  afterAll(() => {
    process.env = INITIAL_ENV;
  });

  it('should parse and move file', async () => {
    const send = jest.fn((command) => {
      if (command.type === 'GetObject') {
        return Promise.resolve({
          Body: fs.createReadStream(`${__dirname}/mocks/testFile.csv`),
        });
      }
      return Promise.resolve({});
    });

    getS3Client.mockReturnValue({ send });
    getSqsClient.mockReturnValue({ send });
    GetObjectCommand.mockReturnValue({ type: 'GetObject' });
    CopyObjectCommand.mockReturnValue({ type: 'CopyObject' });
    DeleteObjectCommand.mockReturnValue({ type: 'DeleteObject' });
    SendMessageCommand.mockReturnValue({ type: 'SendMessage' });

    const result = await importFileParser({
      Records: [{
        s3: {
          object: {
            key: 'testFile.csv',
          },
        },
      }],
    });
    expect(result).toEqual({ statusCode: 200 });
    expect(send).toHaveBeenNthCalledWith(2, { type: 'SendMessage' });
    expect(send).toHaveBeenNthCalledWith(4, { type: 'CopyObject' });
    expect(send).toHaveBeenNthCalledWith(5, { type: 'DeleteObject' });
  });
});
