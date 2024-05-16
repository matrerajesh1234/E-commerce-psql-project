function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const stack = err.stack || "";
  const route = req.originalUrl || "";
  const type = err.name || "";

  return res.status(statusCode).json({
    success: false,
    message: message,
    data: {
      stack: stack,
      route: route,
      type: type,
    },
  });
}

export default errorHandler;
