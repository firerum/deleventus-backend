import * as Joi from 'joi';
import { TicketDto } from 'src/ticketing/dto/Ticket.dto';

export const validateTicket = (
  body: TicketDto,
): Joi.ValidationResult<TicketDto> => {
  const schema = Joi.object({
    attendee_email: Joi.string().email().lowercase().trim().required(),
    attendee_first_name: Joi.string().lowercase().trim().required(),
    attendee_last_name: Joi.string().lowercase().trim().required(),
    attendee_phone_no: Joi.string().trim().required(),
    created_at: Joi.date().timestamp().default(new Date()),
  });

  return schema.validate(body);
};
