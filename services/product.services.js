import pool from "../config/database.js";

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

export const uploadImage = async (files, productInfo) => {
  const whereClause = files
    .map((file, index) => {
      return `($${index * 2 + 1},$${index * 2 + 2})`;
    })
    .join(", ");

  const imageParams = files
    .map((file) => {
      return [productInfo, file.path];
    })
    .flat();

  const imageQueryString = `INSERT INTO imageProducts("productId","imageUrl") VALUES ${whereClause}`;
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

export const updateProduct = async (filter, productData, operator = "and") => {
  const filterValues = Object.values(filter);
  const filterWhereClause = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(`${operator}`);

  const productDataValues = Object.values(productData);
  const productWhereClause = Object.entries(productData)
    .map(([key, value], i) => {
      return `"${key}" = $${filterValues.length + i + 1}`;
    })
    .join(`${operator}`);

  const queryText = `
    UPDATE public.products
    SET ${productWhereClause}
    WHERE ${filterWhereClause};
  `;

  const queryValues = [...filterValues, ...productDataValues];

  const response = await pool.query(queryText, queryValues);
  return response;
};

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
