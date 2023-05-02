import * as Joi from 'joi';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dto/UpdateUser.dto';

// user registration schema
export const validateCreateUser = (body: CreateUserDto): any => {
  const schema = Joi.object({
    first_name: Joi.string().lowercase().trim().min(3).required(),
    last_name: Joi.string().lowercase().min(3).trim().required(),
    email: Joi.string().lowercase().email().min(3).trim().required(),
    password: Joi.string().min(6).required(),
    created_at: Joi.date().timestamp().default(new Date()),
  });

  return schema.validate(body);
};

// user login schema
export const validateLogin = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().min(3).trim().required(),
    password: Joi.string().required(),
  });
  return schema.validate(body);
};

// update user schema
export const validateUpdateUser = (body: UpdateUserDto): any => {
  const schema = Joi.object({
    first_name: Joi.string().lowercase().trim().min(3),
    last_name: Joi.string().lowercase().min(3).trim(),
    email: Joi.string().lowercase().email().min(3).trim(),
    password: Joi.string().min(6),
    username: Joi.string().lowercase().trim().min(3),
    gender: Joi.string().valid('male', 'female', 'other').trim(),
    phone_no: Joi.number(),
    avatar: Joi.string().trim(),
    city: Joi.string().trim(),
    country: Joi.string(),
    updated_at: Joi.date().timestamp().default(new Date()),
  });

  return schema.validate(body);
};
