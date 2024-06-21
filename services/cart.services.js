import pool from "../config/database.js";

// Function to get a specific cart item for a user
export const getCartItem = async (userId, productId) => {
  const query = `
    SELECT * FROM public.cart
    WHERE "userId" = $1 AND "productId" = $2 
  `;
  const params = [userId, productId];
  const { rows } = await pool.query(query, params);
  return rows;
};

// Function to update the quantity of a product in the user's cart
export const updateCartItem = async (
  userId,
  productId,
  categoryId,
  quantity
) => {
  const query = `
    UPDATE public.cart
    SET "userId" = $1, "productId" = $2, "categoryId" = $3, quantity = $4
    WHERE "userId" = $5 AND "productId" = $6
    RETURNING *
  `;
  const params = [userId, productId, categoryId, quantity, userId, productId];
  const { rows } = await pool.query(query, params);
  return rows;
};

export const addCartItem = async (
  userId,
  productId,
  categoryId,
  quantity = 1
) => {
  const query = `
    INSERT INTO public.cart ("userId", "productId","categoryId", quantity)
    VALUES ($1, $2,$3,$4)
    RETURNING *
  `;
  const params = [userId, productId, categoryId, quantity];
  const { rows: insertedRows } = await pool.query(query, params);
  return insertedRows;
};

export const getUserCartItems = async (userId, categoryId) => {
  const query = `
    SELECT
      c.id,
      c."userId",
      c."productId",
      c."categoryId",
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

export const removeCartItem = async (userId, productId) => {
  const query = `
    DELETE FROM public.cart
    WHERE "userId" = $1 AND "productId" = $2
  `;
  const params = [userId, productId];
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
