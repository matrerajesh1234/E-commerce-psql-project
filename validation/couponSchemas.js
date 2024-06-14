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
    .isInt({ min: 0 })
    .withMessage("Quantity must be a positive integer"),

  body("discountType")
    .notEmpty()
    .withMessage("Discount type is required")
    .isString()
    .withMessage("Discount type must be a string")
    .custom((value) => {
      if (value !== "percentage" && value !== "fixed") {
        throw new Error('Discount type must be either "percentage" or "fixed"');
      }
      return true;
    }),
  body("minimumSpend")
    .exists()
    .withMessage("minimumSpend is required")
    .isNumeric()
    .withMessage("minimumSpend must be a number"),

  // Validate maximumSpend
  body("maximumSpend")
    .exists()
    .withMessage("maximumSpend is required")
    .isNumeric()
    .withMessage("maximumSpend must be a number"),

  // Validate perLimit
  body("perLimit")
    .exists()
    .withMessage("perLimit is required")
    .isInt({ min: 1 })
    .withMessage("perLimit must be a positive integer"),

  // Validate perCustomer
  body("perCustomer")
    .exists()
    .withMessage("perCustomer is required")
    .isInt({ min: 1 })
    .withMessage("perCustomer must be a positive integer"),
];
