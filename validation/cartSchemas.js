  import { body } from "express-validator";

  export const validateAddToCart = [
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
