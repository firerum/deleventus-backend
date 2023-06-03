import {
  ForbiddenException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './dto/Comment.dto';
import { Comment } from './interface/comment.interface';
import { PgService } from 'src/pg/pg.service';
import {
  validateCreateComment,
  validateUpdateComment,
} from 'src/utils/validateComment';

@Injectable()
export class CommentsService {
  constructor(private readonly pgService: PgService) {}

  async findAll(event_id: string): Promise<Comment[]> {
    const query = `
        SELECT * FROM comment_entity WHERE event_id = $1
    `;
    const { rows } = await this.pgService.pool.query(query, [event_id]);
    return rows;
  }

  // @routes /v1/api/comments
  // @method POST request
  // @desc create new comment
  async create(createDto: CreateCommentDto, userId: string): Promise<Comment> {
    const {
      value: { comment, event_id },
      error,
    } = validateCreateComment(createDto);
    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
    const { rows: commentObject } = await this.pgService.pool.query(
      'SELECT * FROM comment_entity WHERE id = $1',
      [id],
    );
    if (userId !== commentObject[0].user_id) {
      throw new ForbiddenException('Unauthorized Access');
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
  }
}
