import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { SigninDto } from './dto/sing-in.dto';
import { SignupDto } from './dto/sign-up.dto';
import { RegisterEmail, ConfirmationCodeEmail } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  @InjectRepository(User) userRepository: Repository<User>;
  @Inject() private jwtService: JwtService;
  @Inject() registerEmail: RegisterEmail;
  @Inject() confirmationCodeEmail: ConfirmationCodeEmail;

  async signin(body: SigninDto) {
    const user = await this.userRepository.findOneOrFail({
      where: { email: body.email },
      select: ['email', 'firstName', 'lastName', 'password', 'id', 'role'],
    });

    if (!user) {
      throw new NotFoundException('Not found');
    }

    const isMatched = await bcrypt.compare(body.password, user.password);
    if (!isMatched) {
      throw new BadRequestException('Password or email is incorrect');
    }
    const accessToken = await this.createJwtToken(user);

    delete user.password;

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

    const accessToken = await this.createJwtToken(savedUser);

    this.registerEmail.configMail(savedUser.firstName, savedUser.email);

    return {
      ...savedUser,
      accessToken,
    };
  }

  async sendResetPasswordCode(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('There is no user with that email address!');
    }

    const code = this.generateCode();

    user.resetPasswordCode = `${code}`;
    user.resetPasswordCodeExpire = Date.now() + 3600 * 1000;

    await this.userRepository.save(user);

    this.confirmationCodeEmail.configMail(email, `${code}`);

    return {
      message:
        'Your confirmation code has been sent please check your e-mail address',
    };
  }

  async resetPassword(
    code: string,
    email: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('There is no user with that email address!');
    }

    if (user.resetPasswordCodeExpire < Date.now()) {
      throw new UnauthorizedException('The code has been expired');
    }

    if (user.resetPasswordCode !== code) {
      throw new NotFoundException('The code has not been found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = null;
    user.resetPasswordCodeExpire = null;

    await this.userRepository.save(user);

    return {
      message: 'Your password has been updated successfully',
    };
  }

  generateCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async createJwtToken(user: User): Promise<string> {
    return this.jwtService.sign({ ...user });
  }
}
