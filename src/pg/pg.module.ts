import { Global, Module } from '@nestjs/common';
import { PgService } from './pg.service';

@Global() // this makes it available globally to all modules without explicitly importing this PgModule
@Module({
  providers: [PgService],
  exports: [PgService], // this makes it available to any service
})
export class PgModule {}
