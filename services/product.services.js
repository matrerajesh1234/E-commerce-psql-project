import pool from "../config/database.js";

export const createNewProduct = async (
  productName,
  productDetails,
  description,
  price,
  color,
  rating,
  reviews,
  brand
) => {
  const { rows } = await pool.query(
    `INSERT INTO products("productName", "productDetails", "description", "price", "color","rating","reviews","brand") VALUES($1, $2, $3, $4, $5,$6,$7,$8) RETURNING *`,
    [
      productName,
      productDetails,
      description,
      price,
      color,
      rating,
      reviews,
      brand,
    ]
  );
  return rows;
};

export const productFindOne = async (filter, operator = "and") => {
  const keys = Object.keys(filter);
  const values = Object.values(filter);
  const placeholder = keys
    .map((key, i) => `"${key}"= $${i + 1}`)
    .join(` ${operator} `);
  const queryText = `SELECT * FROM products WHERE ${placeholder}`;
  const { rows } = await pool.query(queryText, values);
  return rows[0];
};

export const productList = async () => {
  const { rows } = await pool.query(`select * from products`);
  return rows;
};

export const updateProduct = async (filter, operator = "and", productData) => {
  const filterKeys = Object.keys(filter);
  const filterValues = Object.values(filter);
  const filterPlaceholders = filterKeys
    .map((key, i) => `"${key}"=$${i + 1}`)
    .join(` ${operator} `);

  const productDataKeys = Object.keys(productData);
  const productDataValues = Object.values(productData);
  const productDataPlaceholders = productDataKeys
    .map((key, i) => `"${key}"=$${filterValues.length + i + 1}`)
    .join(", ");

  const queryText = `
      UPDATE products
      SET ${productDataPlaceholders}
      WHERE ${filterPlaceholders};
    `;

  const queryValues = [...filterValues, ...productDataValues];

  const response = await pool.query(queryText, queryValues);
  return response;
};

export const deleteProduct = async (filter, operator = "and") => {
  const keys = Object.keys(filter);
  const values = Object.values(filter);
  const placeholder = keys
    .map((key, i) => `${key} = $${i + 1}`)
    .join(` ${operator}`);
  const queryText = `delete from products where ${placeholder}`;
  const { rows } = await pool.query(queryText, values);
  return rows;
};
