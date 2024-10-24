import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import * as AWS from 'aws-sdk';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class DocumentsService {
  private s3: S3Client;

  constructor(
    private readonly db: ConnectionService,
    private jwtService: JwtService,
  ) {
    this.s3 = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS,
      },
    });
  }

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

  async createFiles(files: Express.Multer.File[], token: string) {
    const userDecoded = await this.jwtService.decode(token);

    const uploadedDocuments = [];

    for (const file of files) {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
      };

      const command = new PutObjectCommand(params);
      await this.s3.send(command);

      const document = await this.db.documento.create({
        data: {
          nome: file.originalname,
          url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${file.originalname}`,
          usuario_id: userDecoded.id,
        },
      });

      uploadedDocuments.push(document);
    }

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
