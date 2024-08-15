import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

@Injectable()
export class ResendService {
  async sendConjuge() {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['2003silvagui@gmail.com', 'ytgui01@gmail.com'],
      subject: 'Convite',
      html: '<strong>it works!</strong>',
    });
  }
}
