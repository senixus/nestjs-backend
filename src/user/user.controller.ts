import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileService } from 'src/file/file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('user')
export class UserController {
  @Inject() private readonly userService: UserService;
  @Inject() private readonly fileService: FileService;

  @Get('/all')
  async getAll() {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.userService.getById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.userService.update(id, body);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserAvatar(
    @Body() body: { userId: number },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.fileService.uploadUserAvatar(body.userId, file);
  }
}
