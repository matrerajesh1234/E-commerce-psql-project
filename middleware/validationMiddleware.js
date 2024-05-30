import { validationResult } from "express-validator";
import { sendResponse } from "../utils/services.js";

export const validateRequest = () => {
  return (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.errors[0].msg;
      return sendResponse(res, 400, errors);
    }
    next();
  };
};
