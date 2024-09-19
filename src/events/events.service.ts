import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { EventDTO } from './events.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EventsService {
  constructor(
    private readonly db: ConnectionService,
    private readonly jwtService: JwtService,
  ) {}

  async create(body: EventDTO, token: string) {
    const userDecoded = await this.jwtService.decode(token);

    return this.db.evento.create({
      data: body,
    });
  }
}
