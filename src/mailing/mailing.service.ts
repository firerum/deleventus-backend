import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

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

  public async sendVerificationLink(email: string): Promise<void> {
    try {
      // create a jwt token for the email confirmation link
      const payload = { email };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('OTC_SECRET'),
        expiresIn: '24h',
      });

      const url = `http://localhost:5000/v1/api/auth/confirm-email?token=${token}`;

      // the actual email sent to the user
      await this.setTransport();
      const result = await this.mailerService.sendMail({
        transporterName: 'gmail',
        to: `${email}`, // list of receivers
        from: 'ademuyiwaadewuyiy@gmail.com', // sender address
        subject: 'Verification Code', // Subject line
        text: `Welcome to Deleventus. To confirm your email, click here: ${url}`,
        html: `<p>Welcome to Deleventus. To confirm your email, click <a href="${url}">here</a></p>`,
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  public async confirmEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user.is_verified) {
      throw new HttpException(
        'Email already confirmed',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.usersService.markEmailAsConfirmed(email);
  }

  // decode the email token link sent from frontend
  public async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('OTC_SECRET'),
      });
      console.log(payload);
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new HttpException(
          'Email confirmation token expired',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Bad confirmation token', HttpStatus.BAD_REQUEST);
    }
  }
}
