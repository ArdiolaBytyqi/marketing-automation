const express = require("express");
const router = express.Router();
const {
  sendEmail,
  getTemplates,
  createTemplate,
  getLogs,
} = require("../controllers/emailController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const schemas = require("../validation/emailSchemas");

/**
 * @swagger
 * /emails/send:
 *   post:
 *     summary: Send an email to a lead
 *     tags: [Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [leadId, campaignId, templateId]
 *             properties:
 *               leadId:
 *                 type: string
 *                 format: uuid
 *               campaignId:
 *                 type: string
 *                 format: uuid
 *               templateId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 *       400:
 *         description: Validation error
 */
router.post(
  "/send",
  auth("admin", "marketer"),
  validate(schemas.sendEmail),
  sendEmail
);

/**
 * @swagger
 * /emails/templates:
 *   get:
 *     summary: Get all email templates
 *     tags: [Emails]
 *     responses:
 *       200:
 *         description: List of templates
 */
router.get("/templates", auth("admin", "marketer"), getTemplates);

/**
 * @swagger
 * /emails/templates:
 *   post:
 *     summary: Create an email template
 *     tags: [Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, subject, body]
 *             properties:
 *               name:
 *                 type: string
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *               variables:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Template created
 */
router.post(
  "/templates",
  auth("admin", "marketer"),
  validate(schemas.createTemplate),
  createTemplate
);

/**
 * @swagger
 * /emails/logs:
 *   get:
 *     summary: Get email logs
 *     tags: [Emails]
 *     responses:
 *       200:
 *         description: List of email logs
 */
router.get("/logs", auth("admin", "marketer"), getLogs);

module.exports = router;
