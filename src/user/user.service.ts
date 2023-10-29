import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  @InjectRepository(User) userRepository: Repository<User>;

  async getAll() {
    return await this.userRepository.find();
  }

  async getById(id: string) {
    return await this.userRepository.findOneBy({ id: +id });
  }

  async update(id: string, body: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id: +id });

    if (!user) {
      throw new NotFoundException('Not found');
    }

    const updateUser = await this.userRepository.update(id, body);

    return updateUser;
  }
}
