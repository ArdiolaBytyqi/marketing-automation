const Joi = require("joi");

const create = Joi.object({
  title: Joi.string().min(2).max(200).trim().required().messages({
    "string.min": "Title must be at least 2 characters",
    "string.max": "Title must not exceed 200 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().max(2000).trim().allow("", null).optional(),
  status: Joi.string().valid("draft", "active", "paused", "completed").default("draft"), 
  startDate: Joi.date().iso().optional().messages({
    "date.format": "startDate must be a valid ISO date",
  }),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
    "date.format": "endDate must be a valid ISO date",
    "date.min": "endDate must be after startDate",
  }),
  budget: Joi.number().min(0).precision(2).optional().messages({
    "number.min": "Budget cannot be negative",
  }),
});

const update = Joi.object({
  title: Joi.string().min(2).max(200).trim().optional(),
  description: Joi.string().max(2000).trim().allow("", null).optional(),
  status: Joi.string().valid("draft", "active", "paused", "completed").optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  budget: Joi.number().min(0).precision(2).optional(),
}).min(1).messages({
  "object.min": "At least one field must be provided to update",
});

module.exports = { create, update };