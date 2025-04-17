import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: { preferences: true },
    });
  }

  async createUser(email: string) {
    return this.prisma.user.create({
      data: { email },
    });
  }

  async updateUser(userId: string, data: Partial<{ email: string }>) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async getUserPreferences(userId: string) {
    return this.prisma.subscriptionPreference.findMany({
      where: { userId },
    });
  }

  async addPreference(userId: string, topic: string) {
    return this.prisma.subscriptionPreference.create({
      data: {
        userId,
        topic,
      },
    });
  }

  async savePushSubscription(
    userId: string,
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  ) {
    return this.prisma.pushSubscription.create({
      data: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });
  }
}
