import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { PasswordResetDto } from 'src/auth/dto/PasswordReset.dto';

@Injectable()
export class MailingService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  // configuration for the transport mailer
  private async setTransport(): Promise<void> {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('GOOGLE_ID'),
      this.configService.get('GOOGLE_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('EMAIL'),
        clientId: this.configService.get('GOOGLE_ID'),
        clientSecret: this.configService.get('GOOGLE_SECRET'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  // the actual email sent to the user
  private async sendEmail(email: string, url: string) {
    try {
      await this.setTransport();
      const result = await this.mailerService.sendMail({
        transporterName: 'gmail',
        to: `${email}`, // list of receivers
        from: {
          name: 'Deleventus',
          address: 'ademuyiwaadewuyi@gmail.com',
        }, // sender address
        subject: 'Verification Code', // Subject line
        text: `Welcome to Deleventus. To confirm your email, click here: ${url}`,
        html: `<p>Welcome to Deleventus. To confirm your email, click <a href="${url}">here</a></p>`,
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  // send confirmation link to new user upon sign up
  public async sendVerificationLink(email: string): Promise<void> {
    try {
      // create a jwt token for the email link
      const payload = { email };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('OTC_SECRET'),
        expiresIn: '24h',
      });
      const url = `http://localhost:5000/v1/api/auth/confirm-email?token=${token}`;
      await this.sendEmail(email, url);
    } catch (error) {
      return error;
    }
  }

  // confirm email by updating (is_verified = true)
  public async confirmEmail(email: string): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user.is_verified) {
        throw new BadRequestException('Email already confirmed');
      }
      const verifiedEmail = await this.usersService.markEmailAsConfirmed(email);
      if (verifiedEmail) {
        return { message: 'Email Verification Successful' };
      }
    } catch (error) {
      return error;
    }
  }

  // decode the email token link sent from frontend
  public async decodeConfirmationToken(
    token: string,
    secret: string,
  ): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get(secret),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new HttpException('Expired Link', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Bad confirmation token', HttpStatus.BAD_REQUEST);
    }
  }

  // resend confirmation link for user whose token expired or who didn't see link
  public async resendConfirmationLink(user_id: string) {
    const user = await this.usersService.findOne(user_id);
    if (user.is_verified) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email);
  }

  // send password reset link
  public async sendPasswordLink(email: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user || user['response'] === 'User Does not Exist') {
        throw new HttpException(
          'Account Does not Exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      // create a jwt token for the password link
      const payload = { email };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('PASSWORD_SECRET'),
        expiresIn: '5m',
      });
      const url = `http://localhost:5000/v1/api/auth/reset-password?token=${token}`;
      await this.sendEmail(email, url);
    } catch (error) {
      return error;
    }
  }

  public async resetPassword(email: string, password: PasswordResetDto) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user || user['response'] === 'User Does not Exist') {
        throw new BadRequestException('Account Does not Exist');
      }
      const update = await this.usersService.resetUserPassword(email, password);
      if (update) {
        return { message: 'Password Reset Successful' };
      }
    } catch (error) {
      return error;
    }
  }
}
