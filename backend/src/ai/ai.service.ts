import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AiService {
  private client?: OpenAI;
  constructor(private readonly prisma: PrismaService) {}

  async assist(uid: string, prompt: string) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new ServiceUnavailableException('AI provider is not configured for staging');
    if (!this.client) this.client = new OpenAI({ apiKey: key });
    const result = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are WiseSell AI, a practical business sales and marketing assistant. Give safe, clear, actionable advice.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 700
    });
    if (process.env.DATABASE_URL) {
      await this.prisma.aiUsageLog.create({ data: { firebaseUid: uid, feature: 'assist' } }).catch(() => undefined);
    }
    return { answer: result.choices[0]?.message?.content || '', model: result.model };
  }
}
