import {
  Controller,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/users/interface/User.interface';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserRequestObject } from 'src/auth/custom-decorator/user-object.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmailConfirmationGuard } from 'src/auth/guard/EmailConfirmation.guard';
import { validateEmailParam, validateIdParam } from 'src/utils/validateParam';

@ApiTags('Users')
@ApiBearerAuth('access_token')
@UseGuards(EmailConfirmationGuard)
@UseGuards(JwtGuard)
@Controller({ path: 'api/users', version: '1' }) // API versioning
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findUserById(@Param('id') id: string): Promise<User> {
    const { error } = validateIdParam({ id });
    if (error) throw new BadRequestException();
    return this.userService.findOne(id);
  }

  @Get('email/:email')
  findUserByEmail(@Param('email') email: string): Promise<User> {
    const { error } = validateEmailParam({ email });
    if (error) throw new BadRequestException();
    return this.userService.findByEmail(email);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
    @UserRequestObject() user: User,
  ): Promise<User> {
    const { error } = validateIdParam({ id });
    if (error) throw new BadRequestException();
    return this.userService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  deleteUser(
    @Param('id') id: string,
    @UserRequestObject() user: User,
  ): Promise<void> {
    const { error } = validateIdParam({ id });
    if (error) throw new BadRequestException();
    return this.userService.delete(id, user.id);
  }
}
