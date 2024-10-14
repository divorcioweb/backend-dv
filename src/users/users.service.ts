import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import * as bcrypt from 'bcrypt';
import {
  ChangePasswordDTO,
  ConjugeDTO,
  ForgotPasswordStepTwoDTO,
  UpdateDTO,
  UserDTO,
} from './users.dto';
import { ResendService } from 'src/resend/resend.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: ConnectionService,
    private readonly jwtService: JwtService,
    private readonly resendService: ResendService,
  ) {}

  async findAll() {
    return await this.db.usuario.findMany();
  }

  async register(user: UserDTO): Promise<{
    message: string;
    error: boolean;
  }> {
    const userAlreadyRegistered = await this.db.usuario.findFirst({
      where: {
        email: user.email,
      },
    });

    if (userAlreadyRegistered) {
      throw new BadRequestException('Usuário já cadastrado!');
    }

    const userCreated = await this.db.usuario.create({
      data: {
        email: user.email,
        telefone: user.telefone,
        senha: bcrypt.hashSync(user.senha, 10),
        is_admin: false,
        status: 'Aguardando finalizar cadastro',
        type: 1,
      },
    });

    await this.db.endereco.create({
      data: {
        cep: null,
        cidade: null,
        estado: null,
        pais: null,
        usuario_id: userCreated.id,
      },
    });

    await this.db.pagamento.create({
      data: {
        pago: false,
        porcentagem: null,
        valor_pago: null,
        usuario_id: userCreated.id,
      },
    });

    return {
      message: 'Usuário criado com sucesso!',
      error: false,
    };
  }

  async registerConjuge(userDecoded, conjuge: ConjugeDTO) {
    const conjugeCreated = await this.db.usuario.create({
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
        type: 2,
        status: 'Aguardando finalizar cadastro',
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
        criado_em: true,
        atualizado_em: true,
      },
    });

    await this.db.endereco.create({
      data: {
        cep: null,
        cidade: null,
        estado: null,
        pais: null,
        usuario_id: conjugeCreated.id,
      },
    });

    await this.db.pagamento.create({
      data: {
        pago: false,
        porcentagem: null,
        valor_pago: null,
        usuario_id: conjugeCreated.id,
      },
    });

    await this.db.usuario.update({
      where: {
        id: userDecoded.id,
      },
      data: {
        usuario_id: conjugeCreated.id,
        status: 'Aguardando envio de documentos',
      },
    });

    await this.resendService.sendConjuge(conjuge);

    return {
      message: 'Conjuge criado com sucesso!',
      error: false,
    };
  }

  async updateOne(token: string, body: UpdateDTO) {
    const userDecoded = await this.jwtService.decode(token);
    const userAlreadyRegistered = await this.db.usuario.findFirst({
      where: {
        email: body.conjuge.email,
      },
    });

    if (userAlreadyRegistered) {
      throw new BadRequestException();
    }

    const {
      nome,
      cpf,
      estado_civil,
      naturalidade,
      nome_solteiro,
      profissao,
      rg,
    } = body;
    const { cep, cidade, complemento, estado, pais } = body.endereco;

    await this.db.usuario.update({
      where: {
        id: userDecoded.id,
      },
      data: {
        nome,
        cpf,
        rg,
        estado_civil,
        profissao,
        naturalidade,
        nome_solteiro,
      },
    });

    await this.db.endereco.update({
      where: {
        usuario_id: userDecoded.id,
      },
      data: {
        cep,
        cidade,
        complemento,
        estado,
        pais,
      },
    });

    await this.registerConjuge(userDecoded, body.conjuge);

    return {
      message: 'Informações salva com sucesso!',
      error: false,
    };
  }

  async findAllFilter() {
    return await this.db.usuario.findMany({
      where: {
        is_admin: false,
        type: 1,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        conjuge: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        pagamento: {
          select: {
            pago: true,
          },
        },
      },
    });
  }

  async findAllFilterMoreInfo(id: string) {
    const user = await this.db.usuario.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        nome: true,
        cpf: true,
        rg: true,
        email: true,
        estado_civil: true,
        naturalidade: true,
        nome_solteiro: true,
        profissao: true,
        status: true,
        telefone: true,
        type: true,
        conjuge: {
          select: {
            id: true,
            nome: true,
            cpf: true,
            rg: true,
            email: true,
            estado_civil: true,
            naturalidade: true,
            nome_solteiro: true,
            profissao: true,
            status: true,
            telefone: true,
            type: true,
            pagamento: {
              select: {
                pago: true,
                valor_pago: true,
                porcentagem: true,
                total: true,
              },
            },
            documentos: true,
            endereco: {
              select: {
                cep: true,
                cidade: true,
                complemento: true,
                pais: true,
                estado: true,
              },
            },
          },
        },
        pagamento: {
          select: {
            pago: true,
            valor_pago: true,
            porcentagem: true,
            total: true,
          },
        },
        documentos: true,
        endereco: {
          select: {
            cep: true,
            cidade: true,
            complemento: true,
            pais: true,
            estado: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Nenhum usuário foi encontrado');
    }

    return user;
  }

  async sendEmailCode(email: string) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const resetPass = await this.db.resetpassword.findFirst({
      where: {
        email,
      },
    });
    if (resetPass) {
      await this.db.resetpassword.delete({
        where: {
          id: resetPass.id,
        },
      });
    }

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

    await this.db.resetpassword.create({
      data: {
        codigo: resetCode,
        email,
      },
    });

    await this.resendService.sendResetPasswordEmail(email, resetCode);

    return { message: 'Código de recuperação enviado para o email.' };
  }

  async forgotPassword({ email, codigo, senha }: ForgotPasswordStepTwoDTO) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const resetPassword = await this.db.resetpassword.findFirst({
      where: {
        email: email,
      },
      select: {
        codigo: true,
        id: true,
      },
    });

    if (!resetPassword || resetPassword.codigo !== codigo) {
      return { message: 'Codigo invalido ou expirou.' };
    }

    await this.db.resetpassword.delete({
      where: {
        id: resetPassword.id,
      },
    });

    await this.db.usuario.update({
      where: {
        id: user.id,
      },
      data: {
        senha: bcrypt.hashSync(senha, 10),
      },
    });

    return { message: 'Senha alterada com sucesso.' };
  }

  async changePassword(token: string, body: ChangePasswordDTO) {
    const userDecoded = await this.jwtService.decode(token);

    const user = await this.db.usuario.findUnique({
      where: {
        id: userDecoded.id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const comparePasswordHashed = bcrypt.compareSync(
      body.senha_atual,
      user.senha,
    );

    if (!comparePasswordHashed) {
      throw new BadRequestException('A senha atual está incorreta');
    }

    await this.db.usuario.update({
      where: {
        id: user.id,
      },
      data: {
        senha: bcrypt.hashSync(body.nova_senha, 10),
      },
    });

    return {
      message: 'Senha atualizada com sucesso',
      error: false,
    };
  }

  async findByEmail(email: string) {
    return await this.db.usuario.findFirst({
      where: {
        email: email,
      },
    });
  }
}
