import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyDeUTVYRytfRkvVUTXSQwI1l-R-7LLf4nc",
  authDomain: "learning-app-ac2a9.firebaseapp.com",
  databaseURL: "https://learning-app-ac2a9-default-rtdb.firebaseio.com",
  projectId: "learning-app-ac2a9",
  storageBucket: "learning-app-ac2a9.appspot.com",
  messagingSenderId: "789934428672",
  appId: "1:789934428672:web:c8bba9511110fccfad7ee5",
  measurementId: "G-JP4YVK3JB1"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize the database service
const db = getDatabase(app);

// Initialize the storage service
const storage = getStorage(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

// Export the database and storage services
export { db, storage };

