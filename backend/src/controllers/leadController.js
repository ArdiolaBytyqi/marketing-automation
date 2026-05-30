const Lead = require("../models/Lead");

const getAll = async (req, res, next) => {
  try {
    const { campaignId, status } = req.query;
    const where = {};

    if (campaignId) where.campaignId = campaignId;
    if (status) where.status = status;

    const leads = await Lead.findAll({ where });
    res.json({ success: true, data: leads });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
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

    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await lead.update({ status: req.body.status, notes: req.body.notes });
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await lead.destroy();
    res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, updateStatus, remove };