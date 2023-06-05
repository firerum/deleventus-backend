import { Injectable } from '@nestjs/common';
import { PgService } from 'src/pg/pg.service';
import { Attendee, Status } from './interface/Attendee.interface';
import { CreateAttendeeDto } from './dto/Attendee.dto';

@Injectable()
export class AttendeesService {
  constructor(private readonly pgService: PgService) {}

  // @routes /v1/api/events/:event_id/attendees
  // @method POST request
  // @desc create new comment
  async findAll(event_id: string): Promise<Attendee[]> {
    const query = ` 
        SELECT * FROM attendee_entity WHERE event_id = $1
    `;
    const { rows } = await this.pgService.pool.query(query, [event_id]);
    return rows;
  }

  // @routes /v1/api/events/:event_id/attendees
  // @method POST request
  // @desc create new comment
  async create(
    event_id: string,
    createAttendeeDto: CreateAttendeeDto,
    user_id: string,
  ): Promise<Attendee> {
    const { status } = createAttendeeDto;
    const query = `
        INSERT INTO attendee_entity(event_id, user_id, status)
        VALUES($1, $2, $3)
        RETURNING *
    `;
    const { rows } = await this.pgService.pool.query(query, [
      event_id,
      user_id,
      status,
    ]);
    return rows[0];
  }
}
