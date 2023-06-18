import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwtRefresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler'; // rate limiter

@Module({
  imports: [JwtModule.register({})], // to get access to the JwtModule/JwtService in AuthService
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD /* to limit api calls -- rate limiter */,
      useClass: ThrottlerGuard,
    },
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
