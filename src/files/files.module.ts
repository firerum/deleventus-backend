import { Module, Global } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Global()
@Module({
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
