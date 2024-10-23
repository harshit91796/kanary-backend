const Joi = require('joi');


const registerSchema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    age: Joi.number().integer().min(0).max(120).required(),
    gender: Joi.string().valid('male', 'female', 'other').required()
  });
  

  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });



module.exports = {
  registerSchema,
  loginSchema
};
