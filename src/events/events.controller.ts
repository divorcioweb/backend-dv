import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { EventDTO } from './events.dto';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Eventos')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async create(@Body() body: EventDTO, @Req() request) {
    const token = request.headers.authorization.split(' ')[1];
    return await this.eventsService.create(body, token);
  }
}
