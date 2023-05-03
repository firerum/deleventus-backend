import {
  Controller,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/users/interface/User.interface';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserRequestObject } from 'src/auth/custom-decorator/user-object.decorator';

@UseGuards(JwtGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOneUser(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
    @UserRequestObject() user: User,
  ): Promise<User> {
    return this.userService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  deleteUser(
    @Param('id') id: string,
    @UserRequestObject() user: User,
  ): Promise<void> {
    return this.userService.delete(id, user.id);
  }
}
