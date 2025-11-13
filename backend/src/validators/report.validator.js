import Joi from "joi";

export const createReportSchema = Joi.object({
  address: Joi.string().allow("", null),
  location: Joi.object({
    type: Joi.string().valid("Point").default("Point"),
    coordinates: Joi.array()
      .ordered(Joi.number().required(), Joi.number().required())
      .length(2)
      .required(),
  }).required(),
  level: Joi.number().integer().min(1).max(5).required(),
  waterDepthCm: Joi.number().min(0).optional(),
  description: Joi.string().allow("", null),
  images: Joi.array().items(Joi.string().uri()).default([]),
  city: Joi.string().allow("", null),
  district: Joi.string().allow("", null),
  ward: Joi.string().allow("", null),
});

export const listReportSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(200).default(20),
  city: Joi.string().optional(),
  district: Joi.string().optional(),
  ward: Joi.string().optional(),
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional(),
});

export const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
