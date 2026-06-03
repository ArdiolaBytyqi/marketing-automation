jest.mock("../config/db", () => ({
  sequelize: { authenticate: jest.fn(), sync: jest.fn() },
  connectMongo: jest.fn(),
}));

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
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
const authRoutes = require("../routes/authRoutes");
const errorHandler = require("../middleware/errorHandler");

const app = express();
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use(errorHandler);

describe("Auth Routes", () => {
  describe("POST /api/v1/auth/register", () => {
    it("should return 400 if name is missing", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: "test@test.com", password: "Test1234" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if email is invalid", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "Test", email: "invalid-email", password: "Test1234" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if password is too weak", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "Test", email: "test@test.com", password: "weak" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should return 400 if email is missing", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ password: "Test1234" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if password is missing", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "test@test.com" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
