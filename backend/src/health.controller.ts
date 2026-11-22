import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}
  @Get('health') health() { return { status: 'ok', service: 'wisesell-api' }; }
  @Get('ready') async ready() {
    if (!process.env.DATABASE_URL) return { status: 'ready', service: 'wisesell-api', checks: { database: 'not_configured' } };
    try { await this.prisma.$queryRaw`SELECT 1`; return { status: 'ready', service: 'wisesell-api', checks: { database: 'ok' } }; }
    catch { return { status: 'degraded', service: 'wisesell-api', checks: { database: 'error' } }; }
  }
}