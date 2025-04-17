import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './modules/email/email.module';
import { TrendModule } from './modules/trend/trend.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    NotificationModule,
    EmailModule,
    TrendModule,
  ],
})
export class AppModule {}
