import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/Comment.dto';
import { Comment } from './interface/comment.interface';
import { PgService } from 'src/pg/pg.service';

@Injectable()
export class CommentsService {
  constructor(private readonly pgService: PgService) {}

  async findAll(): Promise<Comment> {
    const event_id = '9174759e-8b56-4ec3-9f1e-e22d6d99f1b8';
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
    const { comment, event_id = '9174759e-8b56-4ec3-9f1e-e22d6d99f1b8' } =
      createDto;
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
    updateDto: CreateCommentDto,
    userId: string,
    id: string,
  ): Promise<Comment> {
    const { comment } = updateDto;
    const event_id = '9174759e-8b56-4ec3-9f1e-e22d6d99f1b8';
    const { rows: commentObject } = await this.pgService.pool.query(
      'SELECT * FROM comment_entity WHERE id = $1',
      [id],
    );
    if (userId !== commentObject[0].user_id) {
      throw new ForbiddenException('Unauthorized Access');
    }
    const query = `
        UPDATE comment_entity SET comment = $1 WHERE user_id = $2 AND event_id = $3
        RETURNING *
    `;
    const { rows } = await this.pgService.pool.query(query, [
      comment,
      userId,
      event_id,
    ]);
    return rows[0];
  }
}
