import { body, param } from "express-validator";

// Validation rules
export const validateCategoryCreation = [
  body("productName")
    .notEmpty()
    .withMessage("Product name cannot be empty")
    .isString()
    .withMessage("Product name must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 255 })
    .withMessage("Description length should not exceed 255 characters"),
  body("productDetails")
    .notEmpty()
    .withMessage("Product details cannot be empty")
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
    .withMessage("Color cannot be empty")
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
];

export const validateProduct = [
  param("id").isNumeric().withMessage("ID must be a numeric"),
];

export const validateUpdateProduct = [
  body("productName").notEmpty().withMessage("Product name is required"),
  param("id").isNumeric().withMessage("Id must be a numeric"),
];
