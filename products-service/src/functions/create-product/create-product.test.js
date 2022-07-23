import { main } from './handler';
import { createNewProduct } from '@src/data';
import { HttpError } from '@src/utils/errors';

const product = { id: '1001', title: 'P1001', description: '', price: 199.9, count: 2 };

jest.mock('@libs/api-gateway', () => ({
  formatJSONResponse: jest.fn((data, statusCode) => statusCode),
  formatJSONErrorResponse: jest.fn((statusCode) => statusCode),
}));

jest.mock('@src/db', () => ({
  end: jest.fn(() => Promise.resolve()),
}));

jest.mock('@src/data', () => ({
  createNewProduct: jest.fn(),
}));

describe('createProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 status code if provided valid input', async () => {
    const event = {
      body: JSON.stringify(product),
    }
    createNewProduct.mockReturnValue(Promise.resolve());
    const result = await main(event);
    expect(result).toEqual(201);
  });

  it('should return 400 status code on invalid product payload', async () => {
    const event = {
      body: JSON.stringify({ ...product, title: '' }),
    };
    createNewProduct.mockReturnValue(Promise.reject(new HttpError(400, 'Error')));
    const result = await main(event);
    expect(result).toEqual(400);
  });

  it('should return 500 status code on error during product creation', async () => {
    const event = {
      body: JSON.stringify(product),
    };
    createNewProduct.mockReturnValue(Promise.reject('An error.'));
    const result = await main(event);
    expect(result).toEqual(500);
  });
});
