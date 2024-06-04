import { validationResult } from "express-validator";
import { sendResponse } from "../utils/services.js";

export const validateRequest = (schemas) => {
  return async (req, res, next) => {
    // Run all validations provided in schemas
    for (let schema of schemas) {
      await schema.run(req);
    }

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const error = await validationErrors.errors[0].msg;
      return sendResponse(res, 400, error);
    }
    next();
  };
};
