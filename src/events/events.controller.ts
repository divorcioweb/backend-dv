import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { EventDTO, StatusDTO } from './events.dto';
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
  async create(@Body() body: EventDTO, @Req() req) {
    const user = req.user;

    return await this.eventsService.create(body, user);
  }

  @Post('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async status(@Body() body: StatusDTO, @Req() req) {
    const user = req.user;
    return await this.eventsService.statusUpdate(body, user);
  }

  @Post('status-provision')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async statusConjuge(@Body() body: StatusDTO, @Req() req) {
    const user = req.user;
    return await this.eventsService.statusUpdateWithProvision(body, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async find(@Req() req: any) {
    const user = req.user;
    return this.eventsService.find(user);
  }
}
