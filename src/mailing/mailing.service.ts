import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailingService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  // configuration for the transport mailer
  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.config.get('GOOGLE_ID'),
      this.config.get('GOOGLE_SECRET'),
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
        user: this.config.get('EMAIL'),
        clientId: this.config.get('GOOGLE_ID'),
        clientSecret: this.config.get('GOOGLE_SECRET'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  // the actual mail sent to the user
  public async sendMail(email = '') {
    await this.setTransport();
    try {
      const result = await this.mailerService.sendMail({
        transporterName: 'gmail',
        to: `${email}`, // list of receivers
        from: 'ademuyiwaadewuyiy@gmail.com', // sender address
        subject: 'Verification Code', // Subject line
        text: 'here is the code brother',
        html: '<p>Verify your account by clicking on this link https://deleventus.com</p>',
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}
