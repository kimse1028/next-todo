'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, inMemoryPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Firebase가 이미 초기화되었는지 확인
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// 개발 환경에서만 인메모리 지속성 설정
if (process.env.NODE_ENV === 'development') {
  setPersistence(auth, inMemoryPersistence)
    .then(() => console.log('Using in-memory persistence for development'))
    .catch((error) => console.error('Error setting persistence:', error));
}