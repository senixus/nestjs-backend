import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  CreateOrderEmail,
  ConfirmationCodeEmail,
  RegisterEmail,
} from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          secure: false,
          port: configService.get('SMTP_PORT'),
          auth: {
            user: configService.get('SMTP_EMAIL'),
            pass: configService.get('SMTP_PASS'),
          },
        },
      }),
    }),
  ],
  providers: [CreateOrderEmail, ConfirmationCodeEmail, RegisterEmail],
})
export class MailModule {}
