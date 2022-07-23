export type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    count: number;
};

export type ProductPayload = Omit<Product, 'id' | 'count'>;
