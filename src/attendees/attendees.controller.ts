import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/interface/User.interface';
import { Attendee } from './interface/Attendee.interface';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserRequestObject } from 'src/auth/custom-decorator/user-object.decorator';
import { AttendeesService } from './attendees.service';
import { CreateAttendeeDto } from './dto/Attendee.dto';

@ApiTags('Attendees')
@ApiBearerAuth('access_token')
@UseGuards(JwtGuard)
@Controller({ path: '/api/events/:event_id/attendees', version: '1' })
export class AttendeesController {
  constructor(private readonly attendeeService: AttendeesService) {}
  @Get()
  findAllAttendees(@Param('event_id') event_id: string): Promise<Attendee[]> {
    return this.attendeeService.findAll(event_id);
  }

  @Post()
  createAttendee(
    @Body() createAttendeeDto: CreateAttendeeDto,
    @Param('event_id') event_id: string,
    @UserRequestObject() user: User,
  ): Promise<Attendee> {
    return this.attendeeService.create(event_id, createAttendeeDto, user.id);
  }
}
