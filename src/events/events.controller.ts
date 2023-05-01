import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { UserEvent } from 'src/interfaces/UserEvent.interface';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { UpdateEventDto } from './dto/UpdateEvent.dto';

@Controller('/api/v1/events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  findAllEvents(): Promise<UserEvent[]> {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOneEvent(@Param('id') id: string): Promise<UserEvent> {
    return this.eventService.findOne(id);
  }

  @Post()
  createEvent(@Body() createDto: CreateEventDto): Promise<UserEvent> {
    return this.eventService.create(createDto);
  }

  @Put(':id')
  updateEvent(
    @Param('id') id: string,
    @Body() updateDto: UpdateEventDto,
  ): Promise<UserEvent> {
    return this.eventService.update(id, updateDto);
  }

  @Delete(':id')
  deleteEvent(@Param('id') id: string): Promise<void> {
    return this.eventService.delete(id);
  }
}
