import { query } from "express";
import pool from "../config/database.js";

export const createCategory = async (categoryName) => {
  const { rows } = await pool.query(
    `INSERT INTO public.categories ("categoryName") VALUES($1) RETURNING *`,
    [categoryName]
  );
  return rows;
};

export const categoryExistsCheck = async (
  filter = {},
  productid,
  operator = "and"
) => {
  const categoryQuery = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(`${operator}`);

  const categoryParams = Object.values(filter);
  const queryString = `select * from categories where "isDeleted" = false and ${categoryQuery} and id <> ${productid} `;

  const { rows } = await pool.query(queryString, categoryParams);
  return rows;
};

export const updateCategory = async (
  filter,
  categoryData,
  operator = "and"
) => {
  const filterValues = Object.values(filter);
  const filterWhereClause = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(` ${operator} `);

  const categoryValues = Object.values(categoryData);
  const categoryWhereClause = Object.entries(categoryData)
    .map(([key, value], i) => {
      return `"${key}" = $${filterValues.length + i + 1}`;
    })
    .join(", ");

  const queryText = `
    UPDATE public.categories
    SET ${categoryWhereClause}
    WHERE "isDeleted" = false and ${filterWhereClause};
  `;

  const queryValues = [...filterValues, ...categoryValues];

  const response = await pool.query(queryText, queryValues);
  return response;
};

export const getCategories = async (filter = {}, operator = "and") => {
  const categoryQuery = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(`${operator}`);

  const whereClause =
    Object.keys(filter).length == 0 ? " " : `and ${categoryQuery}`;

  const values = Object.values(filter);
  const queryString = `select * from public.categories where "isDeleted"= false ${whereClause}`;
  const { rows } = await pool.query(queryString, values);
  return rows;
};

