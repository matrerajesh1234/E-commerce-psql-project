import { query } from "express";
import pool from "../config/database.js";

export const createCategory = async (categoryName) => {
  const { rows } = await pool.query(
    `INSERT INTO public.categories ("categoryName") VALUES($1) RETURNING *`,
    [categoryName]
  );
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
    WHERE ${filterWhereClause};
  `;

  const queryValues = [...filterValues, ...categoryValues];

  const response = await pool.query(queryText, queryValues);
  return response;
};

export const getAllCategories = async () => {
  const { rows } = await pool.query(`SELECT * FROM public.categories`);
  return rows;
};

export const categoryFindOne = async (filter, operator = "and") => {
  const values = Object.values(filter);
  const whereClause = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(` ${operator} `);
  const queryString = `SELECT * FROM public.categoires WHERE ${whereClause}`;
  const { rows } = await pool.query(queryString, values);
  return rows;
};

export const getCategories = async (filter = {}, operator = "and") => {
  const categoryQuery = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(`${operator}`);

  const whereClause = filter == {} ? " " : `where ${categoryQuery}`;

  const values = Object.values(filter);
  const queryString = `select * from public.categories ${whereClause}`;
  const { rows } = await pool.query(queryString, values);
  return rows;
};
export const deleteCategory = async (filter, operator = "and") => {
  const whereClause = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(`${operator}`);
  const values = Object.values(filter);
  const queryString = `delete from public.categories where ${whereClause}`;
  const { rows } = await pool.query(queryString, values);
  return rows;
};
