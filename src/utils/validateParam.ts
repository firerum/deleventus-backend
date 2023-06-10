import * as Joi from 'joi';

type Id = { id: string };
type Email = { email: string };

export const validateEmailParam = (body: Email) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().min(3).trim().required(),
  });
  return schema.validate(body);
};

export const validateIdParam = (body: Id) => {
  const schema = Joi.object({
    id: Joi.string().guid({ version: 'uuidv4' }).required(),
  });
  return schema.validate(body);
};
