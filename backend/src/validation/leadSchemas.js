const Joi = require("joi");

const create = Joi.object({
  name: Joi.string().min(2).max(150).trim().required().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 150 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-().]{7,20}$/)
    .allow("", null)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  campaignId: Joi.string().uuid().required().messages({
    "string.guid": "campaignId must be a valid UUID",
    "any.required": "campaignId is required",
  }),
   status: Joi.string()
    .valid("new", "contacted", "qualified", "converted", "lost")
    .default("new"),
  notes: Joi.string().max(2000).trim().allow("", null).optional(),
});


const updateStatus = Joi.object({
  status: Joi.string()
    .valid("new", "contacted", "qualified", "converted", "lost")
    .required()
    .messages({
      "any.only": "Status must be one of: new, contacted, qualified, converted, lost",
      "any.required": "Status is required",
    }),
  notes: Joi.string().max(2000).trim().allow("", null).optional(),
});

module.exports = { create, updateStatus };