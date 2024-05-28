import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { BadRequestError } from "../error/custom.error.handler.js";
import path from "path";

export const sendResponse = (res, statusCode, message, data) => {
  let responseData = {
    success: true,
    message: message,
    data: data,
  };

  if (statusCode >= 300 && !data) {
    responseData.success = false;
    delete responseData.data;
  }
  return res.status(statusCode).json(responseData);
};
export const paginatedResponse = (data, pageCount, limitCount, totalCount) => {
  const totalPage = limitCount === 0 ? 0 : Math.ceil(totalCount / limitCount);
  return {
    list: data,
    page: pageCount,
    limit: limitCount,
    totalRecords: totalCount,
    totalPage: totalPage,
  };
};
export const search = (search, fields) => {
  if (search) {
    const query = fields
      .map((field, index) => `"${field}" ILIKE '%' || $${1} || '%'`)
      .join(" OR ");
    return { query: query, params: [search] };
  }
  return {
    query: "",
    params: [],
  };
};
export const paginationAndSorting = (query, defaultSorting = "id") => {
  const { page, limit, sortBy, sortOrder } = query;
  const pageCount = Number(page) || 1;
  const limitCount = Number(limit) || 10;
  const sortField = sortBy || defaultSorting;
  const sortOrderValue = sortOrder === "asc" ? "ASC" : "DESC";
  const skip = (pageCount - 1) * limitCount;

  return { pageCount, limitCount, skip, sortField, sortOrderValue };
};

// transitions utils
export const beginTransition = async () => {
  return await pool.query("BEGIN");
};

export const commitTransition = async () => {
  return await pool.query("COMMIT");
};

export const rollBackTransition = async () => {
  return await pool.query("ROLLBACK");
};

export const uploadImages = (files, productId) => {
  const folderPath = `./uploads/${productId}`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const uploadFile = Array.isArray(files.imageUrl)
    ? files.imageUrl
    : [files.imageUrl];

  const filePaths = uploadFile.map((file) => {
    const sanitizedFileName = file.name.replace(/\s+/g, "_");
    const uniqueName = `${uuidv4()}-${sanitizedFileName}`;
    const uploadPath = path.join("uploads", `${productId}`, `${uniqueName}`);
    file.mv(uploadPath, function (err) {
      if (err) {
        throw new BadRequestError("Error moving file", err);
      }
    });

    return uploadPath;
  });

  return filePaths;
};
