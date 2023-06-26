import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UploadedFiles,
} from '@nestjs/common';
import { FilesService } from './files.service';

@Controller({ path: 'api/events/:event_id/photos', version: '1' })
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAllPhotos(@Param('event_id') event_id: string) {
    return this.filesService.findAll(event_id);
  }

  @Post()
  createPhotos(
    @Param('event_id') event_id: string,
    @UploadedFiles() files: any,
  ) {
    return this.filesService.create(event_id, files);
  }

  @Delete('id')
  deletePhoto(@Param('id') id: string) {
    return this.filesService.delete(id);
  }
}
