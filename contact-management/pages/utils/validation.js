const Joi = require('joi');


const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});


const contactSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(15).optional(),
  address: Joi.string().max(255).optional(),
  timezone: Joi.string().optional(),
});


const batchContactSchema = Joi.array().items(contactSchema);

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  contactSchema,
  batchContactSchema,
};
