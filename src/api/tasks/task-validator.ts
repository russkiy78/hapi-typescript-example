import * as Joi from "@hapi/joi";

export const createTaskModel = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required()
}).label('createTaskModel');

export const updateTaskModel = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  completed: Joi.boolean()
}).label('updateTaskModel');
