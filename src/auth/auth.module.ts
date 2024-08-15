import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConnectionService } from 'src/connection/connection.service';
import { ResendService } from 'src/resend/resend.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtService,
    ConnectionService,
    ResendService,
  ],
})
export class AuthModule {}
