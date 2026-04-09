import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDdWohv85n7cz6Siafohst8S7Y0AKHD2RU",
  authDomain: "samtechke-security.firebaseapp.com",
  projectId: "samtechke-security",
  storageBucket: "samtechke-security.firebasestorage.app",
  messagingSenderId: "250944796744",
  appId: "1:250944796744:web:ad19a91b7b45c52890c07d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// REMOVED: export const messaging = getMessaging(app);