import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../database/prisma.service';
@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}
  async assist(prompt: string, uid: string) {
    if (!process.env.OPENAI_API_KEY) throw new ServiceUnavailableException('AI service is not configured');
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const response = await client.chat.completions.create({ model, messages: [{ role: 'system', content: 'You are WiseSell AI, a practical business and sales assistant. Be accurate and concise.' }, { role: 'user', content: prompt }] });
    if (process.env.DATABASE_URL) await this.prisma.aiUsage.create({ data: { uid, model } }).catch(() => undefined);
    return { answer: response.choices[0]?.message?.content || '', model };
  }
}