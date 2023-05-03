import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/Auth.dto';
import * as argon from 'argon2';
import { PgService } from 'src/pg/pg.service';
import { validateSignIn } from 'src/utils/validateUser';
import { User } from 'src/interfaces/User.interface';
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
    const hash = await argon.hash(value.password);
    const query = `
          INSERT INTO user_entity(first_name, last_name, email, password)
          VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING
          RETURNING *
      `;
    const { rows } = await this.pgService.pool.query(query, [
      value.first_name,
      value.last_name,
      value.email,
      (value.password = hash),
    ]);
    return rows[0];
  }

  async signin(auth: AuthDto): Promise<{ access_token: string }> {
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
      throw new ForbiddenException('User does not exist');
    }

    // compare password if user exists
    const validPassword = await argon.verify(user.password, auth.password);
    // throw error message on password mismatch
    if (!validPassword) {
      throw new ForbiddenException('Password Incorrect!');
    }
    return this.signToken(user.email);
  }

  // create token
  async signToken(email: string): Promise<{ access_token: string }> {
    const payload = { email };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
    return { access_token: token };
  }
}
