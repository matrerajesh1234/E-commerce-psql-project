import { sendResponse } from "../utils/services.js";
export const validationMiddleware = (schemas) => {
  return (req, res, next) => {
    const errors = [];

    // Validate body
    if (schemas.body) {
      const { error } = schemas.body.validate(req.body, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map((err) => err.message));
      }
    }

    // Validate params
    if (schemas.params) {
      const { error } = schemas.params.validate(req.params, {
        abortEarly: false,
      });
      if (error) {
        errors.push(...error.details.map((err) => err.message));
      }
    }

    // Validate query
    if (schemas.query) {
      const { error } = schemas.query.validate(req.query, {
        abortEarly: false,
      });
      if (error) {
        errors.push(...error.details.map((err) => err.message));
      }
    }

    // Validate files
    if (schemas.files) {
      const { error } = schemas.files.validate(req.files, {
        abortEarly: false,
      });
      if (error) {
        errors.push(...error.details.map((err) => err.message));
      }
    }

    if (errors.length === 0) {
      next();
    } else {
      return sendResponse(res, 400, errors);
    }
  };
};
