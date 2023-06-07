import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/users/interface/User.interface';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { validateUpdateUser } from 'src/utils/validateUser';
import { PgService } from 'src/pg/pg.service';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly pgService: PgService,
    private readonly eventService: EventsService,
  ) {}

  // @routes /v1/api/users
  // @method GET request
  // @desc retrieve all users
  async findAll(): Promise<User[]> {
    try {
      const { rows } = await this.pgService.pool.query(
        'SELECT * FROM user_entity',
      );
      const result = rows.map(async (user: User) => {
        const events = await this.eventService.findAll(user.id);
        user.events = events;
        user.password = '';
      });
      await Promise.all(result);
      return rows;
    } catch (error) {
      return error;
    }
  }

  // @routes /v1/api/users/:id
  // @method GET request
  // @desc retrieve user with a given id
  async findOne(id: string): Promise<User> {
    try {
      const query = `
         SELECT * FROM user_entity
         WHERE id = $1
       `;
      const { rows } = await this.pgService.pool.query(query, [id]);
      const result = rows.map(async (user: User) => {
        const events = await this.eventService.findAll(user.id);
        user.events = events;
        user.password = '';
      });
      await Promise.all(result);
      return rows[0];
    } catch (error) {
      return error;
    }
  }

  // @desc find user by email
  async findByEmail(email: string): Promise<User> {
    try {
      const query = `
             SELECT * FROM user_entity
             WHERE email = $1
           `;
      const { rows } = await this.pgService.pool.query(query, [email]);
      return rows[0];
    } catch (error) {
      return error;
    }
  }

  // @routes /v1/api/users/:id
  // @method PUT request
  // @desc update user details with a given id
  async update(
    id: string,
    updateDto: UpdateUserDto,
    user_id: string,
  ): Promise<User> {
    try {
      if (id !== user_id) {
        throw new ForbiddenException('Unauthorized access'); // only the right user can update their account
      }
      const { error, value } = validateUpdateUser(updateDto);
      if (error) {
        return error.message;
      }
      const {
        first_name,
        last_name,
        email,
        password,
        gender,
        city,
        country,
        phone_no,
        username,
        updated_at,
      } = value;

      //check if user already exists and pre-populate the properties that weren't updated
      const result = await this.pgService.pool.query(
        `SELECT * FROM user_entity WHERE id = $1`,
        [id],
      );
      const [user]: [User] = result.rows;
      const query = `
              UPDATE user_entity SET 
              first_name = $1, last_name = $2, email = $3, gender = $4, password = $5, country = $6, city = $7, phone_no = $8, username = $9, updated_at = $10 
              WHERE id = $11
              RETURNING *
          `;
      const { rows } = await this.pgService.pool.query(query, [
        first_name ?? user?.first_name,
        last_name ?? user?.last_name,
        email ?? user?.email,
        gender ?? user?.gender,
        password ?? user?.password,
        country ?? user?.country,
        city ?? user?.city,
        phone_no ?? user.phone_no,
        username ?? user.username,
        updated_at,
        id,
      ]);
      return { ...rows[0], password: '' };
    } catch (error) {
      return error;
    }
  }

  // @desc Update isVerified = true;
  async markEmailAsConfirmed(email: string): Promise<User> {
    try {
      const query = `
            UPDATE user_entity SET is_verified = TRUE WHERE email = $1
            RETURNING *
        `;
      const { rows } = await this.pgService.pool.query(query, [email]);
      return rows[0];
    } catch (error) {
      return error;
    }
  }

  // @routes /v1/api/users/:id
  // @method DELETE request
  // @desc delete user with a given id
  async delete(id: string, user_id: string): Promise<void> {
    try {
      if (id !== user_id) {
        throw new ForbiddenException('Unauthorized access'); // only the right user can delete their account
      }
      await this.pgService.pool.query('DELETE FROM user_entity WHERE id = $1', [
        id,
      ]);
    } catch (error) {
      return error;
    }
  }
}
