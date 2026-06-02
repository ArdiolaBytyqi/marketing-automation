const nodemailer = require("nodemailer");
const EmailLog = require("../models/EmailLog");
const EmailTemplate = require("../models/EmailTemplate");
const Lead = require("../models/Lead");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const emailQueue = require("../services/emailQueue");

const sendEmail = async (req, res, next) => {
  try {
    const { leadId, campaignId, templateId } = req.body;

    // Add to queue instead of sending directly
    await emailQueue.add(
      { leadId, campaignId, templateId },
      {
        attempts: 3,        // retry 3 here if fails
        backoff: 5000,      // wait 5 seconds between retries
        removeOnComplete: true,
      }
    );

    res.json({ success: true, message: "Email queued successfully" });
  } catch (err) {
    next(err);
  }
};

const getTemplates = async (req, res, next) => {
  try {
    const templates = await EmailTemplate.find({ isActive: true });
    res.json({ success: true, data: templates });
  } catch (err) {
    next(err);
  }
};

const createTemplate = async (req, res, next) => {
  try {
    const { name, subject, body, variables } = req.body;

    const template = await EmailTemplate.create({
      name,
      subject,
      body,
      variables,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: template });
  } catch (err) {
    next(err);
  }
};

const getLogs = async (req, res, next) => {
  try {
    const { campaignId } = req.query;
    const where = {};
    if (campaignId) where.campaignId = campaignId;

    const logs = await EmailLog.findAll({ where });
    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendEmail, getTemplates, createTemplate, getLogs };