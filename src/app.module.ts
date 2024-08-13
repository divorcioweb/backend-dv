import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConnectionService } from './connection/connection.service';
import { ConnectionModule } from './connection/connection.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [UsersModule, AuthModule, ConnectionModule, DocumentsModule],
  controllers: [],
  providers: [ConnectionService],
})
export class AppModule {}
