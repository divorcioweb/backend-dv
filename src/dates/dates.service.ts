import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { DateDTO } from './dates.dto';

@Injectable()
export class DatesService {
  constructor(private readonly db: ConnectionService) {}

  async create(body: DateDTO) {
    const date = new Date(body.date);

    const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const formattedDate = dateFormatter.format(date);

    // Formatar a hora
    const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const formattedTime = timeFormatter.format(date);

    const existingDate = await this.db.date.findFirst({
      where: {
        datetime: {
          equals: date.toISOString(),
        },
      },
    });
    if (existingDate) {
      throw new BadRequestException(
        'Já existe um registro com a mesma data e hora.',
      );
    }

    // Criar o novo registro
    return await this.db.date.create({
      data: {
        date: formattedDate,
        time: formattedTime,
        datetime: date,
      },
    });
  }

  async datesAvailable() {
    return await this.db.date.findMany({
      where: {
        user_id: null,
      },
    });
  }

  async remove(id: string) {
    const existingDate = await this.db.date.findFirst({
      where: {
        id: id,
      },
    });
    if (!existingDate) {
      throw new NotFoundException(
        'Já existe um registro com a mesma data e hora.',
      );
    }
    await this.db.date.delete({
      where: {
        id: id,
      },
    });

    return {
      message: 'Data removida com sucesso',
      error: false,
    };
  }
}
