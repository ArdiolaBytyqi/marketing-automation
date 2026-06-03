const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/db");
const redisClient = require("../config/redis");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    services: {
      postgresql: "unknown",
      mongodb: "unknown",
      redis: "unknown",
    },
  };

  // Check PostgreSQL
  try {
    await sequelize.authenticate();
    health.services.postgresql = "ok";
  } catch {
    health.services.postgresql = "error";
    health.status = "degraded";
  }

  // Check MongoDB
  try {
    const state = mongoose.connection.readyState;
    health.services.mongodb = state === 1 ? "ok" : "error";
    if (state !== 1) health.status = "degraded";
  } catch {
    health.services.mongodb = "error";
    health.status = "degraded";
  }

  // Check Redis
  try {
    await redisClient.ping();
    health.services.redis = "ok";
  } catch {
    health.services.redis = "error";
    health.status = "degraded";
  }

  const statusCode = health.status === "ok" ? 200 : 503;
  res.status(statusCode).json(health);
});

module.exports = router;
