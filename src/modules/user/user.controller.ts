import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import {
  USER_ROUTES,
  USER_PARAM_KEYS,
  USER_BODY_KEYS,
} from '../../common/constants/user.routes';
import { NotificationService } from '../notifications/notification.service';
import { EmailService } from '../email/email.serivce';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller(USER_ROUTES.ROOT)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
  ) {}
  @Get(USER_ROUTES.GET_ALL)
  async getUsers() {
    return this.userService.getAllUsers();
  }

  @Post(USER_ROUTES.CREATE)
  async createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body.email);
  }

  @Get(USER_ROUTES.PREFERENCES)
  async getPreferences(@Param(USER_PARAM_KEYS.ID) userId: string) {
    return this.userService.getUserPreferences(userId);
  }

  @Post(USER_ROUTES.PREFERENCES)
  async addPreference(
    @Param(USER_PARAM_KEYS.ID) userId: string,
    @Body(USER_BODY_KEYS.TOPIC) topic: string,
  ) {
    return this.userService.addPreference(userId, topic);
  }

  @Post(USER_ROUTES.SUBSCRIBE)
  async subscribeToPush(
    @Param(USER_PARAM_KEYS.ID) userId: string,
    @Body()
    body: {
      endpoint: string;
      keys: {
        p256dh: string;
        auth: string;
      };
    },
  ) {
    return this.userService.savePushSubscription(userId, body);
  }

  @Post(':id/test-email')
  async testEmail(@Param(USER_PARAM_KEYS.ID) userId: string) {
    const user = await this.userService.getAllUsers();
    const target = user.find((u) => u.id === userId);
    if (!target) return { error: 'User not found' };

    const subject = '🔥 A2A is Trending!';
    const html = `
    <h2>🔥 A2A is Trending!</h2>
    <p>Agent-to-Agent workflows are exploding in AI right now.</p>
    <p><a href="https://goodtok.ai/trend/a2a">Click to read more</a></p>
  `;

    await this.emailService.sendTrendEmail(target.email, subject, html);
    return { success: true };
  }

  @Patch(':id')
  async updateUser(
    @Param(USER_PARAM_KEYS.ID) userId: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, data);
  }
}
