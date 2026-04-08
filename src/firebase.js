import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAhFUo7ZtJ6-FV0AW7NrEIwGkN7YoVPqcM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "al-rahma-islamic-centre.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "al-rahma-islamic-centre",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "al-rahma-islamic-centre.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "930047631381",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:930047631381:web:8c126be961ab244de5ee1c",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://al-rahma-islamic-centre-default-rtdb.firebaseio.com",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-X3LMPL9E6Y"
}

const app = initializeApp(firebaseConfig)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
export const database = getDatabase(app)
export const storage = getStorage(app)
