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
import { ApiBearerAuth, ApiQuery, ApiTags, ApiBody } from '@nestjs/swagger';
import { validateIdParam } from 'src/utils/validateParam';
import { PaginationOptionsDto } from './dto/PaginationOptions.dto';

@ApiTags('Events')
@Controller({ path: '/api/events', version: '1' })
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @ApiQuery({ name: 'page number', description: 'page number' })
  @ApiQuery({ name: 'page size', description: 'number of data per page' })
  @Get()
  findAllWithPagination(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    const paginationOptions: PaginationOptionsDto = { page, pageSize };
    return this.eventService.findAllWithPagination(paginationOptions);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(EmailConfirmationGuard) // this is above the '@UseGuards(JwtGuard)' because decorators are read from bottom to top
  @UseGuards(JwtGuard) // add the guard to the controller itself instead of individual endpoints
  @Get()
  findAllEvents(@UserRequestObject() user: User): Promise<UserEvent[]> {
    return this.eventService.findAll(user.id);
  }

  @ApiQuery({ name: 'category', enum: Category })
  @Get('filter')
  findEventsByCategory(
    @Query('category') category: Category,
  ): Promise<UserEvent[]> {
    return this.eventService.findByCategory(category);
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

  @ApiBearerAuth('access_token')
  @UseGuards(EmailConfirmationGuard) // this is above the '@UseGuards(JwtGuard)' because decorators are read from bottom to top
  @UseGuards(JwtGuard) // add the guard to the controller itself instead of individual endpoints
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createEvent(
    @Body() createDto: CreateEventDto,
    @UserRequestObject() user: User,
  ): Promise<UserEvent> {
    return this.eventService.create(createDto, user.id);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(EmailConfirmationGuard) // this is above the '@UseGuards(JwtGuard)' because decorators are read from bottom to top
  @UseGuards(JwtGuard) // add the guard to the controller itself instead of individual endpoints
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

  @ApiBearerAuth('access_token')
  @UseGuards(EmailConfirmationGuard) // this is above the '@UseGuards(JwtGuard)' because decorators are read from bottom to top
  @UseGuards(JwtGuard) // add the guard to the controller itself instead of individual endpoints
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
