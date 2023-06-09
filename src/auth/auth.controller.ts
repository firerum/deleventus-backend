import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/Auth.dto';
import { ConfirmEmailDto } from './dto/ConfirmEmail.dto';
import { User } from 'src/users/interface/User.interface';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserRequestObject } from './custom-decorator/user-object.decorator';
import { JwtGuard } from './guard/jwt.guard';
import { JwtRefreshGuard } from './guard/jwtRefresh.guard';
import { MailingService } from 'src/mailing/mailing.service';

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
  signup(@Body() auth: CreateUserDto): Promise<User> {
    return this.authService.signup(auth);
  }

  @Post('confirm-email')
  async confirm(
    @Body() confirmationData: ConfirmEmailDto,
  ): Promise<{ message: string }> {
    const email = await this.mailingService.decodeConfirmationToken(
      confirmationData.token,
    );
    return await this.mailingService.confirmEmail(email);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtGuard)
  @Post('resend-confirmation-link')
  async resendCofirm(@UserRequestObject() user: User): Promise<void> {
    await this.mailingService.resendConfirmationLink(user.id);
  }

  @ApiBody({ type: AuthDto }) // to ensure swagger understands the request type
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() auth: AuthDto): Promise<User> {
    return this.authService.signin(auth);
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
