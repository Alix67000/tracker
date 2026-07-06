import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9JI8v2dQDUD0wx7CNQhRXqZ8W2xTvtn0",
  authDomain: "tracker-cee74.firebaseapp.com",
  projectId: "tracker-cee74",
  storageBucket: "tracker-cee74.firebasestorage.app",
  messagingSenderId: "1001477352233",
  appId: "1:1001477352233:web:b8047bc9ac54037d7a2538"
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
