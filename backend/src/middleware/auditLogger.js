const logger = require("../config/logger");

const auditLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("API Request", {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      userId: req.user?.id || "anonymous",
      userRole: req.user?.role || "none",
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      duration: `${duration}ms`,
    });
  });

  next();
};

module.exports = auditLogger;
