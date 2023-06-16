import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { Ticket } from './interface/Ticket.interface';
import { TicketingService } from './ticketing.service';
import { TicketDto } from './dto/Ticket.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { validateIdParam } from 'src/utils/validateParam';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@ApiTags('Tickets')
// @ApiBearerAuth('access_token')
// @UseGuards(JwtGuard)
@Controller({ path: 'api/events/:event_id/tickets', version: '1' })
export class TicketingController {
  constructor(private readonly ticketingService: TicketingService) {}

  @Get()
  findAllTickets(@Param('event_id') event_id: string): Promise<Ticket[]> {
    const { error } = validateIdParam({ id: event_id });
    if (error) throw new BadRequestException();
    return this.ticketingService.findAll(event_id);
  }

  @Post()
  createTicket(
    @Body() ticketDto: TicketDto,
    @Param('event_id') event_id: string,
  ): Promise<Ticket> {
    const { error } = validateIdParam({ id: event_id });
    if (error) throw new BadRequestException();
    return this.ticketingService.createTicket(event_id, ticketDto);
  }
}
