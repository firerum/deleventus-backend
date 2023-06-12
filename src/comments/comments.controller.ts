import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/Comment.dto';
import { User } from 'src/users/interface/User.interface';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserRequestObject } from 'src/auth/custom-decorator/user-object.decorator';
import { Comment } from './interface/comment.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmailConfirmationGuard } from 'src/auth/guard/EmailConfirmation.guard';

@ApiTags('Comments')
@ApiBearerAuth('access_token')
@UseGuards(EmailConfirmationGuard)
@UseGuards(JwtGuard)
@Controller({ path: '/api/events/:event_id/comments', version: '1' })
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  async findAllComments(
    @Param('event_id') event_id: string,
  ): Promise<Comment[]> {
    return this.commentService.findAll(event_id);
  }

  @Post()
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @UserRequestObject() user: User,
    @Param('event_id') event_id: string,
  ): Promise<Comment> {
    return this.commentService.create(createCommentDto, user.id, event_id);
  }

  @Put(':id')
  updateComment(
    @Body() updateCommentDto: UpdateCommentDto,
    @Param('id') id: string,
    @UserRequestObject() user: User,
  ): Promise<Comment> {
    return this.commentService.update(updateCommentDto, user.id, id);
  }
}
