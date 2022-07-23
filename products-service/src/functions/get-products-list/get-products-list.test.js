import { getProductsList } from './handler';
import { getClient } from '@src/db';

const products = [
    { id: '1001', title: 'P1001', description: '', price: 199.9, count: 2 },
    { id: '1002', title: 'P1002', description: '', price: 299.9, count: 3 },
];

jest.mock('@libs/api-gateway', () => ({
    formatJSONResponse: jest.fn((data) => data),
    formatJSONErrorResponse: jest.fn((errorCode) => errorCode),
}));

jest.mock('@src/db', () => ({
    getClient: jest.fn(),
}));

describe('get-product-by-id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return list of products', async () => {
        getClient.mockReturnValue(Promise.resolve({
            query: () => Promise.resolve({ rows: products }),
            end: () => Promise.resolve(),
        }));
        const result = await getProductsList();
        expect(result).toEqual({
            data: products,
            count: products.length,
        });
    });

    it('should return 500 error code on database connection failure', async () => {
        getClient.mockReturnValue(Promise.resolve({
            query: () => Promise.reject({ message: 'sql query error' }),
            end: () => Promise.resolve(),
        }));
        const result = await getProductsList();
        expect(result).toEqual(500);
    });

    it('should return 500 error code on database query failure', async () => {
        getClient.mockReturnValue(Promise.reject({ errno: -4078 }));
        const result = await getProductsList();
        expect(result).toEqual(500);
    });
});
