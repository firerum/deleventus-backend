import { Module, Global } from '@nestjs/common';
import { TicketingController } from './ticketing.controller';
import { TicketingService } from './ticketing.service';

@Global()
@Module({
  controllers: [TicketingController],
  providers: [TicketingService],
  exports: [TicketingService],
})
export class TicketingModule {}
