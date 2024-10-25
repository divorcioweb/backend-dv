import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import * as AWS from 'aws-sdk';

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

  async createFiles(
    files: {
      content: string;
      contentType: string;
      nome: string;
      tipo: string;
    }[],
    token: string,
  ) {
    const userDecoded = await this.jwtService.decode(token);
    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS,
      },
    });

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(file.content, 'base64');

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.nome,
        Body: buffer,
      };

      // Fazendo o upload do arquivo
      const { Key, Location } = await s3.upload(params).promise();

      // Criando o documento na base de dados
      const document = await this.db.documento.create({
        data: {
          nome: Key,
          url: Location,
          usuario_id: userDecoded.id,
        },
      });

      console.log('here', document);

      return document;
    });

    // Espera todos os uploads serem concluídos
    const uploadedDocuments = await Promise.all(uploadPromises);

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
