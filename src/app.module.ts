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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    EventsModule,
    AuthModule,
    PgModule,
    CommentsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [UserEntity, EventEntity, CommentEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity, EventEntity]),
  ],
  controllers: [
    UsersController,
    EventsController,
    AuthController,
    CommentsController,
  ],
  providers: [
    UsersService,
    EventsService,
    AuthService,
    JwtService,
    CommentsService,
  ],
})
export class AppModule {}
