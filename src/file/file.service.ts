import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/entities/file.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  @InjectRepository(File) fileRepository: Repository<File>;
  @InjectRepository(User) userRepository: Repository<User>;
  @Inject() configService: ConfigService;

  async uploadUserAvatar(id: number, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({
      relations: {
        avatar: true,
      },
      where: { id },
    });

    if (!user) throw new NotFoundException('There is no user');

    let oldKey = user?.avatar && user?.avatar?.key;
    await this.deleteFile(oldKey);

    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: file.buffer,
        Key: `${uuid()}-${file.originalname}`,
      })
      .promise();

    const fileData = await this.fileRepository.findOneBy({ key: oldKey });

    const newFile = await this.fileRepository.save({
      ...fileData,
      key: uploadResult.Key,
      url: uploadResult.Location,
    });

    user.avatar = newFile;
    user.avatarUrl = uploadResult.Location;

    await this.userRepository.save(user);
  }

  async deleteFile(key: string) {
    const s3 = new S3();

    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: key,
      })
      .promise();
  }
}
