import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'wisesell-api', environment: process.env.NODE_ENV || 'staging' };
  }

  @Get('ready')
  ready() {
    const checks = {
      supabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
    };
    const ready = Object.values(checks).every(Boolean);
    if (!ready) {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        service: 'wisesell-api',
        checks: {
          supabase: checks.supabase ? 'configured' : 'missing_configuration',
          openai: checks.openai ? 'configured' : 'missing_configuration',
        },
      });
    }
    return {
      status: 'ready',
      service: 'wisesell-api',
      checks: { supabase: 'configured', openai: 'configured' },
    };
  }
}
