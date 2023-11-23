import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'src/entities/file.entity';
import { User } from 'src/entities/user.entity';
import { FileService } from 'src/file/file.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, File])],
  providers: [UserService, FileService],
  controllers: [UserController],
})
export class UserModule {}
