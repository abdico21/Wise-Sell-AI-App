import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly auth: FirebaseAuthService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    request.user = await this.auth.verifyBearer(request.headers.authorization);
    return true;
  }
}
