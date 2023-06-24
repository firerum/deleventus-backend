import { Module, Global } from '@nestjs/common';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';

@Global()
@Module({
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
