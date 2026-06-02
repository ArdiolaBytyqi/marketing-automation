const { httpRequestCounter, httpRequestDuration } = require("../config/metrics");

const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const route = req.route?.path || req.path;

    httpRequestCounter.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });

    httpRequestDuration.observe(
      { method: req.method, route, status: res.statusCode },
      duration
    );
  });

  next();
};

module.exports = metricsMiddleware;