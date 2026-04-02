import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendActivationMail(to: string, token: string) {
    const url = `https://avltu-frontend.vercel.app/auth/activate/${token}`;
    await this.mailerService.sendMail({
      to,
      subject: 'Activation account',
      html: `
        <div>
          <h1>Для активации перейдите по ссылке:</h1>
          <a href="${url}">${url}</a>
        </div>
      `,
    });
  }
}
