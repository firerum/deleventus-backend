import { Module, Global } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
