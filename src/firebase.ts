import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9JI8v2dQDUD0wx7CNQhRXqZ8W2xTvtn0",
  authDomain: "tracker-cee74.firebaseapp.com",
  projectId: "tracker-cee74",
  storageBucket: "tracker-cee74.firebasestorage.app",
  messagingSenderId: "1001477352233",
  appId: "1:1001477352233:web:740c5f532a76339b7a2538"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-tracker-0153b2da-d0d5-44eb-8698-544643d0168d");

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (err.code == 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});

export { app, db };
