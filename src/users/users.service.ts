import { ForbiddenException, Injectable } from '@nestjs/common';
import { Gender, User } from 'src/interfaces/User.interface';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { validateCreateUser, validateUpdateUser } from 'src/utils/validateUser';
import { PgService } from 'src/pg/pg.service';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly pgService: PgService) {}

  // @routes /api/v1/users
  // @method GET request
  // @desc retrieve all users
  async findAll(): Promise<User[]> {
    const { rows } = await this.pgService.pool.query(
      'SELECT * FROM user_entity',
    );
    return rows;
  }

  // @routes /api/v1/users/:id
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

  // @routes /api/v1/users
  // @method POST request
  // @desc create new user
  //   async create(createDto: CreateUserDto): Promise<User> {
  //     const { error, value } = validateCreateUser(createDto);
  //     if (error) {
  //       return error.message;
  //     }
  //     const hash = await argon.hash(value.password);
  //     const query = `
  //           INSERT INTO user_entity(first_name, last_name, email, password)
  //           VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING
  //           RETURNING *
  //       `;
  //     const { rows } = await this.pgService.pool.query(query, [
  //       value.first_name,
  //       value.last_name,
  //       value.email,
  //       (value.password = hash),
  //     ]);
  //     return rows[0];
  //   }

  // @routes /api/v1/users/:id
  // @method PUT request
  // @desc update user details with a given id
  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
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

  // @routes /api/v1/users/:id
  // @method DELETE request
  // @desc delete user with a given id
  async delete(id: string): Promise<void> {
    await this.pgService.pool.query('DELETE FROM user_entity WHERE id = $1', [
      id,
    ]);
  }
}
