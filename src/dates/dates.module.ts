import { Module } from '@nestjs/common';
import { DatesController } from './dates.controller';
import { DatesService } from './dates.service';
import { ConnectionService } from 'src/connection/connection.service';

@Module({
  controllers: [DatesController],
  providers: [DatesService, ConnectionService],
})
export class DatesModule {}
