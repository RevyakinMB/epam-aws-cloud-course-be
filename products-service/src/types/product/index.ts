export type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    count: number;
};

export type ProductPayload = Partial<Omit<Product, 'id' | 'count'>>;
