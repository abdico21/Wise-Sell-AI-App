import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with specific databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Connectivity validation helper as mandated by Firebase integration skill
export async function testFirebaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    // Attempt to reach firestore server
    await getDocFromServer(doc(db, 'system', 'ping'));
    return { connected: true };
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network is throttled.');
      return { connected: false, error: 'Offline / network unavailable' };
    }
    // A document not existing is still a successful server round-trip
    return { connected: true };
  }
}
