const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  logger.error("Unhandled Error", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    userId: req.user?.id || "anonymous",
  });

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;