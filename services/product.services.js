import pool from "../config/database.js";
import {
  BadRequestError,
  NotFoundError,
} from "../error/custom.error.handler.js";

//product service for create product
export const createNewProduct = async (body) => {
  const { rows } = await pool.query(
    `INSERT INTO public.products("productName", "productDetails", "description", "price", "color", "rating", "reviews", "brand") VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      body.productName,
      body.productDetails,
      body.description,
      body.price,
      body.color,
      body.rating,
      body.reviews,
      body.brand,
    ]
  );
  return rows;
};

export const getProductCategory = async (categoryIds) => {
  const categoryArray = Array.isArray(categoryIds)
    ? categoryIds
    : [categoryIds];

  const placeholder = categoryArray
    .map((key, i) => {
      return `$${i + 1}`;
    })
    .join(", ");

  const queryString = `
    SELECT *
    FROM public.categories
    WHERE "isDeleted" = false
    AND id IN (${placeholder})
  `;
  const { rows } = await pool.query(queryString, categoryArray);
  return rows;
};

export const uploadImage = async (filePaths, productId) => {
  const whereClause = filePaths
    .map((file, index) => `($${index * 2 + 1}, $${index * 2 + 2})`)
    .join(", ");
  const imageParams = filePaths.map((filePath) => [productId, filePath]).flat();
  const imageQueryString = `INSERT INTO imageProducts("productId", "imageUrl") VALUES ${whereClause}`;

  const { rows } = await pool.query(imageQueryString, imageParams);
  return rows;
};

export const productRelation = async (body, productInfo) => {
  const categoryId = Array.isArray(body.categoryId)
    ? body.categoryId
    : [body.categoryId];

  const whereClause = categoryId
    .map((_, index) => {
      return `($${index * 2 + 1},$${index * 2 + 2})`;
    })
    .join(", ");

  const categoryParams = categoryId
    .map((categoryId) => {
      return [productInfo, categoryId];
    })
    .flat();

  const productCategoryString = `INSERT INTO productcategoryrelation("productId","categoryId") VALUES ${whereClause}`;

  const { rows } = await pool.query(productCategoryString, categoryParams);
  return rows;
};

//get product services
export const getProducts = async (filter = {}, operator = "and") => {
  const productQuery = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(`${operator}`);

  const whereClause =
    Object.keys(filter).length == 0 ? " " : `where ${productQuery}`;

  const values = Object.values(filter);
  const queryString = `select * from public.products ${whereClause}`;
  const { rows } = await pool.query(queryString, values);
  return rows;
};

export const productExistsCheck = async (filter = {}, id, operator = "AND") => {
  const productQuery = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 2}`; // Using i + 2 because $1 is reserved for id
    })
    .join(` ${operator} `);

  const whereClause =
    Object.keys(filter).length === 0
      ? ""
      : `WHERE ${productQuery} AND id <> $1`;

  const values = Object.values(filter);
  const queryParams = [id, ...values]; // id first, then all filter values

  const queryString = `SELECT * FROM public.products ${whereClause} `;
  const { rows } = await pool.query(queryString, queryParams);
  return rows;
};

//product services for update product
export const updateProduct = async (filter, product) => {
  const filterKey = Object.keys(filter)[0];
  const filterValue = filter[filterKey];
  // Define the update query
  const productQuery = `
    UPDATE public.products
    SET
      "productName" = $2,
      "productDetails" = $3,
      description = $4,
      price = $5,
      color = $6,
      rating = $7,
      reviews = $8,
      brand = $9
    WHERE
      "${filterKey}" = $1;
  `;
  console.log(product.rating)
  console.log(typeof(product.rating))
  // Values to update and the filter value
  const values = [
    filterValue,
    product.productName,
    product.productDetails,
    product.description,
    product.price,
    product.color,
    product.rating,
    product.reviews,
    product.brand,
  ];
  const { rows } = await pool.query(productQuery, values);
  console.log(rows)
  return rows;
};

