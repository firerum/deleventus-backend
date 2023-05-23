import {
  ForbiddenException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthDto } from './dto/Auth.dto';
import * as argon from 'argon2';
import { PgService } from 'src/pg/pg.service';
import { validateSignIn } from 'src/utils/validateUser';
import { User } from 'src/users/interface/User.interface';
import { JwtService } from '@nestjs/jwt';
import { validateCreateUser } from 'src/utils/validateUser';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private readonly pgService: PgService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // @routes /v1/api/auth/signup
  // @method POST request
  // @desc create new user
  async signup(auth: CreateUserDto): Promise<User> {
    const { error, value } = validateCreateUser(auth);
    if (error) {
      return error.message;
    }

    // check if user already exists
    const search = `
         SELECT * FROM user_entity
         WHERE email = $1
       `;
    const { rows: rowObj } = await this.pgService.pool.query(search, [
      value.email,
    ]);
    const [user]: [User] = rowObj;
    // throw error message if user exists
    if (user) {
      throw new HttpException(
        'User Exists, Please Sign In!',
        HttpStatus.CONFLICT,
      );
    }

    const hash = await argon.hash(value.password);
    const query = `
          INSERT INTO user_entity(first_name, last_name, email, password, username, gender, phone_no, avatar, country)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (email) DO NOTHING
          RETURNING *
      `;
    const { rows } = await this.pgService.pool.query(query, [
      value.first_name,
      value.last_name,
      value.email,
      (value.password = hash),
      value.username,
      value.gender,
      value.phone_no,
      value.avatar,
      value.country,
    ]);
    const { access_token } = await this.signAccessToken(
      rows[0].id,
      rows[0].email,
    );
    const { refresh_token } = await this.signRefreshToken(
      rows[0].id,
      rows[0].email,
    );
    await this.updateRefreshToken(rows[0].id, refresh_token);
    return { ...rows[0], password: '', token: access_token, refresh_token };
  }

  // @routes /v1/api/auth/signin
  // @method POST request
  // @desc sign in user
  async signin(auth: AuthDto): Promise<User> {
    const { error, value } = validateSignIn(auth);
    if (error) {
      return error.message;
    }
    // find user via email
    const query = `
         SELECT * FROM user_entity
         WHERE email = $1
       `;
    const { rows } = await this.pgService.pool.query(query, [value.email]);
    const [user]: [User] = rows;
    // throw error message if user does not exist
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);
    }

    // compare password if user exists
    const validPassword = await argon.verify(user.password, auth.password);
    // throw error message on password mismatch
    if (!validPassword) {
      throw new HttpException('Password Incorrect!', HttpStatus.UNAUTHORIZED);
    }
    const { access_token } = await this.signAccessToken(user.id, user.email);
    const { refresh_token } = await this.signRefreshToken(user.id, user.email);
    await this.updateRefreshToken(user.id, refresh_token);
    return { ...rows[0], password: '', token: access_token, refresh_token };
  }

  // @routes /v1/api/auth/signout
  // @method GET request
  // @desc sign out user
  async signOut(user_id: string): Promise<void> {
    const query = `
        UPDATE user_entity SET refresh_token = NULL WHERE id = $1
    `;
    await this.pgService.pool.query(query, [user_id]);
  }

  // @routes /v1/api/auth/refresh
  // @method GET request
  // @desc generate new refresh token for user
  async refresh(
    user_id: string,
    refresh: string,
  ): Promise<{ token: string; refresh_token: string }> {
    const query = `
        SELECT * FROM user_entity WHERE id = $1
    `;
    const { rows } = await this.pgService.pool.query(query, [user_id]);
    const [user]: [User] = rows;
    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access Denied');
    }
    // compare if tokens match
    const validRefreshToken = await argon.verify(user.refresh_token, refresh);
    if (!validRefreshToken) {
      throw new ForbiddenException("Access Denied. Tokens don't match");
    }
    const { access_token } = await this.signAccessToken(user.id, user.email);
    const { refresh_token } = await this.signRefreshToken(user.id, user.email);
    await this.updateRefreshToken(user.id, refresh_token);
    return { token: access_token, refresh_token };
  }

  // helper functions for creating/modifying tokens
  // create access token
  async signAccessToken(
    id: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { id, email };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
    return { access_token: token };
  }

  // create refresh token
  async signRefreshToken(
    id: string,
    email: string,
  ): Promise<{ refresh_token: string }> {
    const payload = { id, email };
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });
    return { refresh_token: refreshToken };
  }

  // update refresh token
  async updateRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<void> {
    const hashedRefreshToken = await argon.hash(refresh_token);
    const query = `
        UPDATE user_entity SET refresh_token = $1 WHERE id = $2 
    `;
    await this.pgService.pool.query(query, [
      (refresh_token = hashedRefreshToken),
      user_id,
    ]);
  }
}
