import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { ConnectionService } from 'src/connection/connection.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService, ConnectionService],
})
export class UsersModule {}
