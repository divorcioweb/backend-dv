import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { ConnectionService } from 'src/connection/connection.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, ConnectionService, JwtService],
})
export class DocumentsModule {}
