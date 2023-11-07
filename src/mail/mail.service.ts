import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMail } from 'src/interfaces/mail.interface';

@Injectable()
export class MailService {
  @Inject() private mailerService: MailerService;

  async registerMail(name: string, email: string) {
    const config = {
      to: email,
      subject: 'You have been registered successfully',
      text: `Hi ${name}, You have been registered successfully`,
    };
    await this.mailTemplate(config);
  }

  async sendConfirmationCode(email: string, code: string) {
    const config = {
      to: email,
      subject: 'Your Confirmation Code',
      text: `Confirm your account with this code ${code}`,
    };
    await this.mailTemplate(config);
  }

  async mailTemplate(data: IMail) {
    const config: IMail = {
      to: data.to, // list of receivers
      //   from: 'noreply@nestjs.com', // sender address
      subject: data.subject, // Subject line
      text: data.text, // plaintext body
    };
    if (data.html) config.html = data.html;
    const response = await this.mailerService.sendMail(data);
    console.log(response);
  }
}
