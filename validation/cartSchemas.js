import { body,param } from "express-validator";

export const validateAddToCart = [
  body("categoryId")
    .notEmpty()
    .withMessage("Category is required")
    .isNumeric()
    .withMessage("Product Id must be a numeric value"),
  body("productId")
    .notEmpty()
    .withMessage("Product is required")
    .isNumeric()
    .withMessage("Product ID must be a numeric value"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

export const validateCartId = [
  param("id").isNumeric().withMessage("ID must be a numeric"),
];
