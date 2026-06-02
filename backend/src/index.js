require("dotenv").config();
require("./models/User");
require("./models/Campaign");
require("./models/Lead");
require("./models/EmailLog");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { sequelize, connectMongo } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const auditLogger = require("./middleware/auditLogger");
const logger = require("./config/logger");
const { client } = require("./config/metrics");
const metricsMiddleware = require("./middleware/metricsMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const leadRoutes = require("./routes/leadRoutes");
const emailRoutes = require("./routes/emailRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(auditLogger);
app.use(metricsMiddleware);

// Rate Limiting
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
}));

// Swagger Docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/campaigns", campaignRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/emails", emailRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Marketing Automation API running!" });
});

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  await connectMongo();
  await sequelize.authenticate();
  logger.info("PostgreSQL connected");
  await sequelize.sync({ alter: true });
  logger.info("PostgreSQL tables synced");
});