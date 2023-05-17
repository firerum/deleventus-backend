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
import { CreateCommentDto } from './dto/Comment.dto';
import { User } from 'src/users/interface/User.interface';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserRequestObject } from 'src/auth/custom-decorator/user-object.decorator';
import { Comment } from './interface/comment.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@ApiBearerAuth('access_token')
@UseGuards(JwtGuard)
@Controller({ path: '/api/comments', version: '1' })
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post()
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @UserRequestObject() user: User,
  ): Promise<Comment> {
    return this.commentService.create(createCommentDto, user.id);
  }

  @Put()
  updateComment(): string {
    return this.commentService.update();
  }
}
