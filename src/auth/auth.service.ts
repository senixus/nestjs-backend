import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { SigninDto } from './dto/sing-in.dto';
import { SignupDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  @InjectRepository(User) userRepository: Repository<User>;
  @Inject() private jwtService: JwtService;

  async signin(body: SigninDto) {
    const user = await this.userRepository.findOneBy({ email: body.email });

    if (!user) {
      throw new NotFoundException('Not found');
    }

    const isMatched = await bcrypt.compare(body.password, user.password);
    if (!isMatched) {
      throw new BadRequestException('Password or email is incorrect');
    }
    const accessToken = await this.createJwtToken(user.id);
    return {
      ...user,
      accessToken,
    };
  }

  async signup(body: SignupDto) {
    const checkUserExists = await this.userRepository.findOneBy({
      email: body.email,
    });
    if (checkUserExists) {
      throw new ConflictException('This email already exists');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const savedUser = await this.userRepository.save({
      ...body,
      password: hashedPassword,
    });

    const accessToken = await this.createJwtToken(savedUser.id);

    return {
      ...savedUser,
      accessToken,
    };
  }

  async createJwtToken(id: number) {
    return this.jwtService.sign({ id });
  }
}
