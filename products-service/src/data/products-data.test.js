import { createNewProduct, getProduct, getProducts } from './products-data';
import { execInTx, query } from '@src/db';
import { HttpError } from '@src/utils/errors';

const products = [
    { id: '1001', title: 'P1001', description: '', price: 199.9, count: 2 },
    { id: '1002', title: 'P1002', description: '', price: 299.9, count: 3 },
];

jest.mock('@src/db', () => ({
    query: jest.fn(),
    execInTx: jest.fn(),
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

describe('createNewProduct', () => {
  const product = { title: 'title', description: 'description', price: 5 };

  it('should throw on empty title', async () => {
    execInTx.mockReturnValue(Promise.resolve());
    expect(createNewProduct({ ...product, title: '' })).rejects.toThrow(HttpError);
  });

  it('should throw on empty description', async () => {
    execInTx.mockReturnValue(Promise.resolve());
    expect(createNewProduct({ ...product, description: '' })).rejects.toThrow(HttpError);
  });

  it('should throw on invalid price', async () => {
    execInTx.mockReturnValue(Promise.resolve());
    expect(createNewProduct({ ...product, price: -4 })).rejects.toThrow(HttpError);
  });

  it('should not throw on valid product payload', async () => {
    execInTx.mockReturnValue(Promise.resolve());
    expect(createNewProduct(product)).resolves.not.toThrow();
  });
});