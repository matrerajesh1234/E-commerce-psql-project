import { body, param } from "express-validator";

// Validation rules
export const validateCategory = [
  body("categoryName").notEmpty().withMessage("Category name is required"),
];

export const validateCategoryId = [
  param("id").isNumeric().withMessage("ID must be a numeric"),
];

export const validateUpdateCategory =[
  body('categoryName').notEmpty().withMessage("Category name is required"),
  param("id").isNumeric().withMessage("Id must be a numeric")
]


