import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaymentDTO {
  @ApiProperty({
    example: 50,
  })
  @IsNotEmpty()
  @IsNumber()
  porcentagem: number;
}
