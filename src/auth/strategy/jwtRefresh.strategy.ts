import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PgService } from 'src/pg/pg.service';
import { User } from 'src/users/interface/User.interface';
import { Request } from 'express';

// This is where I do the configuration to extract the refresh token from the request to verify if it is valid
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    readonly config: ConfigService,
    private readonly pgService: PgService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extract token
      ignoreExpiration: false, // makes token invalid after expiration
      secretOrKey: config.get('JWT_REFRESH_SECRET'), // the secret to sign the token
      passReqToCallback: true,
    });
  }

  // function to verify token, find and return the user to the request object
  async validate(
    request: Request,
    payload: {
      id: string;
      email: string;
      iat: number;
      exp: number;
    },
  ): Promise<User> {
    const refresh_token = request
      .get('Authorization')
      .replace('Bearer', '')
      .trim();
    const { rows } = await this.pgService.pool.query(
      'SELECT * FROM user_entity WHERE email = $1',
      [payload.email],
    );
    return { ...rows[0], refresh_token };
  }
}
