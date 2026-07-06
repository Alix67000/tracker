import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// REMPLACER par vos clés si vous déployez hors de ce projet
// const firebaseConfig = {
//   apiKey: "VOTRE_API_KEY",
//   authDomain: "VOTRE_AUTH_DOMAIN",
//   projectId: "VOTRE_PROJECT_ID",
//   storageBucket: "VOTRE_STORAGE_BUCKET",
//   messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
//   appId: "VOTRE_APP_ID"
// };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (err.code == 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});

export { app, db };
