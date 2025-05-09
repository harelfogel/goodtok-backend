import { Module } from '@nestjs/common';
import { TrendController } from './trend.controller';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { TrendService } from './trend.service';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [TrendController],
  providers: [TrendService],
})
export class TrendModule {}
