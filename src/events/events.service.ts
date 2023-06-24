import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { UserEvent, Category } from 'src/events/interface/UserEvent.interface';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { UpdateEventDto } from './dto/UpdateEvent.dto';
import {
  validateCreateEvent,
  validateUpdateEvent,
} from 'src/utils/validateEvent';
import { PgService } from 'src/pg/pg.service';
import { CommentsService } from 'src/comments/comments.service';
import { AttendeesService } from 'src/attendees/attendees.service';
import { TicketingService } from 'src/ticketing/ticketing.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly pgService: PgService,
    private readonly commentService: CommentsService,
    private readonly attendeeService: AttendeesService,
    @Inject(forwardRef(() => TicketingService))
    private readonly ticketingService: TicketingService,
  ) {}

  // @routes /v1/api/events
  // @method GET request
  // @desc retrieve all events
  //TODO find if this is feasible in terms of performance
  async findAll(user_id: string): Promise<UserEvent[]> {
    try {
      const query = `
        SELECT * FROM event_entity WHERE owner_id = $1
        `;
      const { rows } = await this.pgService.pool.query(query, [user_id]);
      const result = this.populateFields(rows);
      await Promise.allSettled(result);
      return rows; // TODO figure out how rows contain the comments
    } catch (error) {
      throw error;
    }
  }

  // @desc method to populate comments, tickets, attendees of event
  populateFields(rows: any[]): Promise<void>[] {
    const result = rows.map(async (e: UserEvent) => {
      const comments = await this.commentService.findAll(e.id);
      const attendees = await this.attendeeService.findAll(e.id);
      const tickets = await this.ticketingService.findAll(e.id);
      e.comments = comments;
      e.attendees = attendees;
      e.tickets = tickets;
    });
    return result;
  }

  // @routes /v1/api/events/filter?category=
  // @method GET request
  // @desc retrieve all events by category
  async findByCategory(
    user_id: string,
    category: Category,
  ): Promise<UserEvent[]> {
    try {
      if (!Object.values(Category).includes(category)) {
        throw new BadRequestException(
          `Category must be one of ${Object.values(Category)}`,
        );
      }
      const query = `
        SELECT * FROM event_entity WHERE owner_id = $1 AND category = $2
    `;
      const { rows } = await this.pgService.pool.query(query, [
        user_id,
        category,
      ]);
      const result = this.populateFields(rows);
      await Promise.allSettled(result);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // @routes /v1/api/events/:id
  // @method GET request
  // @desc retrieve event with a given id
  async findOne(id: string, user_id: string): Promise<UserEvent> {
    try {
      const query = `
        SELECT * FROM event_entity
        WHERE id = $1 AND owner_id = $2
      `;
      const { rows } = await this.pgService.pool.query(query, [id, user_id]);
      if (rows.length < 1) {
        throw new HttpException('Event Does not Exist', HttpStatus.BAD_REQUEST);
      }
      const result = this.populateFields(rows);
      await Promise.allSettled(result);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // @desc find any single event
  async findSingle(event_id: string): Promise<UserEvent> {
    try {
      const query = `
        SELECT * FROM event_entity WHERE id = $1;
      `;
      const { rows } = await this.pgService.pool.query(query, [event_id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // @routes /v1/api/events
  // @method POST request
  // @desc create new event
  async create(createDto: CreateEventDto, user_id: string): Promise<UserEvent> {
    const { error, value } = validateCreateEvent(createDto);
    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    try {
      const {
        name,
        category,
        venue,
        date_of_event,
        description,
        visibility,
        city,
        country,
      } = value;
      const query = `
        INSERT INTO event_entity(name, category, venue, date_of_event, description, visibility, city, country, owner_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *
      `;
      const { rows } = await this.pgService.pool.query(query, [
        name,
        category,
        venue,
        date_of_event,
        description,
        visibility,
        city,
        country,
        user_id,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // @routes /v1/api/events/:id
  // @method PUT request
  // @desc update event details with a given id
  async update(
    id: string,
    updateDto: UpdateEventDto,
    user_id: string,
  ): Promise<UserEvent> {
    const { error, value } = validateUpdateEvent(updateDto);
    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    try {
      const {
        name,
        category,
        venue,
        date_of_event,
        description,
        visibility,
        city,
        country,
        updated_at,
      } = value;
      //check if event already exists and pre-populate the properties that weren't updated
      const event: UserEvent = await this.findSingle(id);
      if (!event) {
        throw new HttpException('Event Does not Exist', HttpStatus.BAD_REQUEST);
      }
      if (user_id !== event.owner_id) {
        throw new ForbiddenException('Access Denied');
      }
      const query = `
        UPDATE event_entity SET 
        name = $1, category = $2, venue = $3, date_of_event = $4, description = $5,
        visibility = $6, city = $7, country = $8, updated_at = $9
        WHERE id = $10
        RETURNING *
      `;
      const { rows } = await this.pgService.pool.query(query, [
        name ?? event?.name,
        category ?? event?.category,
        venue ?? event?.venue,
        date_of_event ?? event?.date_of_event,
        description ?? event?.description,
        visibility ?? event?.visibility,
        city ?? event?.city,
        country ?? event?.country,
        updated_at,
        id,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // @routes /v1/api/events/:id
  // @method DELETE request
  // @desc delete event with a given id
  async delete(id: string, user_id: string): Promise<void> {
    try {
      const event: UserEvent = await this.findSingle(id);
      if (event?.owner_id !== user_id) {
        throw new ForbiddenException('Access Denied');
      }
      await this.pgService.pool.query(
        'DELETE FROM event_entity WHERE id = $1',
        [id],
      );
    } catch (error) {
      throw error;
    }
  }
}
