import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/Auth.dto';
import { User } from 'src/interfaces/User.interface';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() auth: CreateUserDto): Promise<User> {
    return this.authService.signup(auth);
  }

  @Post('signin')
  signin(@Body() auth: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signin(auth);
  }
}
