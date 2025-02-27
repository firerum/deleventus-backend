import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PgService } from 'src/pg/pg.service';
import { Attendee, Status } from './interface/Attendee.interface';
import { CreateAttendeeDto } from './dto/Attendee.dto';
import { EventsService } from 'src/events/events.service';
import { UserEvent } from 'src/events/interface/UserEvent.interface';

@Injectable()
export class AttendeesService {
  constructor(private readonly pgService: PgService) {}

  // @routes /v1/api/events/:event_id/attendees
  // @method POST request
  // @desc create new comment
  async findAll(event_id: string): Promise<Attendee[]> {
    try {
      const query = ` 
        SELECT * FROM attendee_entity WHERE event_id = $1
      `;
      const { rows } = await this.pgService.pool.query(query, [event_id]);
      return rows;
    } catch (error) {
      return error;
    }
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
    try {
      const queryAttendee = `
        SELECT user_id FROM attendee_entity WHERE user_id = $1 
      `;
      const { rows: attendee } = await this.pgService.pool.query(
        queryAttendee,
        [user_id],
      );
      if (attendee.length > 0) {
        throw new HttpException('Invite Already Sent', HttpStatus.CONFLICT);
      }
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
    } catch (error) {
      return error;
    }
  }

  async delete(user_id: string, event_id: string): Promise<void> {
    //TODO resolve the dependency and provider shit
    // const event: UserEvent = await this.eventsService.findSingle(event_id);
    // if (user_id !== event.owner_id) {
    //   throw new ForbiddenException('Unauthorized Access');
    // }
    try {
      const query = `
        DELETE FROM attendee_entity WHERE user_id = $1;
      `;
      await this.pgService.pool.query(query, user_id);
    } catch (error) {
      return error;
    }
  }
}
