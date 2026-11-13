import { initializeApp, getApps, getApp } from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import "firebase/storage";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDTJdsA9aZEC35Pol7RYb3sHSoxDOKnnPQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "onevishwam.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "onevishwam",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "onevishwam.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "908343500611",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:908343500611:web:2ba677380f919e47a299f6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-133T6N8Y23",
};

// Initialize Firebase (singleton pattern)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;


