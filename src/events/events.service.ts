import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserEvent } from 'src/interfaces/UserEvent.interface';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { UpdateEventDto } from './dto/UpdateEvent.dto';
import {
  validateCreateEvent,
  validateUpdateEvent,
} from 'src/utils/validateEvent';
import { PgService } from 'src/pg/pg.service';

@Injectable()
export class EventsService {
  constructor(private readonly pgService: PgService) {}

  // @routes /api/v1/events
  // @method GET request
  // @desc retrieve all events
  async findAll(email: string): Promise<UserEvent[]> {
    const { rows } = await this.pgService.pool.query(
      'SELECT * FROM event_entity WHERE user_email = $1',
      [email],
    );
    return rows;
  }

  // @routes /api/v1/events/:id
  // @method GET request
  // @desc retrieve event with a given id
  async findOne(id: string): Promise<UserEvent> {
    const query = `
         SELECT * FROM event_entity
         WHERE id = $1
       `;
    const { rows } = await this.pgService.pool.query(query, [id]);
    return rows[0];
  }

  // @routes /api/v1/events
  // @method POST request
  // @desc create new event
  async create(createDto: CreateEventDto, email: string): Promise<UserEvent> {
    const { error, value } = validateCreateEvent(createDto);
    if (error) {
      throw new ForbiddenException(error.message);
    }
    const { name, category, venue, date_of_event, description } = value;
    const query = `
          INSERT INTO event_entity(name, category, venue, date_of_event, description, user_email)
          VALUES ($1, $2, $3, $4, $5, $6) 
          RETURNING *
      `;
    const { rows } = await this.pgService.pool.query(query, [
      name,
      category,
      venue,
      date_of_event,
      description,
      email,
    ]);
    return rows[0];
  }

  // @routes /api/v1/events/:id
  // @method PUT request
  // @desc update event details with a given id
  async update(
    id: string,
    updateDto: UpdateEventDto,
    email: string,
  ): Promise<UserEvent> {
    const { error, value } = validateUpdateEvent(updateDto);
    if (error) {
      throw new ForbiddenException(error.message);
    }
    const {
      name,
      category,
      venue,
      date_of_event,
      description,
      visibility,
      updated_at,
    } = value;
    //check if event already exists and pre-populate the properties that weren't updated
    const result = await this.pgService.pool.query(
      `SELECT * FROM event_entity WHERE id = $1`,
      [id],
    );
    const [event]: [UserEvent] = result.rows;
    if (email !== event.user_email) {
      throw new ForbiddenException('Unauthorized User');
    }
    const query = `
          UPDATE event_entity SET 
          name = $1, category = $2, venue = $3, date_of_event = $4, description = $5,
          visibility = $6, updated_at = $7
          WHERE id = $8
          RETURNING *
      `;
    const { rows } = await this.pgService.pool.query(query, [
      name ?? event?.name,
      category ?? event?.category,
      venue ?? event?.venue,
      date_of_event ?? event?.date_of_event,
      description ?? event?.description,
      visibility ?? event?.visibility,
      updated_at,
      id,
    ]);
    return rows[0];
  }

  // @routes /api/v1/events/:id
  // @method DELETE request
  // @desc delete event with a given id
  async delete(id: string, email: string): Promise<void> {
    const query = `
         SELECT * FROM event_entity
         WHERE id = $1
       `;
    const { rows } = await this.pgService.pool.query(query, [id]);
    const [event]: [UserEvent] = rows;
    if (event.user_email !== email) {
      throw new ForbiddenException('Unauthorized access');
    }
    await this.pgService.pool.query('DELETE FROM event_entity WHERE id = $1', [
      id,
    ]);
  }
}
