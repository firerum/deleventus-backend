import { Injectable } from '@nestjs/common';
import { Gender, User } from 'src/interfaces/User.interface';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Injectable()
export class UsersService {
  user: User = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
  };

  // @routes /api/v1/users
  // @method GET request
  // @desc retrieve all users
  async findAll(): Promise<User[]> {
    return [];
  }

  // @routes /api/v1/users/:id
  // @method GET request
  // @desc retrieve user with a given id
  async findOne(id: string): Promise<User> {
    return this.user;
  }

  // @routes /api/v1/users
  // @method POST request
  // @desc create new user
  async create(createDto: CreateUserDto): Promise<User> {
    console.log(createDto);
    return createDto;
  }

  // @routes /api/v1/users/:id
  // @method PUT request
  // @desc update user details with a given id
  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    return this.user;
  }

  // @routes /api/v1/users/:id
  // @method DELETE request
  // @desc delete user with a given id
  async delete(id: string): Promise<User> {
    return this.user;
  }
}
