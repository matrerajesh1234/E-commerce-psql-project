import { body } from "express-validator";

export const validateCreateCoupon = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .isString()
    .withMessage("Code must be a string"),

  body("startDate").notEmpty().withMessage("Start date is required"),
  body("endDate").notEmpty().withMessage("End date is required"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("discountType")
    .notEmpty()
    .withMessage("Discount type is required")
    .isString()
    .withMessage("Discount type must be a string"),

  body("freeShipping")
    .notEmpty()
    .withMessage("Free shipping status is required")
    .isBoolean()
    .withMessage("Free shipping must be a boolean"),
];
