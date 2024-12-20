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

export class ChangePasswordDTO {
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  senha_atual: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  nova_senha: string;
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
  codigo: string;

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
  nao_possui_filhos_menores: boolean;

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

  @ApiProperty({
    type: ConjugeDTO,
    description: 'Informações do cônjuge',
  })
  conjuge: ConjugeDTO;
}

export class UpdateConjugeDTO {
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  nome_solteiro: boolean;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  telefone: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  naturalidade: string;

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  estado_civil: string;

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
    type: AddressDTO,
    description: 'Endereço do usuário',
  })
  endereco: AddressDTO;
}
