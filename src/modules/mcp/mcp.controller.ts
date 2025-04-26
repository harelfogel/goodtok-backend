import { Body, Controller, Post } from '@nestjs/common';
import { McpService } from './mcp.service';
import { SummarizeDto } from './dto/summarize.dto';
import { MCP_ROUTES } from '../../common/constants/mcp.routes';

@Controller(MCP_ROUTES.ROOT)
export class McpController {
  constructor(private readonly mcp: McpService) {}

  @Post(MCP_ROUTES.SUMMARIZE)
  async summarize(@Body() dto: SummarizeDto) {
    const summary = await this.mcp.summarize(dto.text);
    return { summary };
  }
}
