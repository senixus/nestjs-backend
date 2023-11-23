import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'src/entities/file.entity';
import { User } from 'src/entities/user.entity';
import { UserController } from 'src/user/user.controller';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([File, User])],
  providers: [FileService],
  controllers: [],
})
export class FileModule {}
