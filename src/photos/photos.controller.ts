import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UploadedFiles,
} from '@nestjs/common';
import { PhotosService } from './photos.service';

@Controller({ path: 'api/events/:event_id/photos', version: '1' })
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get()
  findAllPhotos(@Param('event_id') event_id: string) {
    return this.photosService.findAll(event_id);
  }

  @Post()
  createPhotos(
    @Param('event_id') event_id: string,
    @UploadedFiles() files: any,
  ) {
    return this.photosService.create(event_id, files);
  }

  @Delete('id')
  deletePhoto(@Param('id') id: string) {
    return this.photosService.delete(id);
  }
}
