import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/Auth.dto';
import * as argon from 'argon2';
import { PgService } from 'src/pg/pg.service';

@Injectable()
export class AuthService {
  constructor(private readonly pgService: PgService) {}

  async signup(auth: AuthDto): Promise<string> {
    // generate password hash
    const hash = await argon.hash(auth.password);
    // save user to the database
    const query = `
          INSERT INTO user_entity(first_name, last_name, email, password)
          VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING
          RETURNING *
      `;
    const user = await this.pgService.pool.query(query);
    //return the saved user
    return `user signed up successfully`;
  }

  signin(): string {
    return `user signed in`;
  }
}
