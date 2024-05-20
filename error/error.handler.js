import { sendResponse } from "../utils/services.js";

function errorHandler(err, req, res, next) {
  // next parameter is important to use
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errInfo = {
    stack: err.stack || "",
    route: err.originalUrl || "",
    type: err.name || "",
  };
  return sendResponse(res, statusCode, message, errInfo);
}

export default errorHandler;
