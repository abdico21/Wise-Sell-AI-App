import type { InventoryItem, SalesOrder } from '../types';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  runTransaction,
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


/**
 * Atomically fulfill an order and deduct its stock exactly once.
 * Both records must belong to the current user and be saved in business_records.
 */
export function fulfillSalesOrder(
  orderRecordId: string,
  productRecordId: string,
  expectedProductId: string,
): Promise<{ alreadyFulfilled: boolean; remainingStock: number }> {
  const ownerId = requireUserId();
  const orderRef = doc(db, 'business_records', orderRecordId);
  const productRef = doc(db, 'business_records', productRecordId);

  return runTransaction(db, async transaction => {
    const [orderSnapshot, productSnapshot] = await Promise.all([
      transaction.get(orderRef),
      transaction.get(productRef),
    ]);

    if (!orderSnapshot.exists() || !productSnapshot.exists()) {
      throw new Error('The saved order or inventory product could not be found.');
    }

    const orderRecord = orderSnapshot.data() as Omit<BusinessRecord<SalesOrder>, 'id'>;
    const productRecord = productSnapshot.data() as Omit<BusinessRecord<InventoryItem>, 'id'>;
    if (orderRecord.ownerId !== ownerId || orderRecord.recordType !== 'order' ||
        productRecord.ownerId !== ownerId || productRecord.recordType !== 'product') {
      throw new Error('You do not have permission to fulfill this order.');
    }

    const order = orderRecord.data;
    const product = productRecord.data;
    if (order.productId !== expectedProductId || product.id !== expectedProductId) {
      throw new Error('The order product does not match the selected inventory record.');
    }
    if (order.status === 'Fulfilled') {
      return { alreadyFulfilled: true, remainingStock: product.totalStock };
    }
    if (order.status === 'Cancelled') {
      throw new Error('A cancelled order cannot be fulfilled.');
    }
    if (!Number.isInteger(order.quantity) || order.quantity < 1 ||
        !Number.isFinite(product.totalStock) || product.totalStock < order.quantity) {
      throw new Error('Insufficient stock. Update inventory before fulfilling this order.');
    }

    const remainingStock = product.totalStock - order.quantity;
    const updatedProduct: InventoryItem = {
      ...product,
      totalStock: remainingStock,
      stockStatus: remainingStock <= 0
        ? 'Critical Reorder'
        : remainingStock <= product.reorderPoint
          ? 'Low Stock'
          : 'In Stock',
    };
    const updatedOrder: SalesOrder = {
      ...order,
      status: 'Fulfilled',
    };

    transaction.update(productRef, {
      data: updatedProduct,
      updatedAt: serverTimestamp(),
    });
    transaction.update(orderRef, {
      data: updatedOrder,
      updatedAt: serverTimestamp(),
    });

    return { alreadyFulfilled: false, remainingStock };
  });
}
