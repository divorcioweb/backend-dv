import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],  // Importa o JwtModule
  providers: [ConnectionService],
  exports: [ConnectionService, JwtModule],  // Exporta o JwtModule
})
export class ConnectionModule {}
