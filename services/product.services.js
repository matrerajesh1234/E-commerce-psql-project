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

export const filterPagination = async (searchResult) => {
  const searchParams = searchResult.params;
  const whereClause = searchResult.query ? `WHERE ${searchResult.query}` : " ";
  const baseUrl = process.env.BASEURL;
  const searchQuery = `
    SELECT p.id, p."productName", p."description", p."productDetails", p."price", p."color",p."rating",p."reviews",p."brand",
      (
        SELECT json_agg(json_build_object('id', pr.id, 'categoryName', c."categoryName"))
        FROM productcategoryrelation pr
        LEFT JOIN categories c ON pr."categoryId" = c.id
        WHERE pr."productId" = p.id 
      ) AS Categories,
      (
        SELECT json_agg(json_build_object('id', i.id, 'imageUrl', $${
          searchParams.length + 1
        } || i."imageUrl"))
        FROM imageproducts i
        WHERE i."productId" = p.id
      ) AS images
    FROM products p
    LEFT JOIN productcategoryrelation pr ON pr."productId" = p.id
    LEFT JOIN categories c ON pr."categoryId" = c.id
    LEFT JOIN imageproducts i ON i."productId" = p.id
    ${whereClause}
    GROUP BY p.id, p."productName", p."description", p."productDetails", p."price", p."color",p."rating",p."reviews",p."brand"
  `;

  const queryParams = [...searchResult.params, baseUrl];
  const { rows: totalRecords } = await pool.query(searchQuery, queryParams);
  const totalResultCount = totalRecords.length;
  return totalResultCount;
};

export const paginateFilteredResults = async (pagination, searchQuery) => {
  const { skip, limitCount, sortField, sortOrderValue } = pagination;
  const searchQueryString = searchQuery.query;
  const baseUrl = process.env.BASEURL;
  const searchParams = searchQuery.params;
  const whereClause = searchQueryString ? `WHERE ${searchQueryString}` : " ";

  const finalQueryString = `
    SELECT p.id, p."productName", p."description", p."productDetails", p."price", p."color",p."rating",p."reviews",p."brand",
      (
        SELECT json_agg(json_build_object('id', pr.id, 'categoryName', c."categoryName"))
        FROM productcategoryrelation pr
        LEFT JOIN categories c ON pr."categoryId" = c.id
        WHERE pr."productId" = p.id 
      ) AS Categories,
      (
        SELECT json_agg(json_build_object('id', i.id, 'imageUrl', $${
          searchParams.length + 1
        } || i."imageUrl"))
        FROM imageproducts i
        WHERE i."productId" = p.id
      ) AS images
    FROM products p
    LEFT JOIN productcategoryrelation pr ON pr."productId" = p.id
    LEFT JOIN categories c ON pr."categoryId" = c.id
    LEFT JOIN imageproducts i ON i."productId" = p.id
    ${whereClause}
    GROUP BY p.id, p."productName", p."description", p."productDetails", p."price", p."color",p."rating",p."reviews",p."brand"
    ORDER BY $${searchParams.length + 2} , $${searchParams.length + 3}
    LIMIT  $${searchParams.length + 4} offset $${searchParams.length + 5}
  `;

  const queryParams = [
    ...searchParams,
    baseUrl,
    sortField,
    sortOrderValue,
    limitCount,
    skip,
  ];

  const { rows } = await pool.query(finalQueryString, queryParams);
  const productResult = rows;
  return productResult;
};
