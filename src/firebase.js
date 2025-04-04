import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBRtX8jAObZVn-TeQY23C8mjI-B_8gmX9s',
  authDomain: 'aimly-b0f7a.firebaseapp.com',
  projectId: 'aimly-b0f7a',
  storageBucket: 'aimly-b0f7a.appspot.com',
  messagingSenderId: '291863592707',
  appId: '1:291863592707:web:fb9ae8770086951b913336',
  measurementId: 'G-47KKW3NF8Y',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);
