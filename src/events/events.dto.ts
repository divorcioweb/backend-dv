import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EventDTO {
  @ApiProperty({
    example: '2024-08-26T14:29:04.105Z',
  })
  @IsNotEmpty()
  @IsString()
  data: string;

  @ApiProperty({
    example: 'Cadastro no aplicativo',
  })
  @IsString()
  @IsNotEmpty()
  titulo: string;
}

export class StatusDTO {
  @ApiProperty({
    example: '2024-08-26T14:29:04.105Z',
  })
  @IsNotEmpty()
  @IsString()
  data: string;

  @ApiProperty({
    example: 'Cadastro no aplicativo',
  })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({
    example: 'Aguardando ...',
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class ScheduleDTO {
  @ApiProperty({
    example: 'Segunda',
  })
  @IsNotEmpty()
  @IsString()
  preferencia_dia_da_semana: string;

  @ApiProperty({
    example: 'Manhã',
  })
  @IsString()
  @IsNotEmpty()
  preferencia_turno: string;
}
