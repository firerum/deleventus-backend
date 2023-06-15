import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PgService } from 'src/pg/pg.service';
import { Ticket } from './interface/Ticket.interface';
import { TicketDto } from './dto/Ticket.dto';
import { MailingService } from 'src/mailing/mailing.service';
import { EventsService } from 'src/events/events.service';
import { validateTicket } from 'src/utils/validateTicket';

@Injectable()
export class TicketingService {
  constructor(
    private readonly pgService: PgService,
    private readonly mailingService: MailingService,
    @Inject(forwardRef(() => EventsService))
    private readonly evenstService: EventsService,
  ) {}

  // @routes /v1/api/events/:event_id/tickets
  // @method GET request
  // @desc retrieve all tickets for events
  async findAll(event_id: string): Promise<Ticket[]> {
    try {
      const event = await this.evenstService.findSingle(event_id);
      if (!event) {
        throw new BadRequestException('Event Does not Exists');
      }
      const query = `
        SELECT * FROM ticket_entity WHERE event_id = $1
    `;
      const { rows } = await this.pgService.pool.query(query, [event_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // @desc find a single attendee ticket
  async findSingle(event_id: string, attendee_email: string): Promise<Ticket> {
    try {
      const query = `
        SELECT * FROM ticket_entity WHERE event_id = $1 AND attendee_email = $2
    `;
      const { rows } = await this.pgService.pool.query(query, [
        event_id,
        attendee_email,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // @routes /v1/api/events/:event_id/tickets
  // @method POST request
  // @desc create ticket for event
  async createTicket(event_id: string, ticketDto: TicketDto): Promise<Ticket> {
    const { error, value } = validateTicket(ticketDto);
    if (error) {
      throw new BadRequestException(error.message);
    }
    try {
      const event = await this.evenstService.findSingle(event_id);
      if (!event) {
        throw new BadRequestException('Event Does not Exist');
      }
      const attendee = await this.findSingle(event_id, value.attendee_email);
      if (attendee) {
        throw new HttpException('Ticket already issued', HttpStatus.CONFLICT);
      }
      const query = `
        INSERT INTO ticket_entity(attendee_email, attendee_first_name, attendee_last_name, attendee_phone_no, event_id)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const { rows } = await this.pgService.pool.query(query, [
        value.attendee_email,
        value.attendee_first_name,
        value.attendee_last_name,
        value.attendee_phone_no,
        event_id,
      ]);
      //   this.mailingService.sendTicketLink(value.email);
      return {
        ...rows,
        event_name: event.name,
        event_venue: event.venue,
        event_date: event.date_of_event,
      };
    } catch (error) {
      throw error;
    }
  }

  // @routes /v1/api/events/:event_id/tickets
  // @method DELETE request
  // @desc delete ticket for event
}
