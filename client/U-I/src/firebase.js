// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_GOOGLE,
  authDomain: "reasl-estate.firebaseapp.com",
  projectId: "reasl-estate",
  storageBucket: "reasl-estate.firebasestorage.app",
  messagingSenderId: "280957485866",
  appId: "1:280957485866:web:1799da4e98ed7b0ed11453",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
