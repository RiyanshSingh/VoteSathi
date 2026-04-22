// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsZ2UXZ0xsMY2Ij6PlSDNNk0g78dPBDS4",
  authDomain: "votesathi-87dca.firebaseapp.com",
  projectId: "votesathi-87dca",
  storageBucket: "votesathi-87dca.firebasestorage.app",
  messagingSenderId: "910017619357",
  appId: "1:910017619357:web:f09fb77f4d1f11b252fb74",
  measurementId: "G-SG5NMLBZBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

// Initialize AI Logic
const ai = getAI(app, { backend: new GoogleAIBackend() });

export { app, analytics, db, auth, functions, ai, getGenerativeModel };
