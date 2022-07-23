import { query } from '@src/db';
import { Product } from '@src/types/product';

export const getProducts = async () => {
    const response = await query<Product>(`
      select
        pr.id,
        pr.title,
        pr.description,
        pr.price,
        st.count
      from products pr
      join stocks st on st.product_id = pr.id`,
    );
    return response.rows;
};
