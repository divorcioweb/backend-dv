import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { PaymentDTO } from './payment.dto';
import { ConnectionService } from 'src/connection/connection.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly db: ConnectionService,
    private readonly jwtService: JwtService,
  ) {
    this.stripe = new Stripe(
      'sk_test_51O0NTZIEg91PAPSRgGNjgwoHbGZhNeYLZIeoZGBcVUTp76PBx9VDdiRJdmaQ7qsVUHFOwmAxWmt7VcPs33SUbcPa00w46I1tYR',
      { apiVersion: '2024-09-30.acacia' },
    );
  }

  async createIntent(body: PaymentDTO, user: any) {
    const payment = await this.db.pagamento.findUnique({
      where: {
        usuario_id: user.id,
      },
    });

    return await this.createPaymentIntent(
      (body.porcentagem / 100) * payment.total,
      user,
    );
  }

  async createPaymentIntent(amount: number, user: any) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      metadata: {
        ...user,
      },
    });

    return { paymentIntent: paymentIntent.client_secret };
  }

  async confirmPayment(body: any) {
    const parsed = body;

    const { id } = parsed.data.object.metadata;
    const { amount_received } = parsed.data.object;

    const porcentagem =
      amount_received === 4000 ? 100 : amount_received === 2000 ? 50 : 10;

    if (porcentagem !== 100) {
      await this.db.pagamento.update({
        where: {
          usuario_id: id,
        },
        data: {
          valor_pago: amount_received,
          pago: true,
          porcentagem,
        },
      });

      return await this.db.usuario.update({
        where: {
          id: id,
        },
        data: {
          status: 'Aguardando envio de documentos',
        },
        select: {
          senha: false,
        },
      });
    } else {
      await this.db.pagamento.update({
        where: {
          usuario_id: id,
        },
        data: {
          valor_pago: amount_received,
          pago: true,
          porcentagem,
        },
      });

      const user = await this.db.usuario.update({
        where: {
          id: id,
        },
        data: {
          status: 'Aguardando envio de documentos',
        },
      });

      await this.db.usuario.update({
        where: {
          id: user.usuario_id,
        },
        data: {
          status: 'Aguardando envio de documentos'
        },
      });

      await this.db.pagamento.update({
        where: {
          usuario_id: user.usuario_id,
        },
        data: {
          valor_pago: 0,
          pago: true,
          porcentagem: 0,
        },
      });
    }
  }
}
