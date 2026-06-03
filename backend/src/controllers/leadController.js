const Lead = require("../models/Lead");

const getAll = async (req, res, next) => {
  try {
    const { campaignId, status } = req.query;
    const where = {};

    if (campaignId) where.campaignId = campaignId;
    if (status) where.status = status;

    const leads = await Lead.findAll({ where });
    return res.json({ success: true, data: leads });
  } catch (err) {
    return next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    return res.json({ success: true, data: lead });
  } catch (err) {
    return next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, email, phone, campaignId, notes } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      campaignId,
      notes,
      assignedTo: req.user.id,
    });

    return res.status(201).json({ success: true, data: lead });
  } catch (err) {
    return next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await lead.update({ status: req.body.status, notes: req.body.notes });
    return res.json({ success: true, data: lead });
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await lead.destroy();
    return res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getAll, getOne, create, updateStatus, remove };