/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD9JI8v2dQDUD0wx7CNQhRXqZ8W2xTvtn0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tracker-cee74.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tracker-cee74",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tracker-cee74.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1001477352233",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1001477352233:web:b8047bc9ac54037d7a2538"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (err.code == 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});

export { app, db };
