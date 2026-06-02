const Joi = require("joi");

const sendEmail = Joi.object({
  leadId: Joi.string().uuid().required().messages({
    "string.guid": "leadId must be a valid UUID",
    "any.required": "leadId is required",
  }),
  campaignId: Joi.string().uuid().required().messages({
    "string.guid": "campaignId must be a valid UUID",
    "any.required": "campaignId is required",
  }),
  templateId: Joi.string().required().messages({
    "any.required": "templateId is required",
  }),
});

const createTemplate = Joi.object({
  name: Joi.string().min(2).max(200).trim().required().messages({
    "string.min": "Template name must be at least 2 characters",
    "any.required": "Template name is required",
  }),
  subject: Joi.string().min(2).max(300).trim().required().messages({
    "string.min": "Subject must be at least 2 characters",
    "any.required": "Subject is required",
  }),
  body: Joi.string().min(10).required().messages({
    "string.min": "Body must be at least 10 characters",
    "any.required": "Body is required",
  }),
  variables: Joi.array().items(Joi.string().trim()).default([]),
});

module.exports = { sendEmail, createTemplate };