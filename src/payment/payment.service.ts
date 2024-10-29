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
    console.log(body.data)
    console.log(body)
  }
}
