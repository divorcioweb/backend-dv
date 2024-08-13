import { ApiProperty } from '@nestjs/swagger';

export class MultipartDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}