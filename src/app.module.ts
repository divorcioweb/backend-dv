import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConnectionService } from './connection/connection.service';
import { ConnectionModule } from './connection/connection.module';
import { AppController } from './app.controller';


@Module({
  imports: [UsersModule, AuthModule, ConnectionModule],
  controllers: [AppController],
  providers: [ConnectionService],
})
export class AppModule {}
