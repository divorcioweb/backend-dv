import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { EventDTO, ScheduleDTO, StatusDTO } from './events.dto';
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
    const eventos = await this.db.evento.findMany({
      where: {
        usuario_id: user.id,
      },
      orderBy: {
        data: 'asc',
      },
    });

    return eventos.map((evento) => {
      const date = new Date(evento.data);

      const formattedMonth = date
        .toLocaleString('pt-BR', { month: 'short' })
        .toUpperCase();
      const formattedDay = date.getDate();

      return {
        ...evento,
        formatted: {
          mes: formattedMonth,
          dia: formattedDay,
        },
      };
    });
  }

  async schedule(user: any, data: ScheduleDTO) {
    return await this.db.agendamento.create({
      data: {
        preferencia_dia_da_semana: data.preferencia_dia_da_semana,
        preferencia_turno: data.preferencia_turno,
        usuario_id: user.id,
      },
    });
  }

  async listScripture(user: any) {
    const userFind = await this.db.usuario.findUnique({
      where: {
        id: user.id,
      },
      select: {
        type: true,
      },
    });

    if (userFind?.type === 1) {
      return await this.db.divorcio.findFirst({
        where: {
          usuario_primario_id: user.id,
        },
      });
    } else {
      return await this.db.divorcio.findFirst({
        where: {
          usuario_secundario_id: user.id,
        },
      });
    }
  }
}
