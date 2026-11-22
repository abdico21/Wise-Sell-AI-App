import { Injectable, UnauthorizedException } from '@nestjs/common';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
@Injectable()
export class FirebaseAuthService {
  async verify(token: string) {
    try {
      if (!getApps().length) {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        if (projectId && clientEmail && privateKey) initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
        else initializeApp();
      }
      return await getAuth().verifyIdToken(token);
    } catch { throw new UnauthorizedException('Invalid or expired bearer token'); }
  }
}