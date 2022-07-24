import { getProduct } from '@src/data';
import { getProductById } from './handler';

jest.mock('@libs/api-gateway', () => ({
  formatJSONResponse: jest.fn((product) => product),
  formatJSONErrorResponse: jest.fn((errorCode) => errorCode),
}));

jest.mock('@src/db', () => ({
  end: jest.fn(() => Promise.resolve()),
}));

jest.mock('@src/data', () => ({
  getProduct: jest.fn(),
}));

const product = {
  id: '164f8ac9-051a-4310-8485-3bef23f5d097',
  title: 'P1001',
  description: '',
  price: 199.9,
  count: 2,
};

describe('get-product-by-id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return product by product id', async () => {
    const event = {
      pathParameters: { productId: product.id },
    };
    getProduct.mockReturnValue(Promise.resolve(product));
    const result = await getProductById(event);
    expect(result).toBe(product);
  });

  it('should return an error with 400 status code if id is not provided', async () => {
    const event = {
      pathParameters: null,
    };
    const result = await getProductById(event);
    expect(result).toBe(400);
  });

  it('should return an error with 404 status code if id is not provided', async () => {
    const event = {
      pathParameters: { productId: 'NON_EXISTENT' },
    };
    getProduct.mockReturnValue(Promise.resolve(null));
    const result = await getProductById(event);
    expect(result).toBe(404);
  });
});