export const updateImage = async (filePaths, productId) => {
  const data = await pool.query(
    `DELETE FROM imageProducts WHERE "productId" = $1`,
    [productId]
  );
  const whereClause = filePaths
    .map((file, index) => `($${index * 2 + 1}, $${index * 2 + 2})`)
    .join(", ");
  const imageParams = filePaths.map((filePath) => [productId, filePath]).flat();
  const imageQueryString = `INSERT INTO imageProducts("productId", "imageUrl") VALUES ${whereClause}`;

  const { rows } = await pool.query(imageQueryString, imageParams);
  return rows;
};

export const updateProductRelation = async (body, productId) => {
  const categoryId = Array.isArray(body.categoryId)
    ? body.categoryId
    : [body.categoryId];

  await pool.query(
    `DELETE FROM productCategoryRelation WHERE "productId" = $1`,
    [productId]
  );

  // Insert new category relations
  const whereClause = categoryId
    .map((_, index) => `($${index * 2 + 1},$${index * 2 + 2})`)
    .join(", ");
  const categoryParams = categoryId
    .map((categoryId) => [productId, categoryId])
    .flat();
  const productCategoryString = `INSERT INTO productCategoryRelation("productId", "categoryId") VALUES ${whereClause}`;

  const { rows } = await pool.query(productCategoryString, categoryParams);
  return rows;
};

//product listing
export const filterPagination = async (searchResult) => {
  const searchParams = searchResult.params;
  const whereClause = searchResult.query ? `WHERE ${searchResult.query}` : " ";
  const baseUrl = process.env.BASEURL;
  const searchQuery = `
    SELECT p.id, p."productName", p."description", p."productDetails", p."price", p."color", p."rating", p."reviews", p."brand",
    jsonb_agg(DISTINCT jsonb_build_object('id',pr.id,'categoryName',c."categoryName")) as categories,
    jsonb_agg(DISTINCT jsonb_build_object('id',i.id,'imageUrl', $${
      searchParams.length + 1
    } || i."imageUrl")) as imageUrl      
    FROM public.products p
    LEFT JOIN public.productcategoryrelation pr ON pr."productId" = p.id
    LEFT JOIN public.categories c ON pr."categoryId" = c.id
    LEFT JOIN public.imageproducts i ON i."productId" = p.id
    ${whereClause}
    GROUP BY p.id, p."productName", p."description", p."productDetails", p."price", p."color", p."rating", p."reviews", p."brand"
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
  SELECT p.id, p."productName", p."description", p."productDetails", p."price", p."color", p."rating", p."reviews", p."brand",
    jsonb_agg(DISTINCT jsonb_build_object('id', pr.id, 'categoryName', c."categoryName")) AS categories,
    jsonb_agg(DISTINCT jsonb_build_object('id', i.id, 'imageUrl', $${
      searchParams.length + 1
    } || i."imageUrl")) AS images
  FROM public.products p
  LEFT JOIN public.productcategoryrelation pr ON pr."productId" = p.id
  LEFT JOIN public.categories c ON pr."categoryId" = c.id
  LEFT JOIN public.imageproducts i ON i."productId" = p.id
  ${whereClause}
  GROUP BY p.id, p."productName", p."description", p."productDetails", p."price", p."color", p."rating", p."reviews", p."brand"
  ORDER BY $${searchParams.length + 2}, $${searchParams.length + 3}
  LIMIT $${searchParams.length + 4} OFFSET $${searchParams.length + 5}
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

//product delete service
export const deleteProduct = async (filter, operator = "and") => {
  const whereClause = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(`${operator}`);
  const values = Object.values(filter);
  const queryString = `delete from public.products where ${whereClause}`;
  const { rows } = await pool.query(queryString, values);
  return rows;
};

export const productImages = async (productId) => {
  const query = `select "productId", "imageUrl" from imageproducts where "productId" = $1`;
  const params = [productId];
  const { rows } = await pool.query(query, params);
  return rows;
};
