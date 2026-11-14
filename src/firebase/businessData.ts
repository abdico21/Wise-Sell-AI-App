import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { auth, db } from './config';

export type BusinessRecordType = 'customer' | 'product' | 'lead' | 'order';

export interface BusinessRecord<T = Record<string, unknown>> {
  id: string;
  ownerId: string;
  recordType: BusinessRecordType;
  data: T;
  createdAt?: unknown;
  updatedAt?: unknown;
}

function requireUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Please sign in to access business records.');
  return uid;
}

function recordsCollection() {
  return collection(db, 'business_records');
}

/** Listen only to records owned by the currently signed-in Firebase user. */
export function watchBusinessRecords<T>(
  recordType: BusinessRecordType,
  onRecords: (records: BusinessRecord<T>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const ownerId = requireUserId();
  const q = query(
    recordsCollection(),
    where('ownerId', '==', ownerId),
  );

  return onSnapshot(q, snapshot => {
    onRecords(snapshot.docs
      .filter(item => item.data().recordType === recordType)
      .map(item => ({
        id: item.id,
        ...(item.data() as Omit<BusinessRecord<T>, 'id'>),
      })));
  }, error => onError?.(error));
}

/** Create a customer, product, lead, or order without overwriting existing records. */
export async function createBusinessRecord<T>(
  recordType: BusinessRecordType,
  data: T,
): Promise<string> {
  const ownerId = requireUserId();
  const result = await addDoc(recordsCollection(), {
    ownerId,
    recordType,
    data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return result.id;
}

/** Update only the data payload of a record owned by the signed-in user. */
export async function updateBusinessRecord<T>(
  recordId: string,
  data: T,
): Promise<void> {
  const ownerId = requireUserId();
  await updateDoc(doc(db, 'business_records', recordId), {
    ownerId,
    data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete only a record owned by the signed-in user. */
export async function deleteBusinessRecord(recordId: string): Promise<void> {
  requireUserId();
  await deleteDoc(doc(db, 'business_records', recordId));
}
