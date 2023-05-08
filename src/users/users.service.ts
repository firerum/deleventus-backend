import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/users/interface/User.interface';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { validateUpdateUser } from 'src/utils/validateUser';
import { PgService } from 'src/pg/pg.service';

@Injectable()
export class UsersService {
  constructor(private readonly pgService: PgService) {}

  // @routes /v1/api/users
  // @method GET request
  // @desc retrieve all users
  async findAll(): Promise<User[]> {
    const { rows } = await this.pgService.pool.query(
      'SELECT * FROM user_entity',
    );
    return rows;
  }

  // @routes /v1/api/users/:id
  // @method GET request
  // @desc retrieve user with a given id
  async findOne(id: string): Promise<User> {
    const query = `
         SELECT * FROM user_entity
         WHERE id = $1
       `;
    const { rows } = await this.pgService.pool.query(query, [id]);
    return rows[0];
  }

  // @routes /v1/api/users/:id
  // @method PUT request
  // @desc update user details with a given id
  async update(
    id: string,
    updateDto: UpdateUserDto,
    user_id: string,
  ): Promise<User> {
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
    return rows[0];
  }

  // @routes /v1/api/users/:id
  // @method DELETE request
  // @desc delete user with a given id
  async delete(id: string, user_id: string): Promise<void> {
    if (id !== user_id) {
      throw new ForbiddenException('Unauthorized access'); // only the right user can delete their account
    }
    await this.pgService.pool.query('DELETE FROM user_entity WHERE id = $1', [
      id,
    ]);
  }
}
