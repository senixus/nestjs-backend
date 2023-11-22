import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Express } from 'express';

@Controller('file')
export class FileController {
  @Inject() private readonly fileService: FileService;

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserAvatar(
    @Body() body: { userId: number },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.fileService.uploadUserAvatar(body.userId, file);
  }
}
