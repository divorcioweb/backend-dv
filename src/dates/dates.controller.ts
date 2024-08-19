import { DatesService } from './dates.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DateDTO } from './dates.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('Dates')
@Controller('dates')
export class DatesController {
  constructor(private readonly datesService: DatesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async registerDate(@Body() body: DateDTO) {
    return await this.datesService.create(body);
  }

  @Get('available')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async find() {
    return this.datesService.datesAvailable();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async deleteDate(@Param('id') id: string) {
    return await this.datesService.remove(id);
  }
}
