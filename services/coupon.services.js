import pool from "../config/database.js";

export const createCouponService = async (body) => {
  const query = `
    INSERT INTO coupons (name, code, "startDate", "endDate", quantity, "discountValue","discountType")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const params = [
    body.name,
    body.code,
    body.startDate,
    body.endDate,
    body.quantity, // Ensure quantity is an integer
    body.discountValue,
    body.discountType,
  ];

  const { rows } = await pool.query(query, params);
  return rows;
};

export const getCouponsService = async (filter = {}, operator = "and") => {
  const couponQuery = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(` ${operator} `);

  const whereClause =
    Object.keys(filter).length == 0 ? " " : `and ${couponQuery}`;

  const values = Object.values(filter);

  const queryString = `select * from public.coupons where "isDeleted"= false ${whereClause}`;
  const { rows } = await pool.query(queryString, values);
  return rows;
};

export const updateCouponService = async (
  filter,
  couponData,
  operator = "and"
) => {
  const filterValues = Object.values(filter);
  const filterWhereClause = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(` ${operator} `);

  const categoryValues = Object.values(couponData);
  const categoryWhereClause = Object.entries(couponData)
    .map(([key, value], i) => {
      return `"${key}" = $${filterValues.length + i + 1}`;
    })
    .join(", ");

  const queryText = `
    UPDATE public.coupons
    SET ${categoryWhereClause}
    WHERE "isDeleted" = false and ${filterWhereClause};
  `;
  const queryValues = [...filterValues, ...categoryValues];
  const response = await pool.query(queryText, queryValues);
  return response;
};

export const checkCouponCodeExist = async (
  filter = {},
  couponid,
  operator = "and"
) => {
  const couponQuery = Object.entries(filter)
    .map(([key, value], i) => {
      return `"${key}" = $${i + 1}`;
    })
    .join(` ${operator} `);

  const couponParams = Object.values(filter);
  const queryString = `select * from public.coupons where "isDeleted" = false and ${couponQuery} and id <> ${couponid} `;
  const { rows } = await pool.query(queryString, couponParams);
  return rows;
};

export const isCouponValid = async (couponCode) => {
  const { rows } = await pool.query(
    `SELECT * FROM public.coupons WHERE code = $1 AND "isDeleted" = false AND "isActive" = true`,
    [couponCode]
  );

  if (rows.length === 0) {
    return null;
  }

  const coupon = rows[0];
  const currentDate = new Date();
  const startDate = new Date(coupon.startDate);
  const endDate = new Date(coupon.endDate);
  if (
    startDate > currentDate ||
    endDate < currentDate ||
    coupon.quantity <= 0
  ) {
    return null;
  }
  return coupon;
};

export const applyDiscount = (orderTotal, coupon) => {
  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (coupon.discountValue / 100) * orderTotal;
  } else {
    discount = coupon.discountValue;
  }
  const discountedTotal = Math.round(orderTotal - discount);
  const discountApplied = Math.round(discount);
  return { discountedTotal, discountApplied };
};

export const updateQuantity = async (couponId) => {
  const { rows } = await pool.query(
    `
    UPDATE public.coupons SET quantity = quantity - 1 WHERE id = $1 RETURNING *
    `,
    [couponId]
  );
  return rows;
};
