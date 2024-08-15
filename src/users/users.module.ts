import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { ConnectionService } from 'src/connection/connection.service';
import { ResendService } from 'src/resend/resend.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService, ConnectionService, ResendService],
})
export class UsersModule {}
