// src/lib/firebase/config.js
import { initializeApp, getApps } from "firebase/app";
// Import other Firebase services as needed, e.g., getAuth
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase project configuration
// It's strongly recommended to use environment variables for these values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use the existing app instance
}

// Export the Firebase app instance and other services like auth
const auth = getAuth(app);

export { app, auth }; // Export auth along with app
