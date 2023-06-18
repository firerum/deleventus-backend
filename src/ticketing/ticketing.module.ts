import { Module, Global } from '@nestjs/common';
import { TicketingController } from './ticketing.controller';
import { TicketingService } from './ticketing.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Global()
@Module({
  controllers: [TicketingController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    TicketingService,
  ],
  exports: [TicketingService],
})
export class TicketingModule {}
