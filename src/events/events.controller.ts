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
  BadRequestException,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Category, UserEvent } from 'src/events/interface/UserEvent.interface';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { UpdateEventDto } from './dto/UpdateEvent.dto';
import { User } from 'src/users/interface/User.interface';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserRequestObject } from 'src/auth/custom-decorator/user-object.decorator';
import { EmailConfirmationGuard } from 'src/auth/guard/EmailConfirmation.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { validateIdParam } from 'src/utils/validateParam';

@ApiTags('Events')
@ApiBearerAuth('access_token')
@UseGuards(EmailConfirmationGuard) // this is above the '@UseGuards(JwtGuard)' because decorators are read from bottom to top
@UseGuards(JwtGuard) // add the guard to the controller itself instead of individual endpoints
@Controller({ path: '/api/events', version: '1' })
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  findAllEvents(@UserRequestObject() user: User): Promise<UserEvent[]> {
    return this.eventService.findAll(user.id);
  }

  @ApiQuery({ name: 'category', enum: Category })
  @Get('filter')
  findEventsByCategory(
    @Query('category') category: Category,
    @UserRequestObject() user: User,
  ): Promise<UserEvent[]> {
    return this.eventService.findByCategory(user.id, category);
  }

  @Get(':id')
  findOneEvent(
    @Param('id') id: string,
    @UserRequestObject() user: User,
  ): Promise<UserEvent> {
    const { error } = validateIdParam({ id });
    if (error) throw new BadRequestException();
    return this.eventService.findOne(id, user.id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createEvent(
    @Body() createDto: CreateEventDto,
    @UserRequestObject() user: User,
  ): Promise<UserEvent> {
    return this.eventService.create(createDto, user.id);
  }

  @Put(':id')
  updateEvent(
    @Param('id') id: string,
    @Body() updateDto: UpdateEventDto,
    @UserRequestObject() user: User,
  ): Promise<UserEvent> {
    const { error } = validateIdParam({ id });
    if (error) throw new BadRequestException();
    return this.eventService.update(id, updateDto, user.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteEvent(
    @Param('id') id: string,
    @UserRequestObject() user: User,
  ): Promise<void> {
    const { error } = validateIdParam({ id });
    if (error) throw new BadRequestException();
    return this.eventService.delete(id, user.id);
  }
}
