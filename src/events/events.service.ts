import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { EventDTO, StatusDTO } from './events.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EventsService {
  constructor(
    private readonly db: ConnectionService,
    private readonly jwtService: JwtService,
  ) {}

  async create(body: EventDTO, user: any) {
    return await this.db.evento.create({
      data: {
        ...body,
        usuario_id: user.id,
      },
    });
  }

  async statusUpdate({ data, status, titulo }: StatusDTO, user: any) {
    await this.db.evento.create({
      data: {
        titulo,
        data,
        usuario_id: user.id,
      },
    });

    await this.db.usuario.update({
      where: {
        id: user.id,
      },
      data: {
        status,
      },
    });
  }

  async statusUpdateWithProvision(
    { data, status, titulo }: StatusDTO,
    user: any,
  ) {
    await this.db.evento.create({
      data: {
        titulo,
        data,
        usuario_id: user.id,
      },
    });

    await this.db.usuario.update({
      where: {
        id: user.id,
      },
      data: {
        status,
      },
    });

    const usuario = await this.db.usuario.findUnique({
      where: {
        id: user.id,
      },
      select: {
        usuario_vinculado: {
          select: {
            pagamento: true,
          },
        },
      },
    });

    if (
      usuario.usuario_vinculado.pagamento.porcentagem === 100 &&
      usuario.usuario_vinculado.pagamento.pago === true
    ) {
      return await this.db.usuario.update({
        where: {
          id: user.id,
        },
        data: {
          status: 'Aguardando envio de documentos',
        },
      });
    } else {
      return await this.db.usuario.findUnique({
        where: {
          id: user.id,
        },
      });
    }
  }

  async find(user: any) {
    return await this.db.evento.findMany({
      where: {
        usuario_id: user.id,
      },
      orderBy: {
        data: 'asc', // 'asc' para ordem crescente; use 'desc' para ordem decrescente
      },
    });
  }
}
