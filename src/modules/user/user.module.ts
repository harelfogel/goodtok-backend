import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { NotificationModule } from '../notifications/notification.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [NotificationModule, EmailModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
