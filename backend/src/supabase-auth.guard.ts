import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, User } from '@supabase/supabase-js';
import { Request } from 'express';

export type AuthenticatedRequest = Request & { user: User };

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization || '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) throw new UnauthorizedException('Bearer access token required');

    const url = process.env.SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !publishableKey) throw new ServiceUnavailableException('Supabase authentication is not configured');

    const supabase = createClient(url, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data, error } = await supabase.auth.getUser(match[1]);
    if (error || !data.user) throw new UnauthorizedException('Invalid or expired access token');
    request.user = data.user;
    return true;
  }
}
