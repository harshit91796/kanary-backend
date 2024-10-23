const Joi = require('joi');

const logSchema = Joi.object({
  actionType: Joi.string().required(),
  userId: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),
  userName: Joi.string().optional(),
  userRole: Joi.string().required(),
  timestamp: Joi.date().default(Date.now),
  additionalData: Joi.object().optional(),
  isDeleted: Joi.boolean().default(false)
});

const logFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  userName: Joi.string().optional(),
  objectId: Joi.string(),  // Allow any string input
  userRole: Joi.string().optional(),
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional({message: "Invalid userId format"}),
  logId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional({message: "Invalid logId format"}),  // Validates MongoDB ObjectId format
  actionType: Joi.string().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional()
});

const searchLogSchema = Joi.object({
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional({message: "Invalid objectId format"}),
  actionType: Joi.string().optional(),
  userName: Joi.string().optional(),
  userRole: Joi.string().optional(),
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional({message: "Invalid userId format"}),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional()
});

module.exports = {
  logSchema,
  logFilterSchema,
  searchLogSchema
};
