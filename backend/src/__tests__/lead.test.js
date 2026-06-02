jest.mock("../config/db", () => ({
  sequelize: { authenticate: jest.fn(), sync: jest.fn() },
  connectMongo: jest.fn(),
}));

jest.mock("../models/Lead", () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
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

jest.mock("../middleware/auth", () => () => (req, res, next) => {
  req.user = { id: "test-id", role: "admin" };
  next();
});

const leadRoutes = require("../routes/leadRoutes");

const app = express();
app.use(express.json());
app.use("/api/v1/leads", leadRoutes);
app.use(errorHandler);

describe("Lead Routes", () => {
  describe("POST /api/v1/leads", () => {
    it("should return 400 if name is missing", async () => {
      const res = await request(app)
        .post("/api/v1/leads")
        .send({ email: "test@test.com", campaignId: "550e8400-e29b-41d4-a716-446655440000" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if email is invalid", async () => {
      const res = await request(app)
        .post("/api/v1/leads")
        .send({ name: "Test", email: "invalid", campaignId: "550e8400-e29b-41d4-a716-446655440000" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if campaignId is not UUID", async () => {
      const res = await request(app)
        .post("/api/v1/leads")
        .send({ name: "Test", email: "test@test.com", campaignId: "not-a-uuid" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PUT /api/v1/leads/:id/status", () => {
    it("should return 400 if status is invalid", async () => {
      const res = await request(app)
        .put("/api/v1/leads/some-id/status")
        .send({ status: "invalid-status" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});