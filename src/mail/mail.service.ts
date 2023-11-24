import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IEmailConfig } from 'src/interfaces/email.interface';

abstract class BaseEmailService {
  @Inject() public mailerService: MailerService;

  abstract sendMail(config: IEmailConfig): void;
}

@Injectable()
export class RegisterEmail extends BaseEmailService {
  configMail(name: string, email: string): void {
    const config = {
      to: email,
      subject: 'You have been registered successfully',
      text: `Hi ${name}, You have been registered successfully`,
    };

    this.sendMail(config);
  }

  async sendMail(config: IEmailConfig): Promise<void> {
    const response = await this.mailerService.sendMail(config);
    console.log(response);
  }
}

@Injectable()
export class ConfirmationCodeEmail extends BaseEmailService {
  configMail(email: string, code: string): void {
    const config = {
      to: email,
      subject: 'Your Confirmation Code',
      text: `Confirm your account with this code ${code}`,
    };

    this.sendMail(config);
  }

  async sendMail(config: IEmailConfig): Promise<void> {
    const response = await this.mailerService.sendMail(config);
    console.log(response);
  }
}

@Injectable()
export class CreateOrderEmail extends BaseEmailService {
  configMail(email: string): void {
    const config = {
      to: email,
      subject: 'Order Information',
      text: `Your order has been created successfully`,
    };

    this.sendMail(config);
  }

  async sendMail(config: IEmailConfig): Promise<void> {
    const response = await this.mailerService.sendMail(config);
    console.log(response);
  }
}
