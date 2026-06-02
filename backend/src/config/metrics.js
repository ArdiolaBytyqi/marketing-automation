const client = require("prom-client");

// Collect default metrics (CPU, memory, etc.)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// HTTP request counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// HTTP request duration
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status"],
  buckets: [10, 50, 100, 200, 500, 1000, 2000],
});

module.exports = { client, httpRequestCounter, httpRequestDuration };