import * as Joi from 'joi';
import { CreateEventDto } from 'src/events/dto/CreateEvent.dto';
import { UpdateEventDto } from 'src/events/dto/UpdateEvent.dto';

// event validation
export const validateCreateEvent = (
  body: CreateEventDto,
): Joi.ValidationResult<CreateEventDto> => {
  const schema = Joi.object({
    name: Joi.string().lowercase().required(),
    category: Joi.string()
      .valid('wedding', 'birthday', 'christening', 'others')
      .lowercase()
      .default('wedding')
      .required(),
    venue: Joi.string().lowercase().required(),
    date_of_event: Joi.date().required(),
    description: Joi.string().lowercase(),
    created_at: Joi.date().timestamp().default(new Date()),
    visibility: Joi.string()
      .valid('private', 'public')
      .lowercase()
      .default('public')
      .required(),
    user_email: Joi.string().email().lowercase().trim().required(),
  });
  return schema.validate(body);
};

// update event schema
export const validateUpdateEvent = (
  body: UpdateEventDto,
): Joi.ValidationResult<UpdateEventDto> => {
  const schema = Joi.object({
    name: Joi.string().lowercase(),
    category: Joi.string()
      .valid('wedding', 'birthday', 'others')
      .default('wedding')
      .lowercase(),
    venue: Joi.string().lowercase(),
    date_of_event: Joi.date(),
    description: Joi.string().lowercase(),
    updated_at: Joi.date().timestamp().default(new Date()),
    visibility: Joi.string()
      .valid('private', 'public')
      .lowercase()
      .default('public'),
    user_email: Joi.string().email().lowercase().trim(),
  });
  return schema.validate(body);
};
