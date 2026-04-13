import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDRCWFdvMt4_ylxHUHcm-8QpDbKvc-Oj_Y",
  authDomain: "expensetracker-35b03.firebaseapp.com",
  projectId: "expensetracker-35b03",
  storageBucket: "expensetracker-35b03.firebasestorage.app",
  messagingSenderId: "724363732757",
  appId: "1:724363732757:web:4f450c6d243d1dd663eb1c"
};

const app = initializeApp(firebaseConfig);

// Different auth setup for web vs mobile
let auth;
if (Platform.OS === 'web') {
  const { getAuth } = require('firebase/auth');
  auth = getAuth(app);
} else {
  const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
  const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

export { auth };
export const db = getFirestore(app);
export default app;