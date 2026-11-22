import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  health() {
    return { status: 'ok', service: 'wisesell-api', environment: process.env.NODE_ENV || 'staging' };
  }

  @Get('ready')
  async ready() {
    let database: 'ok' | 'not_configured' | 'error' = 'not_configured';
    if (process.env.DATABASE_URL) {
      try {
        await this.prisma.$queryRaw`SELECT 1`;
        database = 'ok';
      } catch {
        database = 'error';
      }
    }
    return { status: database === 'error' ? 'degraded' : 'ready', service: 'wisesell-api', checks: { database } };
  }
}
