import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { ConnectionService } from 'src/connection/connection.service';
import { ResendService } from 'src/resend/resend.service';
import { CleanupService } from './cleanup.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    ConnectionService,
    ResendService,
    CleanupService,
  ],
})
export class UsersModule {}
