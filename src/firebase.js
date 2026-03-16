import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAhFUo7ZtJ6-FV0AW7NrEIwGkN7YoVPqcM",
  authDomain: "al-rahma-islamic-centre.firebaseapp.com",
  projectId: "al-rahma-islamic-centre",
  storageBucket: "al-rahma-islamic-centre.firebasestorage.app",
  messagingSenderId: "930047631381",
  appId: "1:930047631381:web:8c126be961ab244de5ee1c",
  databaseURL: "https://al-rahma-islamic-centre-default-rtdb.firebaseio.com"
}

const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)
export const storage = getStorage(app)
