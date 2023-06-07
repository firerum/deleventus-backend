import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './users/entity/User.entity';
import { EventsModule } from './events/events.module';
import { EventEntity } from './events/entity/Event.entity';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PgModule } from './pg/pg.module';
import { JwtService } from '@nestjs/jwt';
import { CommentsModule } from './comments/comments.module';
import { CommentEntity } from './comments/entity/Comment.entity';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { AttendeesModule } from './attendees/attendees.module';
import { AttendeeEntity } from './attendees/entity/Attendee.entity';
import { AttendeesController } from './attendees/attendees.controller';
import { AttendeesService } from './attendees/attendees.service';
import { MailingModule } from './mailing/mailing.module';
import { MailingService } from './mailing/mailing.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    EventsModule,
    AuthModule,
    PgModule,
    CommentsModule,
    AttendeesModule,
    MailingModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [UserEntity, EventEntity, CommentEntity, AttendeeEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity, EventEntity]),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
    }),
  ],
  controllers: [
    UsersController,
    EventsController,
    AuthController,
    CommentsController,
    AttendeesController,
  ],
  providers: [
    UsersService,
    EventsService,
    AuthService,
    JwtService,
    CommentsService,
    AttendeesService,
    MailingService,
  ],
})
export class AppModule {}
