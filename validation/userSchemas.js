import { body, param, query } from "express-validator";
import { BadRequestError } from "../error/custom.error.handler.js";

export const validateUserCreation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Incorrect email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character")
    .matches(/\d/)
    .withMessage("Password must contain at least one numeric character"),
];

export const validateUserId = [
  param("id").isNumeric().withMessage("Id must be numeric")
];

export const validateUpdateUser = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Incorrect email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character")
    .matches(/\d/)
    .withMessage("Password must contain at least one numeric character"),
  param("id").isNumeric().withMessage("Id must be numeric"),
];

export const validationUserLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Incorrect email format"),
  body("password").notEmpty().withMessage("Password is required"),
];
