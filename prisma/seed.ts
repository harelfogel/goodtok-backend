import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.trend.createMany({
    data: [
      {
        topic: 'a2a',
        title: '🔥 A2A is Trending!',
        summary: 'Agent-to-Agent communication is blowing up across AI.',
        url: 'https://goodtok.ai/trends/a2a',
      },
      {
        topic: 'mcp',
        title: '🧠 MCP is the Future of Model Coordination',
        summary: 'MCP enables LLMs to coordinate across agents.',
        url: 'https://goodtok.ai/trends/mcp',
      },
    ],
    skipDuplicates: true,
  });
}

main().finally(() => prisma.$disconnect());
