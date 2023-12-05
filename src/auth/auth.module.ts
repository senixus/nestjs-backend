import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfirmationCodeEmail, RegisterEmail } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RefreshJwtStrategy } from './refreshJwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterEmail,
    ConfirmationCodeEmail,
    ConfigService,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
})
export class AuthModule {}
