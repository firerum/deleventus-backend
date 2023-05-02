import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { UserEvent } from 'src/interfaces/UserEvent.interface';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { UpdateEventDto } from './dto/UpdateEvent.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('/api/v1/events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAllEvents(@Req() req: Request): Promise<UserEvent[]> {
    const user: any = req.user;
    return this.eventService.findAll(user.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOneEvent(@Param('id') id: string): Promise<UserEvent> {
    return this.eventService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createEvent(
    @Body() createDto: CreateEventDto,
    @Req() req: Request,
  ): Promise<UserEvent> {
    const user: any = req.user;
    return this.eventService.create(createDto, user.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateEvent(
    @Param('id') id: string,
    @Body() updateDto: UpdateEventDto,
    @Req() req: Request,
  ): Promise<UserEvent> {
    const user: any = req.user;
    return this.eventService.update(id, updateDto, user.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteEvent(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const user: any = req.user;
    return this.eventService.delete(id, user.email);
  }
}
