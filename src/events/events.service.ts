import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { UserEvent } from 'src/interfaces/UserEvent.interface';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { UpdateEventDto } from './dto/UpdateEvent.dto';
import {
  validateCreateEvent,
  validateUpdateEvent,
} from 'src/utils/validateEvent';

@Injectable()
export class EventsService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      date_of_event: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  }

  // @routes /api/v1/events
  // @method GET request
  // @desc retrieve all events
  async findAll(): Promise<UserEvent[]> {
    const { rows } = await this.pool.query('SELECT * FROM event_entity');
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
    const { rows } = await this.pool.query(query, [id]);
    return rows[0];
  }

  // @routes /api/v1/events
  // @method POST request
  // @desc create new event
  async create(createDto: CreateEventDto): Promise<UserEvent> {
    const { error, value } = validateCreateEvent(createDto);
    console.log(value);
    // if (error) {
    //   return error.message;
    // }
    const { name, category, venue, date_of_event, description, user_email } =
      value;
    const query = `
          INSERT INTO event_entity(name, category, venue, date_of_event, description, user_email)
          VALUES ($1, $2, $3, $4, $5, $6) 
          RETURNING *
      `;
    const { rows } = await this.pool.query(query, [
      name,
      category,
      venue,
      date_of_event,
      description,
      user_email,
    ]);
    return rows[0];
  }

  // @routes /api/v1/events/:id
  // @method PUT request
  // @desc update event details with a given id
  async update(id: string, updateDto: UpdateEventDto): Promise<UserEvent> {
    const { error, value } = validateUpdateEvent(updateDto);
    // if (error) {
    //   return error.message;
    // }
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
    const result = await this.pool.query(
      `SELECT * FROM event_entity WHERE id = $1`,
      [id],
    );
    const [event]: [UserEvent] = result.rows;
    const query = `
          UPDATE event_entity SET 
          name = $1, category = $2, venue = $3, date_of_event = $4, description = $5,
          visibility = $6, updated_at = $7
          WHERE id = $8
          RETURNING *
      `;
    const { rows } = await this.pool.query(query, [
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
  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM event_entity WHERE id = $1', [id]);
  }
}
