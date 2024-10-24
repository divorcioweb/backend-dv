import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import 'dotenv/config';

const resend = new Resend(process.env.RESEND_API_KEY);

@Injectable()
export class ResendService {
  async sendConjuge(conjuge: any) {
    await resend.emails.send({
      from: 'Divórcio Web <divorcioweb@thegenius.tech>',
      to: [conjuge.email],
      subject: 'Convite',
      html: `<strong> ${conjuge.nome} voce foi convidado para divorcio web <br/> Email: ${conjuge.email} <br/> Senha: ${conjuge.email} </strong>`,
    });
  }

  async sendResetPasswordEmail(email: string, code: string) {
    await resend.emails.send({
      from: 'Divórcio Web <divorcioweb@thegenius.tech>',
      to: email,
      subject: 'Recuperação de Senha',
      text: `Seu código de recuperação é: ${code}`,
    });
  }
}
