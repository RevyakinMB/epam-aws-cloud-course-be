import { getProductById } from './handler';
import { defaultProducts, getProducts } from '@api/index';

const product = { id: '1001', title: 'P1001', description: '', price: 199.9, count: 2 };

jest.mock('@api/index', () => ({
    ...jest.requireActual('@api/index'),
    getProducts: jest.fn(() => Promise.resolve([product])),
}));

jest.mock('@libs/api-gateway', () => ({
    formatJSONResponse: jest.fn((product) => product),
    formatJSONErrorResponse: jest.fn((errorCode) => errorCode),
}));

describe('get-product-by-id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return product by product id', async () => {
        const event = {
            pathParameters: { productId: product.id },
        };
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
        const result = await getProductById(event);
        expect(result).toBe(404);
    });

    it('should avoid data provider if skipDataProvider query param is provided', async () => {
        const event = {
            pathParameters: { productId: defaultProducts[0].id },
            queryStringParameters: {
                skipDataProvider: 'skipDataProvider',
            },
        };
        const result = await getProductById(event);
        expect(result).toBe(defaultProducts[0]);
        expect(getProducts).not.toHaveBeenCalled();
    });
});
