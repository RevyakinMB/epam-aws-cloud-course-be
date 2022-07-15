import axios from 'axios';

import { MockedEmployee, Product } from '@ptypes/product';

const DUMMY_DATA_URL = 'https://hub.dummyapis.com/employee?noofRecords=10&idStarts=1001';

export const getMockedProducts = async () => {
    const response = await axios.get<MockedEmployee[]>(DUMMY_DATA_URL);
    const products: Product[] = response.data.map(
        ({ id, firstName, lastName, salary, contactNumber }) => ({
            id,
            title: `${firstName} ${lastName}`,
            description: contactNumber,
            price: salary,
            count: 5,
        }),
    );
    return products;
};
