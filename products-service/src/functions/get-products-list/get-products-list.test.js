import { getProductsList } from './handler';
import { getProducts } from '@src/data';

const products = [
    { id: '1001', title: 'P1001', description: '', price: 199.9, count: 2 },
    { id: '1002', title: 'P1002', description: '', price: 299.9, count: 3 },
];

jest.mock('@libs/api-gateway', () => ({
    formatJSONResponse: jest.fn((data) => data),
    formatJSONErrorResponse: jest.fn((errorCode) => errorCode),
}));

jest.mock('@src/db', () => ({
    end: jest.fn(() => Promise.resolve()),
}));

jest.mock('@src/data', () => ({
    getProducts: jest.fn(),
}));

describe('get-product-by-id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return list of products', async () => {
        getProducts.mockReturnValue(Promise.resolve(products));
        const result = await getProductsList();
        expect(result).toEqual({
            data: products,
            count: products.length,
        });
    });

    it('should return 500 error code on database query failure', async () => {
        getProducts.mockReturnValue(Promise.reject({ message: 'sql query error' }));
        const result = await getProductsList();
        expect(result).toEqual(500);
    });
});
