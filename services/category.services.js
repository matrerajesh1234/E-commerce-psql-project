import pool from "../config/database.js";

export const createCategory = async (categoryName) => {
  const { rows } = await pool.query(
    `INSERT INTO categories ("categoryName") values($1) RETURNING *`,
    [categoryName]
  );
  return rows;
};

export const updateCategory = async (
  filter,
  operator = "and",
  categoryData
) => {
  const filterKeys = Object.keys(filter);
  const filterValues = Object.values(filter);
  const filterPlaceholders = filterKeys
    .map((key, i) => `"${key}"=$${i + 1}`)
    .join(` ${operator} `);

  const categoryKeys = Object.keys(categoryData);
  const categoryValues = Object.values(categoryData);
  const categoryPlaceholders = categoryKeys
    .map((key, i) => `"${key}"=$${filterValues.length + i + 1}`)
    .join(", ");

  const queryText = `
    UPDATE categories
    SET ${categoryPlaceholders}
    WHERE ${filterPlaceholders};
  `;

  const queryValues = [...filterValues, ...categoryValues];

  const response = await pool.query(queryText, queryValues);
  return response;
};

export const getAllCategory = async () => {
  const { rows } = await pool.query(`SELECT * FROM categories`);
  return rows;
};

export const categoryFindOne = async (filter, operator = "and") => {
  const keys = Object.keys(filter);
  const values = Object.values(filter);
  const placeholder = keys
    .map((key, i) => `"${key}"=$${i + 1}`)
    .join(` ${operator} `);
  const queryText = `SELECT * FROM categories WHERE ${placeholder}`;
  const { rows } = await pool.query(queryText, values);
  return rows[0];
};

export const deleteCategory = async (filter, operator = "and") => {
  const keys = Object.keys(filter);
  const values = Object.values(filter);
  const placeholder = keys
    .map((key, i) => `"${key}"=$${i + 1}`)
    .join(` ${operator} `);
  const queryText = `DELETE FROM categories WHERE ${placeholder}`;
  const { rows } = await pool.query(queryText, values);
  return rows;
};
