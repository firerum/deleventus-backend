import { Module, Global } from '@nestjs/common';
import { AttendeesService } from './attendees.service';
import { AttendeesController } from './attendees.controller';

@Global()
@Module({
  providers: [AttendeesService],
  controllers: [AttendeesController],
  exports: [AttendeesService],
})
export class AttendeesModule {}
