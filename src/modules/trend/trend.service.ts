import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.serivce';
import { CreateTrendDto } from './dto/create-trend.dto';

@Injectable()
export class TrendService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async getAllTrends() {
    return this.prisma.trend.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTrendByTopic(topic: string) {
    const trend = await this.prisma.trend.findUnique({
      where: { topic },
    });

    if (!trend) {
      throw new NotFoundException(`Trend with topic "${topic}" not found`);
    }

    return trend;
  }

  async notifyUsersByTopic(topic: string, summary: string, url?: string) {
    const users = await this.prisma.user.findMany({
      where: {
        preferences: {
          some: { topic },
        },
      },
    });

    const subject = `🔥 ${topic.toUpperCase()} is Trending!`;
    const html = `
      <h2>${subject}</h2>
      <p>${summary}</p>
      <p><a href="${
        url || 'https://goodtok.ai'
      }">Click here to read more</a></p>
    `;

    const sendPromises = users.map((user) =>
      this.emailService.sendTrendEmail(user.email, subject, html),
    );

    await Promise.all(sendPromises);

    return {
      sent: users.length,
      topic,
      recipients: users.map((u) => u.email),
    };
  }

  async create(dto: CreateTrendDto) {
    return this.prisma.trend.create({ data: dto });
  }
}
