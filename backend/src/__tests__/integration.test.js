jest.mock("../config/redis", () => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn().mockResolvedValue(1),
  ping: jest.fn(),
  on: jest.fn(),
  connect: jest.fn(),
}));

jest.mock("../config/db", () => ({
  sequelize: { authenticate: jest.fn(), sync: jest.fn() },
  connectMongo: jest.fn(),
}));

jest.mock("../middleware/auth", () => () => (req, res, next) => {
  req.user = { id: "550e8400-e29b-41d4-a716-446655440000", role: "admin" };
  next();
});

const mockCampaign = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Test Campaign",
  status: "draft",
  budget: 1000,
  update: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
};

const mockLead = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "John Doe",
  email: "john@test.com",
  status: "new",
  campaignId: "550e8400-e29b-41d4-a716-446655440000",
  update: jest.fn().mockResolvedValue(true),
};

jest.mock("../models/Campaign", () => ({
  findAll: jest.fn().mockResolvedValue([mockCampaign]),
  findByPk: jest.fn().mockResolvedValue(mockCampaign),
  create: jest.fn().mockResolvedValue(mockCampaign),
}));

jest.mock("../models/Lead", () => ({
  findAll: jest.fn().mockResolvedValue([mockLead]),
  findByPk: jest.fn().mockResolvedValue(mockLead),
  create: jest.fn().mockResolvedValue(mockLead),
  count: jest.fn().mockResolvedValue(1),
}));

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  findAll: jest.fn().mockResolvedValue([]),
  findByPk: jest.fn(),
  create: jest.fn(),
}));

const request = require("supertest");
const express = require("express");
const errorHandler = require("../middleware/errorHandler");
const auditLogger = require("../middleware/auditLogger");

const campaignRoutes = require("../routes/campaignRoutes");
const leadRoutes = require("../routes/leadRoutes");
const authRoutes = require("../routes/authRoutes");

const app = express();
app.use(express.json());
app.use(auditLogger);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/campaigns", campaignRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use(errorHandler);

// ─── CAMPAIGN INTEGRATION TESTS ───────────────────────────
describe("Campaign Integration", () => {
  it("GET /api/v1/campaigns → should return list", async () => {
    const res = await request(app).get("/api/v1/campaigns");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/v1/campaigns → should create campaign", async () => {
    const res = await request(app)
      .post("/api/v1/campaigns")
      .send({ title: "New Campaign", status: "draft", budget: 500 });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/v1/campaigns → should fail without title", async () => {
    const res = await request(app)
      .post("/api/v1/campaigns")
      .send({ budget: 500 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/v1/campaigns/:id → should return one campaign", async () => {
    const res = await request(app)
      .get("/api/v1/campaigns/550e8400-e29b-41d4-a716-446655440000");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("PUT /api/v1/campaigns/:id → should update campaign", async () => {
    const res = await request(app)
      .put("/api/v1/campaigns/550e8400-e29b-41d4-a716-446655440000")
      .send({ title: "Updated Campaign" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("DELETE /api/v1/campaigns/:id → should delete campaign", async () => {
    const res = await request(app)
      .delete("/api/v1/campaigns/550e8400-e29b-41d4-a716-446655440000");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ─── LEAD INTEGRATION TESTS ───────────────────────────────
describe("Lead Integration", () => {
  it("GET /api/v1/leads → should return list", async () => {
    const res = await request(app).get("/api/v1/leads");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/v1/leads → should create lead", async () => {
    const res = await request(app)
      .post("/api/v1/leads")
      .send({
        name: "John Doe",
        email: "john@test.com",
        campaignId: "550e8400-e29b-41d4-a716-446655440000",
        status: "new",
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/v1/leads → should fail without campaignId", async () => {
    const res = await request(app)
      .post("/api/v1/leads")
      .send({ name: "John", email: "john@test.com" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("PUT /api/v1/leads/:id/status → should update status", async () => {
    const res = await request(app)
      .put("/api/v1/leads/550e8400-e29b-41d4-a716-446655440001/status")
      .send({ status: "contacted" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("PUT /api/v1/leads/:id/status → should fail with invalid status", async () => {
    const res = await request(app)
      .put("/api/v1/leads/550e8400-e29b-41d4-a716-446655440001/status")
      .send({ status: "invalid" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── AUTH INTEGRATION TESTS ───────────────────────────────
describe("Auth Integration", () => {
  it("POST /api/v1/auth/register → should fail with weak password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Test", email: "test@test.com", password: "weak" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/v1/auth/login → should fail without email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ password: "Test1234" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});