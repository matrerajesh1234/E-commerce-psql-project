import { sendResponse } from "../utils/services.js";

export const validationMiddleware = (schema, property) => {
  return (req, res, next) => {
    if (!schema) {
      next();
      return;
    }
    const { error } = schema.validate(req[property]);
    if (!error) {
      next();
    } else {
      const errorMessages = error.details.map((err) => err.message);
      return sendResponse(res, 400, errorMessages[0]);
    }
  };
};
