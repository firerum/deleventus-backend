import { Module, Global } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Global()
@Module({
  controllers: [CommentsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CommentsService,
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
