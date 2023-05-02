import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/Auth.dto';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() auth: AuthDto): Promise<string> {
    return this.authService.signup(auth);
  }

  @Post('signin')
  signin(): string {
    return this.authService.signin();
  }
}
