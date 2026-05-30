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

const sendEmail = async (req, res, next) => {
  try {
    const { leadId, campaignId, templateId } = req.body;

    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const template = await EmailTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const body = template.body.replace("{{name}}", lead.name);

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: lead.email,
      subject: template.subject,
      html: body,
    });

    await EmailLog.create({
      leadId,
      campaignId,
      subject: template.subject,
      status: "sent",
      sentAt: new Date(),
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    await EmailLog.create({
      leadId: req.body.leadId,
      campaignId: req.body.campaignId,
      subject: "Unknown",
      status: "failed",
    });
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