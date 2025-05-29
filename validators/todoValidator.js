const Joi = require("joi");

exports.createTodoSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
});

exports.updateTodoSchema = Joi.object({
  title: Joi.string().optional(),
  body: Joi.string().optional(),
  status: Joi.string().valid("pending", "completed", "deleted").optional(),
});
