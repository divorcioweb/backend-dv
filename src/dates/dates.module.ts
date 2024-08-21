import { Module } from '@nestjs/common';
import { DatesController } from './dates.controller';
import { DatesService } from './dates.service';
import { ConnectionService } from 'src/connection/connection.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DatesController],
  providers: [DatesService, ConnectionService, JwtService],
})
export class DatesModule {}
