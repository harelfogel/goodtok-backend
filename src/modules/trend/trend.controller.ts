import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.serivce';

@Controller('trends')
export class TrendController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  @Post('notify')
  async notifyByTopic(
    @Body()
    body: {
      topic: string;
      summary: string;
      url?: string;
    },
  ) {
    const { topic, summary, url } = body;

    const users = await this.prisma.user.findMany({
      where: {
        preferences: {
          some: { topic },
        },
      },
    });

    const sendPromises = users.map((user) =>
      this.emailService.sendTrendEmail(
        user.email,
        `🔥 ${topic.toUpperCase()} is Trending!`,
        `
          <h2>🔥 ${topic} is trending now!</h2>
          <p>${summary}</p>
          <p><a href="${
            url || 'https://goodtok.ai'
          }">Click here to read more</a></p>
        `,
      ),
    );

    await Promise.all(sendPromises);

    return {
      sent: users.length,
      topic,
      recipients: users.map((u) => u.email),
    };
  }
}
