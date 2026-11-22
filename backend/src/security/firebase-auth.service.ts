import { Injectable, UnauthorizedException } from '@nestjs/common';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseAuthService {
  private configured = false;

  private ensureInitialized() {
    if (this.configured) return;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!projectId) throw new UnauthorizedException('Firebase authentication is not configured');
    if (!getApps().length) {
      if (clientEmail && privateKey) {
        initializeApp({ credential: require('firebase-admin/app').cert({ projectId, clientEmail, privateKey }) });
      } else {
        initializeApp({ credential: applicationDefault(), projectId });
      }
    }
    this.configured = true;
  }

  async verifyBearer(header?: string) {
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedException('Bearer access token required');
    this.ensureInitialized();
    try {
      return await getAuth().verifyIdToken(header.slice(7), true);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
