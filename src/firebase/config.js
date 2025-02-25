import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVcz-dWpjX1UX9Yg7V1s3EWcEZiy0y3GE",
  authDomain: "ai-evento.firebaseapp.com",
  projectId: "ai-evento",
  storageBucket: "ai-evento.firebasestorage.app",
  messagingSenderId: "835727278537",
  appId: "1:835727278537:web:64634da96cae66a2ee6818",
  measurementId: "G-KDT77TMVZJ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
