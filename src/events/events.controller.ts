import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { UserEvent } from 'src/events/interface/UserEvent.interface';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { UpdateEventDto } from './dto/UpdateEvent.dto';
import { User } from 'src/users/interface/User.interface';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserRequestObject } from 'src/auth/custom-decorator/user-object.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Events')
@ApiBearerAuth('access_token')
@UseGuards(JwtGuard) // add the guard to the controller itself instead of individual endpoints
@Controller({ path: '/api/events', version: '1' })
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @ApiOkResponse({ description: 'Get All Events Succesful' })
  @Get()
  findAllEvents(@UserRequestObject() user: User): Promise<UserEvent[]> {
    return this.eventService.findAll(user.id);
  }

  @ApiOkResponse({ description: 'Find Event By ID Successful' })
  @Get(':id')
  findOneEvent(@Param('id') id: string): Promise<UserEvent> {
    return this.eventService.findOne(id);
  }

  @ApiCreatedResponse({ description: 'Event Create Successful' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createEvent(
    @Body() createDto: CreateEventDto,
    @UserRequestObject() user: User,
  ): Promise<UserEvent> {
    return this.eventService.create(createDto, user.id);
  }

  @ApiOkResponse({ description: 'Event Update Successful' })
  @Put(':id')
  updateEvent(
    @Param('id') id: string,
    @Body() updateDto: UpdateEventDto,
    @UserRequestObject() user: User,
  ): Promise<UserEvent> {
    return this.eventService.update(id, updateDto, user.id);
  }

  @ApiNoContentResponse({ description: 'Event Delete Successful' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteEvent(
    @Param('id') id: string,
    @UserRequestObject() user: User,
  ): Promise<void> {
    return this.eventService.delete(id, user.id);
  }
}
