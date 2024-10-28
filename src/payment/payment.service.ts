import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { PaymentDTO } from './payment.dto';
import Stripe from 'stripe';
import { ConnectionService } from 'src/connection/connection.service';

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

    return await this.createPaymentIntent(payment.total / body.porcentagem);
  }

  async createPaymentIntent(amount: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'brl',
    });

    return paymentIntent.client_secret;
  }
}
