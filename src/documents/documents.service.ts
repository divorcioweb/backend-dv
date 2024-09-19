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
