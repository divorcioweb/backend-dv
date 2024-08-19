import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class DateDTO {
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  date: string;
}
