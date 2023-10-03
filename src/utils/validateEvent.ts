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
      .valid(
        'wedding',
        'birthday',
        'convocation',
        'anniversary',
        'concert',
        'festival',
        'other',
      )
      .lowercase()
      .default('wedding')
      .required(),
    venue: Joi.string().lowercase().required(),
    date_of_event: Joi.date().timestamp().iso().required(),
    description: Joi.string().lowercase(),
    created_at: Joi.date().timestamp().default(new Date()),
    visibility: Joi.string()
      .valid('private', 'public', 'personal')
      .lowercase()
      .default('public'),
    ticket_quantity: Joi.number(),
    ticket_type: Joi.string().valid('paid', 'free').lowercase(),
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
      .valid(
        'wedding',
        'birthday',
        'convocation',
        'anniversary',
        'concert',
        'festival',
        'other',
      )
      .lowercase(),
    venue: Joi.string().lowercase(),
    date_of_event: Joi.date().timestamp().iso(),
    description: Joi.string().lowercase(),
    updated_at: Joi.date().timestamp().default(new Date()),
    visibility: Joi.string().valid('private', 'public', 'personal').lowercase(),
    ticket_quantity: Joi.number(),
    ticket_type: Joi.string().valid('paid', 'free').lowercase(),
  });
  return schema.validate(body);
};
