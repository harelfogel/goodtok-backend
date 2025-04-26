import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionCreateParams } from 'openai/resources/chat/completions';
import { MCP_CONFIG_KEYS } from '../../common/constants/mcp.routes';
import { countTokens, estimateOpenAiCost } from 'src/utils/token-util';

@Injectable()
export class McpService {
  private readonly openai: OpenAI;
  private readonly model: string;
  private readonly systemPrompt: string;
  private readonly logger = new Logger(McpService.name);
  private readonly maxTokens = this.config.get<number>('MCP_MAX_TOKENS', 8_000); //  // hard context limit
  private readonly budgetUsd = this.config.get<number>('MCP_DAILY_BUDGET', 10); // optional daily ceiling

  constructor(private readonly config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY')!,
    });

    this.model = this.config.get<string>(MCP_CONFIG_KEYS.MODEL, 'gpt-4o-mini');
    this.systemPrompt = this.config.get<string>(
      MCP_CONFIG_KEYS.SYSTEM_PROMPT,
      'Summarize the following content in ≤120 words.',
    );
  }

  async summarize(text: string): Promise<string> {
    /* ---------- 1.  pre-flight token + cost estimate ---------- */

    const promptTokens = countTokens(this.systemPrompt, this.model);
    const inputTokens = countTokens(text, this.model);
    const estimatedOut = 180;
    const totalTokens = promptTokens + inputTokens + estimatedOut;
    const estCostUsd = estimateOpenAiCost(
      inputTokens + promptTokens,
      estimatedOut,
    );

    if (totalTokens > this.maxTokens) {
      throw new BadRequestException(
        `Input is too large: ${totalTokens} tokens > ${this.maxTokens} context window`,
      );
    }

    this.logger.verbose(
      `→ Tokens (in/out/total): ${inputTokens}/${estimatedOut}/${totalTokens}  |  ≈$${estCostUsd}`,
    );

    const params: ChatCompletionCreateParams = {
      model: this.model,
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: text },
      ],
    };

    this.logger.verbose(`Calling OpenAI model ${this.model}`);

    const { choices } = await this.openai.chat.completions.create(params);

    return choices[0]?.message?.content ?? 'No summary generated';
  }
}
