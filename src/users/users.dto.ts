import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  MinLength,
} from 'class-validator';

export class ForgotPasswordStepOneDTO {
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ForgotPasswordStepTwoDTO {
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  senha: string;
}

export class UserDTO {
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  senha: string;
}

export class AddressDTO {
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  complemento: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  estado: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  cidade: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  pais: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  cep: string;
}
export class ConjugeDTO {
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateDTO {
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  profissao: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  rg: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  cpf: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  estado_civil: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  naturalidade: string;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  nome_solteiro: boolean;

  @ApiProperty({
    type: AddressDTO,
    description: 'Endereço do usuário',
  })
  endereco: AddressDTO;
  conjuge: ConjugeDTO;
}
