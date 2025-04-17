import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NOTIFY_EMAIL,
      pass: process.env.NOTIFY_EMAIL_PASS,
    },
  });

  async sendTrendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: `"GoodTok" <${process.env.NOTIFY_EMAIL}>`,
      to,
      subject,
      html,
    });
  }
}
