import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/Auth.dto';
import { User } from 'src/users/interface/User.interface';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() auth: CreateUserDto): Promise<User> {
    return this.authService.signup(auth);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() auth: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signin(auth);
  }
}
