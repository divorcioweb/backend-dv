import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { JwtService } from '@nestjs/jwt';
import { ConnectionService } from 'src/connection/connection.service';

@Module({
  providers: [PaymentService, JwtService, ConnectionService],
  controllers: [PaymentController],
})
export class PaymentModule {}
