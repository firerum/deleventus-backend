import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options, SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { PasswordResetDto } from 'src/auth/dto/PasswordReset.dto';
import { toDataURL } from 'qrcode';
import { TicketDto } from 'src/ticketing/dto/Ticket.dto';

type EmailObject = {
  email: string;
  html: string;
  subject: string;
  text: string;
};
@Injectable()
export class MailingService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
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
  //TODO refactor code
  private async sendEmail(body: EmailObject): Promise<SentMessageInfo> {
    try {
      await this.setTransport();
      const result: SentMessageInfo = await this.mailerService.sendMail({
        transporterName: 'gmail',
        to: body.email,
        from: {
          name: 'Deleventus',
          address: process.env.EMAIL,
        },
        subject: body.subject,
        text: body.text,
        html: body.html,
        attachDataUrls: true,
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  // create a jwt token
  private createToken(email: string, secret: string, time: string): string {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get(secret),
      expiresIn: time,
    });
    return token;
  }

  // send confirmation link to new user upon sign up
  //TODO refactor code
  public async sendVerificationLink(email: string): Promise<void> {
    try {
      const token = this.createToken(email, 'OTC_SECRET', '24hr');
      const url = `Welcome to Deleventus. To confirm your email, click here: ${process.env.ENV_URL}/confirm-email?token=${token}`;
      const body = {
        email,
        html: `<p>${url}</p>`,
        subject: 'Verification Code',
        text: `${url}`,
      };
      await this.sendEmail(body);
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  // decode the email token link sent from frontend
  public async decodeToken(token: string, secret: string): Promise<string> {
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
    try {
      const user = await this.usersService.findOne(user_id);
      if (user.is_verified) {
        throw new BadRequestException('Email already confirmed');
      }
      await this.sendVerificationLink(user.email);
    } catch (error) {
      throw error;
    }
  }

  // send password reset link
  //TODO refactor code
  public async sendPasswordLink(email: string): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user || user['response'] === 'User Does not Exist') {
        throw new HttpException(
          'Account Does not Exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      const token = this.createToken(email, 'PASSWORD_SECRET', '3m');
      const url = `Welcome to Deleventus. To reset your password, click here: ${process.env.ENV_URL}/reset-password?token=${token}`;
      const body = {
        email,
        html: `${url}`,
        subject: 'Password Reset',
        text: `${url}`,
      };
      const result = await this.sendEmail(body);
      if (typeof result === 'object' && 'accepted' in result) {
        return { message: 'Check your inbox for your password reset link' };
      }
    } catch (error) {
      throw error;
    }
  }

  public async resetPassword(
    email: string,
    password: PasswordResetDto,
  ): Promise<{ message: string }> {
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
      throw error;
    }
  }

  // send ticket link with QRcode to attendee email
  //TODO refactor code
  public async sendTicket(value: TicketDto): Promise<{ message: string }> {
    try {
      const image = await toDataURL(JSON.stringify(value), {
        errorCorrectionLevel: 'H',
        type: 'image/png',
      });
      const url = `Welcome to Deleventus. Check your ticket to the event below <br/> <img src="${image}">`;
      const body = {
        email: value.attendee_email,
        html: `<p>${url}</p>`,
        subject: 'Event Ticket',
        text: `${url}`,
      };
      const result = await this.sendEmail(body);
      if (typeof result === 'object' && 'accepted' in result) {
        return { message: 'Check your inbox for ticket' };
      }
    } catch (error) {
      throw error;
    }
  }
}
