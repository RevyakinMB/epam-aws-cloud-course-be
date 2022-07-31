import fs from 'fs';
import { GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client } from '@libs/s3-client';
import logger from '@src/utils/logger';
import { importFileParser } from './handler';

jest.mock('@libs/api-gateway', () => ({
  formatJSONResponse: jest.fn((data) => data),
  formatJSONErrorResponse: jest.fn((statusCode) => statusCode),
}));

jest.mock('@libs/s3-client', () => ({
  getS3Client: jest.fn(),
}));

const noop = () => undefined;
jest.mock('@src/utils/logger', () => ({
  log: jest.fn(),
  warn: noop,
  error: noop,
}));

jest.mock('@aws-sdk/client-s3', () => ({
  GetObjectCommand: jest.fn(),
  CopyObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
}));

const BUCKET_NAME = 'some-bucket-name';

describe('createProduct', () => {
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
    GetObjectCommand.mockReturnValue({ type: 'GetObject' });
    CopyObjectCommand.mockReturnValue({ type: 'CopyObject' });
    DeleteObjectCommand.mockReturnValue({ type: 'DeleteObject' });
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
    expect(send).toHaveBeenNthCalledWith(2, { type: 'CopyObject' });
    expect(send).toHaveBeenNthCalledWith(3, { type: 'DeleteObject' });
    expect(logger.log).toHaveBeenNthCalledWith(2, {
      title: 'Product name #1',
      description: 'Some product description',
      price: '5.4',
    });
  });
});
