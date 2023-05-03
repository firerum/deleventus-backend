import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [JwtModule.register({})], // to get access to the JwtModule/JwtService in AuthService
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
