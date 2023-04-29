import {
  Controller,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/interfaces/User.interface';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  findAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOneUser(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  createUser(@Body() createDto: CreateUserDto): Promise<User> {
    return this.userService.create(createDto);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }
}
