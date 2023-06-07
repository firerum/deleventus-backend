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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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

  @ApiCreatedResponse({ description: 'User Registration Successful' })
  @ApiBody({ type: CreateUserDto }) // to ensure swagger understands the request type
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() auth: CreateUserDto): Promise<User> {
    return this.authService.signup(auth);
  }

  @Post('confirm-email')
  async confirm(@Body() confirmationData: ConfirmEmailDto): Promise<void> {
    const email = await this.mailingService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.mailingService.confirmEmail(email);
  }

  @ApiOkResponse({ description: 'User Login Successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
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

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(
    @UserRequestObject() user: User,
  ): Promise<{ token: string; refresh_token: string }> {
    return this.authService.refresh(user.id, user.refresh_token);
  }
}
