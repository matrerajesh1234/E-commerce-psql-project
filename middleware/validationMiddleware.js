import { validationResult } from "express-validator";
import { sendResponse } from "../utils/services.js";

export const validateRequest = () => {
  return (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.errors.map((error) => error.msg);
      const formattedErrors = errors.length > 1 ? errors : errors[0];
      return sendResponse(res, 400, formattedErrors);
    }
    next(); 
  };
};
