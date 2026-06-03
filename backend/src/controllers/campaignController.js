const Campaign = require("../models/Campaign");
const redisClient = require("../config/redis");

const getAll = async (req, res, next) => {
  try {
    const cached = await redisClient.get("campaigns");
    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached),
        fromCache: true,
      });
    }

    const campaigns = await Campaign.findAll();
    await redisClient.setEx("campaigns", 300, JSON.stringify(campaigns));

    return res.json({ success: true, data: campaigns });
  } catch (err) {
    return next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    return res.json({ success: true, data: campaign });
  } catch (err) {
    return next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, budget } = req.body;

    const campaign = await Campaign.create({
      title,
      description,
      startDate,
      endDate,
      budget,
      createdBy: req.user.id,
    });

    await redisClient.del("campaigns");

    return res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    await campaign.update(req.body);
    await redisClient.del("campaigns");

    return res.json({ success: true, data: campaign });
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    await campaign.destroy();
    await redisClient.del("campaigns");

    return res.json({ success: true, message: "Campaign deleted" });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };