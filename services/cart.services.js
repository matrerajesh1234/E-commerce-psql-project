import pool from "../config/database.js";

// Function to get a specific cart item for a user
export const getCartItem = async (userId, id) => {
  const query = `
    SELECT * FROM public.cart
    WHERE "userId" = $1 AND "id" = $2 
  `;
  const params = [userId, id];
  console.log(query, params);
  const { rows } = await pool.query(query, params);
  return rows;
};

// Function to update the quantity of a product in the user's cart
export const updateCartItem = async (userId, productId, quantity = 1) => {
  const query = `
    UPDATE public.cart
    SET quantity = $3
    WHERE "userId" = $1 AND "productId" = $2 
    RETURNING *
  `;
  const params = [userId, productId, quantity];
  const { rows: updatedRows } = await pool.query(query, params);
  return updatedRows;
};

export const addCartItem = async (userId, productId, quantity = 1) => {
  const query = `
    INSERT INTO public.cart ("userId", "productId", quantity)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const params = [userId, productId, quantity];
  const { rows: insertedRows } = await pool.query(query, params);
  return insertedRows;
};

export const getUserCartItems = async (userId) => {
  const query = `
    SELECT
      c.id,
      c."userId",
      c."productId",
      pcr."categoryId",
      p."productName",
      p."description",
      p.color,
      p."productDetails",
      p.brand,
      p.price,
      c.quantity,
      (
        SELECT '${process.env.BASEURL}' || i."imageUrl"
        FROM imageproducts i
        WHERE i."productId" = p.id
        LIMIT 1
      ) AS imageUrl,
      p.price * c.quantity as "Amount"
    FROM
      products p
    LEFT JOIN
      cart c ON c."productId" = p.id
    LEFT JOIN
      productcategoryrelation pcr ON p.id = pcr."productId"
    WHERE c."userId" = $1
  `;
  const params = [userId];
  const { rows } = await pool.query(query, params);
  return rows;
};

export const clearUserCart = async (userId) => {
  const query = `
    DELETE FROM cart
    WHERE "userId" = $1
  `;
  const params = [userId];
  const { rows } = await pool.query(query, params);
  return rows;
};

export const removeCartItem = async (userId, id) => {
  const query = `
    DELETE FROM cart
    WHERE "userId" = $1 AND "id" = $2
  `;
  const params = [userId, id];
  const { rows } = await pool.query(query, params);
  return rows;
};

export const totalCartCount = async (data) => {
  const totalAmount = data.reduce((sum, item) => sum + item.Amount, 0);

  return {
    list: data,
    totalAmount: totalAmount,
  };
};
