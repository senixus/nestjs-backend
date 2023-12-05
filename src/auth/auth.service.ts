import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  @InjectRepository(User) userRepository: Repository<User>;
  @Inject() private jwtService: JwtService;
  @Inject() private configService: ConfigService;
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
    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user),
    ]);

    this.hashRefreshToken(user.id, refreshToken);
    delete user.password;

    return {
      ...user,
      accessToken,
      refreshToken,
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

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(savedUser),
      this.createRefreshToken(savedUser),
    ]);
    this.hashRefreshToken(savedUser.id, refreshToken);
    this.registerEmail.configMail(savedUser.firstName, savedUser.email);

    return {
      ...savedUser,
      accessToken,
      refreshToken,
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

  async createAccessToken(user: User): Promise<string> {
    return await this.jwtService.signAsync(
      { ...user },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      },
    );
  }

  async createRefreshToken(user: User): Promise<string> {
    return await this.jwtService.signAsync(
      { ...user },
      {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: 60 * 60 * 24 * 7,
      },
    );
  }

  async hashRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userRepository.update(
      { id: userId },
      { currentHashedRefreshToken: hashedRefreshToken },
    );
  }

  async refreshToken(
    id: number,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshTokn: string }> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const [accessToken, refreshTokn] = await Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user),
    ]);
    this.hashRefreshToken(user.id, refreshTokn);
    return {
      accessToken,
      refreshTokn,
    };
  }
}
