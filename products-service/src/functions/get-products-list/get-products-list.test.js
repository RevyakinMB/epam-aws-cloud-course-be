import { getProductsList } from './handler';
import { defaultProducts, getProducts } from '@api/index';

const products = [
    { id: '1001', title: 'P1001', description: '', price: 199.9, count: 2 },
    { id: '1002', title: 'P1002', description: '', price: 299.9, count: 3 },
];

jest.mock('@api/index', () => ({
    ...jest.requireActual('@api/index'),
    getProducts: jest.fn(() => Promise.resolve(products)),
}));

jest.mock('@libs/api-gateway', () => ({
    formatJSONResponse: jest.fn((product) => product),
    formatJSONErrorResponse: jest.fn((errorCode) => errorCode),
}));

describe('get-product-by-id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return list of products', async () => {
        const event = {};
        const result = await getProductsList(event);
        expect(result).toEqual({
            data: products,
            count: products.length,
        });
    });

    it('should avoid data provider if skipDataProvider query param is provided', async () => {
        const event = {
            queryStringParameters: {
                skipDataProvider: true,
            },
        };
        const result = await getProductsList(event);
        expect(result).toEqual({
            data: defaultProducts,
            count: defaultProducts.length,
        });
        expect(getProducts).not.toHaveBeenCalled();
    });
});
