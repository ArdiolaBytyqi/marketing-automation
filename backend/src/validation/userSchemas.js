const Joi = require("joi");

const update = Joi.object({
  name: Joi.string().min(2).max(100).trim().optional(),
  email: Joi.string().email().lowercase().trim().optional(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .optional()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  role: Joi.string().valid("admin", "marketer", "client").optional(),
  isActive: Joi.boolean().optional(),
}).min(1).messages({
  "object.min": "At least one field must be provided to update",
});

module.exports = { update };