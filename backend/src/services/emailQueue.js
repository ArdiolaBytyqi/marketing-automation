const Bull = require("bull");
const nodemailer = require("nodemailer");
const EmailLog = require("../models/EmailLog");
const EmailTemplate = require("../models/EmailTemplate");
const Lead = require("../models/Lead");
const logger = require("../config/logger");

const emailQueue = new Bull("email-queue", {
  redis: {
    host: "enormous-fawn-110739.upstash.io",
    port: 6379,
    password: "gQAAAAAAAbCTAAIgcDFjNDlhOWMxNzZjNTE0YmQ2YTI0Yjc0NTBlYmJhNTNiMA",
    tls: {},
  },
});

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

emailQueue.process(async (job) => {
  const { leadId, campaignId, templateId } = job.data;

  const lead = await Lead.findByPk(leadId);
  if (!lead) throw new Error("Lead not found");

  const template = await EmailTemplate.findById(templateId);
  if (!template) throw new Error("Template not found");

  const body = template.body.replace(/\{\{name\}\}/g, lead.name);

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

  logger.info("Email sent", { leadId, campaignId });
});

emailQueue.on("failed", async (job, err) => {
  logger.error("Email job failed", { jobId: job.id, error: err.message });

  await EmailLog.create({
    leadId: job.data.leadId,
    campaignId: job.data.campaignId,
    subject: "Unknown",
    status: "failed",
  });
});

module.exports = emailQueue;