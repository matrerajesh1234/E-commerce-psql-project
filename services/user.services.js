import pool from "../config/database.js";

export const insertuser = async (username, email, password) => {
  const { rows } = await pool.query(
    `INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *`,
    [username, email, password]
  );
  return rows;
};

export const updateuser = async (filter, userData, operator = "and") => {
  const filterParams = Object.values(filter);
  const filterQuery = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(`${operator}`);

  const userParams = Object.values(userData);
  const userQuery = Object.entries(userData)
    .map(([key, value], i) => {
      return `"${key}" = $${filterParams.length + i + 1}`;
    })
    .join(", ");

  const queryText = `
    UPDATE users
    SET ${userQuery}
    WHERE "isDeleted" = false and ${filterQuery};
  `;

  const queryValues = [...filterParams, ...userParams];
  const response = await pool.query(queryText, queryValues);
  return response;
};

export const userExistsCheck = async (
  filter = {},
  productid,
  operator = "and"
) => {
  const userQuery = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(`${operator}`);

  const userParams = Object.values(filter);
  const queryString = `select * from users where "isDeleted" = false and ${userQuery} and id <> ${productid} `;
  const { rows } = await pool.query(queryString, userParams);
  return rows;
};

export const getusers = async (filter = {}, operator = "and") => {
  const userQuery = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(` ${operator} `);

  const whereClause =
    Object.keys(filter).length == 0 ? " " : `and ${userQuery}`;

  const values = Object.values(filter);
  const queryString = `select * from public.users where "isDeleted"= false ${whereClause}`;
  const { rows } = await pool.query(queryString, values);
  return rows;
};
