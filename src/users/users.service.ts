import { BadRequestException, Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import * as bcrypt from 'bcrypt';
import { UserDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: ConnectionService) {}

  async findAll() {
    return await this.db.user.findMany();
  }

  async register(user: UserDTO) {
    const userAlreadyRegistered = await this.db.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (userAlreadyRegistered) {
      throw new BadRequestException();
    }

    const userCreated = await this.db.user.create({
      data: {
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        cpf: user.cpf,
        rg: user.rg,
        estado_civil: user.estado_civil,
        naturalidade: user.naturalidade,
        nome_solteiro: user.nome_solteiro,
        profissao: user.profissao,
        type: user.type,
        usuario_id: "",
        senha: bcrypt.hashSync(user.senha, 10),
      },
      select: {
        id: true,
        email: true,
        nome: true,
        cpf: true,
        rg: true,
        estado_civil: true,
        naturalidade: true,
        nome_solteiro: true,
        profissao: true,
        telefone: true,
        type: true,
        usuario_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    const addressCreated = await this.db.endereco.create({
      data: {
        cep: user.endereco.cep,
        cidade: user.endereco.cidade,
        estado: user.endereco.estado,
        pais: user.endereco.pais,
        userId: userCreated.id,
      },
    });

    return { ...userCreated, endereco: addressCreated };
  }

  async findByEmail(email: string) {
    return await this.db.user.findFirst({
      where: {
        email: email,
      },
    });
  }
}
