import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ConnectionService } from 'src/connection/connection.service';
import { ConnectionModule } from 'src/connection/connection.module';

@Module({
  imports: [ConnectionModule],
  controllers: [EventsController],
  providers: [EventsService, ConnectionService],
})
export class EventsModule {}
