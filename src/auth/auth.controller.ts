import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/Auth.dto';
import { EmailDto } from './dto/Email.dto';
import { User } from 'src/users/interface/User.interface';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserRequestObject } from './custom-decorator/user-object.decorator';
import { JwtGuard } from './guard/jwt.guard';
import { JwtRefreshGuard } from './guard/jwtRefresh.guard';
import { MailingService } from 'src/mailing/mailing.service';
import { PasswordResetDto } from './dto/PasswordReset.dto';

@ApiTags('Auth')
@Controller({ path: '/api/auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailingService: MailingService,
  ) {}

  @ApiBody({ type: CreateUserDto }) // to ensure swagger understands the request type
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(
    @Body() auth: CreateUserDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.signup(auth);
  }

  @Get('confirm-email')
  async confirm(@Query('token') token: string): Promise<{ message: string }> {
    const email = await this.mailingService.decodeToken(token, 'OTC_SECRET');
    return this.mailingService.confirmEmail(email);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtGuard)
  @Get('resend-confirmation-link')
  resendConfirm(@UserRequestObject() user: User): Promise<void> {
    return this.mailingService.resendConfirmationLink(user.id);
  }

  @ApiBody({ type: AuthDto }) // to ensure swagger understands the request type
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(
    @Body() auth: AuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.signin(auth);
  }

  @ApiBody({ type: EmailDto })
  @Post('reset-password-link')
  reset(@Body() emailDto: EmailDto) {
    return this.mailingService.sendPasswordLink(emailDto.email);
  }

  @ApiBody({ type: PasswordResetDto })
  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() passwordDto: PasswordResetDto,
  ) {
    const email = await this.mailingService.decodeToken(
      token,
      'PASSWORD_SECRET',
    );
    return this.mailingService.resetPassword(email, passwordDto);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtGuard)
  @Get('signout')
  signOut(@UserRequestObject() user: User): Promise<void> {
    return this.authService.signOut(user.id);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(
    @UserRequestObject() user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.refresh(user.id, user.refresh_token);
  }
}
