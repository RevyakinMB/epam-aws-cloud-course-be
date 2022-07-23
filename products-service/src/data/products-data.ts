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

export const getProduct = async (productId: string) => {
    const params = [productId];
    const response = await query<Product>(`
      select
        pr.id,
        pr.title,
        pr.description,
        pr.price,
        st.count
      from products pr
      join stocks st on st.product_id = pr.id
      where pr.id = $1`, params);
    return response.rows.length === 1 ? response.rows[0] : null;
};
