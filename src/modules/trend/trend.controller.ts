import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrendService } from './trend.service';
import { CreateTrendDto } from './dto/create-trend.dto';

@Controller('trends')
export class TrendController {
  constructor(private readonly trendService: TrendService) {}

  @Get()
  async getAllTrends() {
    return this.trendService.getAllTrends();
  }

  @Get(':topic')
  async getTrend(@Param('topic') topic: string) {
    return this.trendService.getTrendByTopic(topic);
  }

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
    return this.trendService.notifyUsersByTopic(topic, summary, url);
  }

  @Post()
  async createTrend(@Body() dto: CreateTrendDto) {
    return this.trendService.create(dto);
  }
}
