import pool from "../config/database.js";

export const orderCreateService = async (
  userId,
  totalAmount,
  discount,
  finalAmount,
  shippingCost,
  grandTotal,
  status,
  shippingAddress
) => {
  const query = `
    INSERT INTO orders ("userId", "totalAmount", discount, "shippingCost", "grandTotal", status, "shippingAddress")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const params = [
    userId,
    totalAmount,
    discount,
    shippingCost,
    grandTotal,
    status,
    shippingAddress,
  ];
  const { rows } = await pool.query(query, params);
  return rows;
};

export const orderItemService = async (
  orderId,
  productId,
  productName,
  price,
  quantity,
  amount
) => {
  const query = `
    INSERT INTO orderItems ("orderId", "productId", "productName", price, quantity, amount)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const params = [orderId, productId, productName, price, quantity, amount];

  const { rows } = await pool.query(query, params);
  return rows[0];
};

export const getOrderListService = async (userId) => {
  const query = `
  SELECT
        o.id AS orderId,
        o."userId",
        o."totalAmount",
        o.discount,
        o."shippingCost",
        o."grandTotal",
        o.status,
        o."shippingAddress" AS address,
        o."createdAt",
        json_agg(
          json_build_object(
            'itemId', oi.id,
            'productId', oi."productId",
            'productName', p."productName",
            'price', oi.price,
            'quantity', oi.quantity
          )
        ) AS items
      FROM
        orders o
      JOIN
        orderItems oi ON o.id = oi."orderId"
      JOIN
        products p ON oi."productId" = p.id
      WHERE
        o."userId" = $1
      GROUP BY
        o.id
      ORDER BY
        o."createdAt" DESC;
    `;
  const params = [userId];
  const { rows } = await pool.query(query, params);
  console.log(rows);
  return rows;
};
