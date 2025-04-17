import { Module } from '@nestjs/common';
import { TrendController } from './trend.controller';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [TrendController],
})
export class TrendModule {}
