import { Module, Global } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Global()
@Module({
  controllers: [EventsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    EventsService,
  ],
  exports: [EventsService],
})
export class EventsModule {}
