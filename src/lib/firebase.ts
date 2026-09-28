import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, Category, BrandingConfig, Order } from '../types';
import { INITIAL_BRANDING, INITIAL_CATEGORIES, INITIAL_PRODUCTS, DEMO_TRACKING_ORDERS } from '../data/initialData';

// Initialize Firebase App safely
let app: any;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (err) {
  console.warn('Firebase initializeApp error:', err);
}

// Initialize Firestore safely
let dbInstance: Firestore;
try {
  const customDbId = (firebaseConfig as any)?.firestoreDatabaseId;
  dbInstance = customDbId ? getFirestore(app, customDbId) : getFirestore(app);
} catch (err) {
  console.warn('Firestore initialization fallback:', err);
  try {
    dbInstance = getFirestore(app);
  } catch (err2) {
    console.warn('Firestore complete fallback:', err2);
    dbInstance = {} as Firestore;
  }
}

export const db: Firestore = dbInstance;

// Seed initial collections if empty so the storefront works immediately
let isSeeding = false;
export async function seedInitialFirestoreData() {
  if (isSeeding) return;
  isSeeding = true;
  try {
    // Check products
    const prodSnap = await getDocs(collection(db, 'products'));
    if (prodSnap.empty) {
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
    }

    // Check categories
    const catSnap = await getDocs(collection(db, 'categories'));
    if (catSnap.empty) {
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
    }

    // Check branding
    const brandRef = doc(db, 'branding', 'store_config');
    const brandSnap = await getDoc(brandRef);
    if (!brandSnap.exists()) {
      await setDoc(brandRef, INITIAL_BRANDING);
    }

    // Seed demo tracking order if needed
    const demoOrder = DEMO_TRACKING_ORDERS['ALF-81771'];
    if (demoOrder) {
      const orderRef = doc(db, 'orders', demoOrder.id);
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) {
        await setDoc(orderRef, demoOrder);
      }
    }
  } catch (err) {
    console.warn('Firestore initial seeding error (continuing with local cache):', err);
  } finally {
    isSeeding = false;
  }
}

// Generate human-friendly Bengali/Bangladeshi boutique Order ID like ALF-84912
export function generateOrderId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ALF-${randomNum}`;
}

// Generate courier tracking code like STF-XXXXXX
export function generateCourierTrackingCode(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `STF-${randomNum}`;
}

// Save Order to Firestore
export async function createStorefrontOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'courierTrackingCode' | 'status' | 'courierPartner' | 'timelineNotes'>): Promise<Order> {
  const orderId = generateOrderId();
  const courierTrackingCode = generateCourierTrackingCode();
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...orderData,
    id: orderId,
    courierTrackingCode,
    courierPartner: 'Steadfast Courier (স্টেডফাস্ট এক্সপ্রেস)',
    status: 'placed',
    createdAt: now,
    timelineNotes: [
      {
        status: 'placed',
        time: 'এইমাত্র',
        description: 'গ্রাহক দ্বারা ক্যাশ অন ডেলিভারি অর্ডার সাবমিট করা হয়েছে। আমাদের প্রতিনিধি শিঘ্রই কল করে কনফার্ম করবেন।',
      },
    ],
  };

  try {
    await setDoc(doc(db, 'orders', orderId), {
      ...newOrder,
      firestoreTimestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to write order to Firestore:', err);
    // Fallback: save to localStorage for persistence
    try {
      const stored = JSON.parse(localStorage.getItem('alfeena_local_orders') || '{}');
      stored[orderId] = newOrder;
      localStorage.setItem('alfeena_local_orders', JSON.stringify(stored));
    } catch (e) {
      // ignore
    }
  }

  return newOrder;
}

// Fetch or listen to an order by Order ID, Courier Tracking Code, or Customer Mobile Number
export async function searchOrderByQuery(searchQuery: string): Promise<Order | null> {
  const cleanQuery = searchQuery.trim();
  if (!cleanQuery) return null;

  // 1. Try direct doc ID match (e.g. ALF-81771 or without ALF- prefix)
  const normalizedId = cleanQuery.toUpperCase().startsWith('ALF-')
    ? cleanQuery.toUpperCase()
    : `ALF-${cleanQuery.toUpperCase()}`;

  try {
    // Try exact ID
    const directDoc = await getDoc(doc(db, 'orders', normalizedId));
    if (directDoc.exists()) {
      return directDoc.data() as Order;
    }
    // Also try direct without prefix
    const rawDoc = await getDoc(doc(db, 'orders', cleanQuery));
    if (rawDoc.exists()) {
      return rawDoc.data() as Order;
    }

    // 2. Query by Courier Tracking Code
    const courierQ = query(collection(db, 'orders'), where('courierTrackingCode', '==', cleanQuery.toUpperCase()));
    const courierSnap = await getDocs(courierQ);
    if (!courierSnap.empty) {
      return courierSnap.docs[0].data() as Order;
    }

    // 3. Query by Mobile Number (normalized)
    const rawDigits = cleanQuery.replace(/\D/g, '');
    if (rawDigits.length >= 10) {
      const mobileQ = query(collection(db, 'orders'), where('mobile', '==', cleanQuery));
      const mobileSnap = await getDocs(mobileQ);
      if (!mobileSnap.empty) {
        return mobileSnap.docs[0].data() as Order;
      }
      // Also try last 11 digits
      const standardBD = rawDigits.slice(-11);
      const bdMobileQ = query(collection(db, 'orders'), where('mobile', '==', standardBD));
      const bdMobileSnap = await getDocs(bdMobileQ);
      if (!bdMobileSnap.empty) {
        return bdMobileSnap.docs[0].data() as Order;
      }
    }
  } catch (err) {
    console.warn('Error querying Firestore for order:', err);
  }

  // Check demo orders fallback
  if (DEMO_TRACKING_ORDERS[normalizedId]) {
    return DEMO_TRACKING_ORDERS[normalizedId] as Order;
  }
  if (DEMO_TRACKING_ORDERS[cleanQuery]) {
    return DEMO_TRACKING_ORDERS[cleanQuery] as Order;
  }
  for (const o of Object.values(DEMO_TRACKING_ORDERS)) {
    if (
      o.mobile === cleanQuery ||
      o.courierTrackingCode === cleanQuery ||
      o.id?.toLowerCase() === cleanQuery.toLowerCase()
    ) {
      return o as Order;
    }
  }

  // Check local storage fallback
  try {
    const stored = JSON.parse(localStorage.getItem('alfeena_local_orders') || '{}');
    if (stored[normalizedId]) return stored[normalizedId];
    if (stored[cleanQuery]) return stored[cleanQuery];
    for (const key of Object.keys(stored)) {
      const o = stored[key];
      if (
        o.mobile === cleanQuery ||
        o.courierTrackingCode === cleanQuery ||
        o.id?.toLowerCase() === cleanQuery.toLowerCase()
      ) {
        return o;
      }
    }
  } catch (e) {
    // ignore
  }

  return null;
}
