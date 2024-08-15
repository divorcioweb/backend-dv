import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import * as bcrypt from 'bcrypt';
import { ConjugeDTO, UserDTO } from './users.dto';
import { ResendService } from 'src/resend/resend.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: ConnectionService,
    private readonly jwtService: JwtService,
    private readonly resendService: ResendService,
  ) {}

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
        type: 'conjuge-primario',
        usuario_id: '',
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

    const paymentCreated = await this.db.pagamento.create({
      data: {
        pago: false,
        porcentagem: null,
        valor_pago: null,
        userId: userCreated.id,
      },
    });

    return {
      ...userCreated,
      endereco: addressCreated,
      pagamento: paymentCreated,
    };
  }

  async registerConjuge(token: string, conjuge: ConjugeDTO) {
    const userDecoded = await this.jwtService.decode(token);

    const userAlreadyRegistered = await this.db.user.findFirst({
      where: {
        email: conjuge.email,
      },
    });

    if (userAlreadyRegistered) {
      throw new BadRequestException();
    }

    const conjugeCreated = await this.db.user.create({
      data: {
        nome: conjuge.nome,
        email: conjuge.email,
        telefone: null,
        cpf: null,
        rg: null,
        estado_civil: null,
        naturalidade: null,
        nome_solteiro: null,
        profissao: null,
        type: 'conjuge-secundario',
        usuario_id: userDecoded.id,
        senha: bcrypt.hashSync(conjuge.email, 10),
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

    await this.db.endereco.create({
      data: {
        cep: null,
        cidade: null,
        estado: null,
        pais: null,
        userId: conjugeCreated.id,
      },
    });

    await this.db.pagamento.create({
      data: {
        pago: false,
        porcentagem: null,
        valor_pago: null,
        userId: conjugeCreated.id,
      },
    });

    const user = await this.db.user.update({
      where: {
        id: userDecoded.id,
      },
      data: {
        usuario_id: conjugeCreated.id,
      },
    });

    await this.resendService.sendConjuge();

    return user;
  }

  async findByEmail(email: string) {
    return await this.db.user.findFirst({
      where: {
        email: email,
      },
    });
  }
}
