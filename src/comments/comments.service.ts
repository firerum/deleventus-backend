import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/Comment.dto';
import { Comment } from './interface/comment.interface';
import { PgService } from 'src/pg/pg.service';

@Injectable()
export class CommentsService {
  constructor(private readonly pgService: PgService) {}

  // @routes /v1/api/comments
  // @method POST request
  // @desc create new comment
  async create(createDto: CreateCommentDto, user_id: string): Promise<Comment> {
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
      user_id,
    ]);
    return rows[0];
  }

  update(): string {
    return `update event comment`;
  }
}
