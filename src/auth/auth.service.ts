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

@Injectable()
export class AuthService {
  constructor(
    private readonly pgService: PgService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

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
    const { access_token } = await this.signToken(rows[0].id, rows[0].email);
    return { ...rows[0], token: access_token };
  }

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
    const { access_token } = await this.signToken(user.id, user.email);
    return { ...rows[0], token: access_token };
  }

  // create token
  async signToken(
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
}
