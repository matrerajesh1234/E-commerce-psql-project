import { body, param, query } from "express-validator";
import { BadRequestError } from "../error/custom.error.handler.js";

// Validation rules
export const validateProductCreation = [
  body("productName")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 255 })
    .withMessage("Description length should not exceed 255 characters"),
  body("productDetails")
    .notEmpty()
    .withMessage("Product details are required")
    .isString()
    .withMessage("Product details must be a string")
    .isLength({ max: 255 })
    .withMessage("Product details length should not exceed 255 characters"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price should be a positive number"),
  body("color")
    .notEmpty()
    .withMessage("Color is required")
    .matches(/^#[0-9a-fA-F]{6}$/)
    .withMessage("Color should be in hexadecimal format like #ffffff"),
  body("rating")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Rating should be a positive number"),
  body("reviews")
    .optional()
    .isString()
    .withMessage("Review should be a string"),
  body("brand").optional().isString().withMessage("Brand should be a string"),
  body("categoryId").custom(async (value) => {
    if (value == "") {
      throw new BadRequestError("Category cannot be empty");
    } else if (typeof value === "string") {
      if (!/^[0-9]+$/.test(value)) {
        throw new BadRequestError("Category id must be in integer format");
      }
    } else if (Array.isArray(value)) {
      if (value.length < 1) {
        throw new Error("At least one Category Id is required");
      }
      value.forEach((val) => {
        if (!/^[0-9]+$/.test(val)) {
          throw new Error("Category Id must be in integer format");
        }
      });
    } else {
      throw new BadRequestError("Category Id is required");
    }
  }),
  body("imageUrl").custom((value, { req }) => {
    if (!req.files || !req.files.imageUrl) {
      throw new BadRequestError("Image is required");
    }

    const imageUrl = req.files.imageUrl;

    if (Array.isArray(imageUrl)) {
      imageUrl.forEach((file, index) => {
        const supportedFormats = ["image/jpeg", "image/png", "image/gif"];
        const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

        if (!supportedFormats.includes(file.mimetype)) {
          throw new BadRequestError(
            `Unsupported image format for file ${index + 1}`
          );
        }

        if (file.size > maxSizeInBytes) {
          throw new BadRequestError(
            `File size exceeds the limit for file ${index + 1}`
          );
        }
      });
    } else {
      const file = imageUrl;
      const supportedFormats = ["image/jpeg", "image/png", "image/gif"];
      const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

      if (!supportedFormats.includes(file.mimetype)) {
        throw new BadRequestError("Unsupported image format");
      }

      if (file.size > maxSizeInBytes) {
        throw new BadRequestError("File size exceeds the limit");
      }
    }
    return true;
  }),
];

export const validateProductId = [
  param("id").isNumeric().withMessage("ID must be a numeric"),
];

export const validateQueryParams = [
  query("search")
    .optional()
    .isString()
    .withMessage("Search query must be a string")
    .isLength({ max: 255 })
    .withMessage("Search query length should not exceed 255 characters"),
  query("page")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Page number must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Limit must be a positive integer"),
  query("sortBy")
    .optional()
    .isString()
    .withMessage("SortBy field must be a string")
    .isLength({ max: 255 })
    .withMessage("SortBy field length should not exceed 255 characters"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("SortOrder must be either 'asc' or 'desc'"),
];

export const validateUpdateProduct = [
  body("productName")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 255 })
    .withMessage("Description length should not exceed 255 characters"),
  body("productDetails")
    .notEmpty()
    .withMessage("Product details are required")
    .isString()
    .withMessage("Product details must be a string")
    .isLength({ max: 255 })
    .withMessage("Product details length should not exceed 255 characters"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price should be a positive number"),
  body("color")
    .notEmpty()
    .withMessage("Color is required")
    .matches(/^#[0-9a-fA-F]{6}$/)
    .withMessage("Color should be in hexadecimal format like #ffffff"),
  body("rating")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Rating should be a positive number"),
  body("reviews")
    .optional()
    .isString()
    .withMessage("Review should be a string"),
  body("brand").optional().isString().withMessage("Brand should be a string"),
  body("categoryId").custom(async (value) => {
    if (value == "") {
      throw new BadRequestError("Category cannot be empty");
    } else if (typeof value === "string") {
      if (!/^[0-9]+$/.test(value)) {
        throw new BadRequestError("Category id must be integer format");
      }
    } else if (Array.isArray(value)) {
      if (value.length < 1) {
        throw new BadRequestError("At least one Category Id is required");
      }
      value.forEach((val) => {
        if (!/^[0-9]+$/.test(val)) {
          throw new BadRequestError("Category Id must be in integer format");
        }
      });
    } else {
      throw new BadRequestError("Category Id is required");
    }
  }),
  body("imageUrl").custom((value, { req }) => {
    if (!req.files || !req.files.imageUrl) {
      throw new BadRequestError("Image is required");
    }

    const imageUrl = req.files.imageUrl;

    if (Array.isArray(imageUrl)) {
      imageUrl.forEach((file, index) => {
        const supportedFormats = ["image/jpeg", "image/png", "image/gif"];
        const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

        if (!supportedFormats.includes(file.mimetype)) {
          throw new BadRequestError(
            `Unsupported image format for file ${index + 1}`
          );
        }

        if (file.size > maxSizeInBytes) {
          throw new BadRequestError(
            `File size exceeds the limit for file ${index + 1}`
          );
        }
      });
    } else {
      const file = imageUrl;
      const supportedFormats = ["image/jpeg", "image/png", "image/gif"];
      const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

      if (!supportedFormats.includes(file.mimetype)) {
        throw new BadRequestError("Unsupported image format");
      }

      if (file.size > maxSizeInBytes) {
        throw new BadRequestError("File size exceeds the limit");
      }
    }
    return true;
  }),
  param("id").isNumeric().withMessage("ID must be a numeric"),
];
