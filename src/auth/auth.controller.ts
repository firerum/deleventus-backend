import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/Auth.dto';
import { User } from 'src/users/interface/User.interface';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({ path: '/api/auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'User Registration Successful' })
  @ApiBody({ type: CreateUserDto }) // to ensure swagger understands the request type
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() auth: CreateUserDto): Promise<User> {
    return this.authService.signup(auth);
  }

  @ApiOkResponse({ description: 'User Login Successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiBody({ type: AuthDto }) // to ensure swagger understands the request type
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() auth: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signin(auth);
  }
}
