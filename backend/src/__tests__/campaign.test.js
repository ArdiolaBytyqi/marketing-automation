jest.mock("../config/db", () => ({
  sequelize: { authenticate: jest.fn(), sync: jest.fn() },
  connectMongo: jest.fn(),
}));

jest.mock("../models/Campaign", () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../config/redis", () => ({
  get: jest.fn(),
  set: jest.fn(),
  setEx: jest.fn(),
  ping: jest.fn(),
  on: jest.fn(),
  connect: jest.fn(),
}));

const request = require("supertest");
const express = require("express");
const errorHandler = require("../middleware/errorHandler");

// Mock auth middleware
jest.mock("../middleware/auth", () => () => (req, res, next) => {
  req.user = { id: "test-id", role: "admin" };
  next();
});

const campaignRoutes = require("../routes/campaignRoutes");

const app = express();
app.use(express.json());
app.use("/api/v1/campaigns", campaignRoutes);
app.use(errorHandler);

describe("Campaign Routes", () => {
  describe("POST /api/v1/campaigns", () => {
    it("should return 400 if title is missing", async () => {
      const res = await request(app)
        .post("/api/v1/campaigns")
        .send({ description: "Test" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if title is too short", async () => {
      const res = await request(app)
        .post("/api/v1/campaigns")
        .send({ title: "A" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if budget is negative", async () => {
      const res = await request(app)
        .post("/api/v1/campaigns")
        .send({ title: "Test Campaign", budget: -100 });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PUT /api/v1/campaigns/:id", () => {
    it("should return 400 if no fields provided", async () => {
      const res = await request(app)
        .put("/api/v1/campaigns/some-id")
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});