import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConnectionService } from './connection/connection.service';
import { ConnectionModule } from './connection/connection.module';
import { DocumentsModule } from './documents/documents.module';
import { ResendService } from './resend/resend.service';
import { DatesModule } from './dates/dates.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    ConnectionModule,
    DocumentsModule,
    DatesModule,
    EventsModule,
  ],
  controllers: [],
  providers: [ConnectionService, ResendService],
})
export class AppModule {}
