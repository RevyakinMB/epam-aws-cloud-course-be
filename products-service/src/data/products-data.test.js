import { getProduct, getProducts } from './products-data';
import { query } from '@src/db';

const products = [
    { id: '1001', title: 'P1001', description: '', price: 199.9, count: 2 },
    { id: '1002', title: 'P1002', description: '', price: 299.9, count: 3 },
];

jest.mock('@src/db', () => ({
    query: jest.fn(),
}));

describe('getProducts', () => {
    it('should return list of products', async () => {
        query.mockReturnValue(Promise.resolve({ rows: products }));
        const result = await getProducts();
        expect(result).toEqual(products);
    });
});

describe('getProduct', () => {
    it('should return product by id', async () => {
        query.mockReturnValue(Promise.resolve({ rows: products.slice(0, 1) }));
        const result = await getProduct('1001');
        expect(result).toEqual(products[0]);
    });

    it('should return null if product is not found', async () => {
        query.mockReturnValue(Promise.resolve({ rows: [] }));
        const result = await getProduct('1001');
        expect(result).toEqual(null);
    });
});
