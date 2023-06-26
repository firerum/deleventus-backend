import {
  ForbiddenException,
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './dto/Comment.dto';
import { Comment } from './interface/Comment.interface';
import { PgService } from 'src/pg/pg.service';
import { EventsService } from 'src/events/events.service';
import {
  validateCreateComment,
  validateUpdateComment,
} from 'src/utils/validateComment';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(forwardRef(() => EventsService))
    private readonly eventsService: EventsService,
    private readonly pgService: PgService,
  ) {}

  async findAll(event_id: string): Promise<Comment[]> {
    try {
      const event = await this.eventsService.findSingle(event_id);
      if (!event) throw new BadRequestException('Event Does not Exist');
      const query = `
        SELECT * FROM comment_entity WHERE event_id = $1
      `;
      const { rows } = await this.pgService.pool.query(query, [event_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // @routes /v1/api/events/:event_id/comments
  // @method POST request
  // @desc create new comment
  async create(
    createDto: CreateCommentDto,
    userId: string,
    event_id: string,
  ): Promise<Comment> {
    const {
      value: { comment },
      error,
    } = validateCreateComment(createDto);
    if (error) {
      throw new BadRequestException(error.message);
    }
    try {
      const event = await this.eventsService.findSingle(event_id);
      if (!event) {
        throw new BadRequestException('Event Does not Exist');
      }
      const query = `
        INSERT INTO comment_entity(comment, event_id, user_id)
        VALUES ($1, $2, $3) 
        RETURNING *
      `;
      const { rows } = await this.pgService.pool.query(query, [
        comment,
        event_id,
        userId,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // @routes /v1/api/comments
  // @method PUT request
  // @desc update comment
  async update(
    updateDto: UpdateCommentDto,
    userId: string,
    id: string,
  ): Promise<Comment> {
    const {
      value: { comment, updated_at },
      error,
    } = validateUpdateComment(updateDto);
    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    try {
      const { rows: commentObject } = await this.pgService.pool.query(
        'SELECT * FROM comment_entity WHERE id = $1',
        [id],
      );
      if (commentObject.length < 1) {
        throw new BadRequestException('Comment Does not Exist.');
      }
      if (userId !== commentObject[0].user_id) {
        throw new ForbiddenException('Access Denied');
      }
      const query = `
            UPDATE comment_entity SET comment = $1, updated_at =$2 WHERE id = $3
            RETURNING *
        `;
      const { rows } = await this.pgService.pool.query(query, [
        comment,
        updated_at,
        id,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}
