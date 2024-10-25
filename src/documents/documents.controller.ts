import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MultipartDTO } from './documents.dto';

@ApiTags('Documentos')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a file',
    type: MultipartDTO,
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() request) {
    const token = request.headers.authorization.split(' ')[1];
    return this.documentsService.create(file, token);
  }

  @Post('several')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'Upload multiple files',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       files: {
  //         type: 'array',
  //         items: {
  //           type: 'string',
  //           format: 'binary',
  //         },
  //       },
  //     },
  //   },
  // })
  // @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Body()
    files: {
      content: string;
      contentType: string;
      nome: string;
      tipo: string;
    }[],
    @Req() request,
  ) {
    const token = request.headers.authorization.split(' ')[1];
    return this.documentsService.createFiles(files, token);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async findDocsByUser(@Req() request) {
    const token = request.headers.authorization.split(' ')[1];
    return this.documentsService.findMyDocs(token);
  }
}
