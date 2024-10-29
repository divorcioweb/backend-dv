import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { PaymentDTO } from './payment.dto';

@ApiTags('Pagamentos')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async createIntent(@Body() body: PaymentDTO, @Request() req: any) {
    const user = req.user
    return this.paymentService.createIntent(body, user);
  }

  @Post('webhook')
  async updatePayment (@Body() body: any) {
    return this.paymentService.confirmPayment(JSON.parse(body))
  }
}
