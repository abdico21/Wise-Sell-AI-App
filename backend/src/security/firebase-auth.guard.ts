import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthService } from './firebase-auth.service';
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly auth: FirebaseAuthService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) throw new UnauthorizedException('Bearer access token required');
    req.user = await this.auth.verify(header.slice(7));
    return true;
  }
}