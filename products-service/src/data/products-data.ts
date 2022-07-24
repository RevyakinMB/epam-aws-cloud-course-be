import { query, execInTx } from '@src/db';
import { Product, ProductPayload } from '@src/types/product';
import { HttpError } from '@src/utils/errors';

export const getProducts = async () => {
  const response = await query<Product>(`
    select
      pr.id,
      pr.title,
      pr.description,
      pr.price,
      st.count
    from products pr
    join stocks st on st.product_id = pr.id`);
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

export const createNewProduct = async (product: ProductPayload) => {
  if (!product.title || !product.description || product.price < 0) {
    throw new HttpError(400, 'Invalid product payload');
  }

  return execInTx(async (tx) => {
    const params = [product.title, product.description, product.price];
    const result = await tx.query(`
      insert into products (
        title, description, price
      ) values (
        $1, $2, $3
      ) returning id`, params);
    await tx.query(`
      insert into stocks (
        product_id,
        count
      ) values ($1, $2)`, [result.rows[0].id, 0]);
  });
};
