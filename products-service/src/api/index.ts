import axios from 'axios';

import { MockedEmployee, Product } from '@ptypes/product';

const DUMMY_DATA_URL = 'https://hub.dummyapis.com/employee?noofRecords=10&idStarts=1001';

export const getProducts = async () => {
    const response = await axios.get<MockedEmployee[]>(DUMMY_DATA_URL);
    const products: Product[] = response.data.map(
        ({ id, firstName, lastName, salary, contactNumber }) => ({
            id: `${id}`,
            title: `${firstName} ${lastName}`,
            description: contactNumber,
            price: salary,
            count: 5,
        }),
    );
    return products;
};

export const defaultProducts: Product[] = [
    { id: '1', title: 'Product 1', description: 'Description 1', price: 1, count: 5 },
    { id: '2', title: 'Product 2', description: 'Description 2', price: 2, count: 5 },
    { id: '3', title: 'Product 3', description: 'Description 3', price: 3, count: 5 },
];
