import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  browserLocalPersistence, 
  setPersistence 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc 
} from 'firebase/firestore';

// Core Firebase configuration from provisioned environment
const firebaseConfig = {
  apiKey: "AIzaSyAa4L7WjNhCgpVH9mX1YnD6WKT7JCOVSXE",
  authDomain: "abstract-gist-xt3g1.firebaseapp.com",
  projectId: "abstract-gist-xt3g1",
  storageBucket: "abstract-gist-xt3g1.firebasestorage.app",
  messagingSenderId: "869529863414",
  appId: "1:869529863414:web:1eee38452acb090c0898d7"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with browser persistent storage
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Firebase Persistence Error:", err);
});

// Initialize Firestore Database with custom database ID
const db = getFirestore(app, "ai-studio-campuscareai-04695522-c0c3-4e49-b22f-879273a94104");

// Validate Firestore Connection on App Boot
async function validateConnection() {
  try {
    await getDoc(doc(db, 'system', 'connection_probe'));
    console.log("Firebase Firestore Connection: ONLINE & VERIFIED");
  } catch (error: any) {
    console.info("Firestore operating in local/offline persistent state.");
  }
}

validateConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export { app, auth, db };
