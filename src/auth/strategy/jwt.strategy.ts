import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: 'false',
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  validate(payload: { email: string; iat: number; exp: number }): {
    email: string;
    iat: number;
    exp: number;
  } {
    return payload;
  }
}
