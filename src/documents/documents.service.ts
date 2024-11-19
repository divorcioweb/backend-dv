import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import * as AWS from 'aws-sdk';
import * as fs from 'fs/promises'; // Para manipular arquivos no Node.js

@Injectable()
export class DocumentsService {
  constructor(
    private readonly db: ConnectionService,
    private jwtService: JwtService,
  ) {}

  async create(file: Express.Multer.File, token: string) {
    const userDecoded = await this.jwtService.decode(token);

    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS,
      },
    });

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
    };

    const { Key, Location } = await s3.upload(params).promise();

    const document = this.db.documento.create({
      data: {
        nome: Key,
        url: Location,
        usuario_id: userDecoded.id,
      },
    });

    return document;
  }

  async createFiles(files: any[], user: any) {
    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS,
      },
    });

    if (!process.env.S3_BUCKET_NAME) {
      throw new Error('S3 bucket name not configured in environment variables');
    }

    const uploadPromises = files.map(async (file) => {
      try {
        // Ler o arquivo diretamente do caminho do sistema de arquivos
        const fileBuffer = await fs.readFile(file.uri);

        const safeFileName =
          file.name?.replace(/[^a-zA-Z0-9-_\.]/g, '_') || 'default-name';

        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `${user.id}-${safeFileName}`, // Nome do arquivo sanitizado
          Body: fileBuffer,
          ContentType: file.mimeType, // Tipo MIME
        };

        const { Key, Location } = await s3.upload(params).promise();

        const document = await this.db.documento.create({
          data: {
            nome: Key,
            url: Location,
            usuario_id: user.id,
          },
        });

        return document;
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw new Error(`Failed to upload file: ${file.name}`);
      }
    });

    const uploadedDocuments = await Promise.all(uploadPromises);

    // Criar evento e atualizar o status do usuário
    await this.db.evento.create({
      data: {
        titulo: 'Documentos enviado',
        data: new Date().toISOString(),
        usuario_id: user.id,
      },
    });

    await this.db.usuario.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'Aguardando renúncia de alimentos',
      },
    });

    return uploadedDocuments;
  }

  async findMyDocs(token: string) {
    const userDecoded = await this.jwtService.decode(token);

    const myDocs = await this.db.documento.findMany({
      where: {
        usuario_id: userDecoded.id,
      },
    });

    return myDocs;
  }
}
