import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'your_api_key',
  authDomain: 'your_project_id.firebaseapp.com',
  projectId: 'your_project_id',
  storageBucket: 'your_project_id.appspot.com',
  messagingSenderId: 'your_sender_id',
  appId: 'your_app_id',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
