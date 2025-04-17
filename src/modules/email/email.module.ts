import { Module } from '@nestjs/common';
import { EmailService } from './email.serivce';
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
