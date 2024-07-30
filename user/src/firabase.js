// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-a58c8.firebaseapp.com",
  projectId: "mern-auth-a58c8",
  storageBucket: "mern-auth-a58c8.appspot.com",
  messagingSenderId: "138986592129",
  appId: "1:138986592129:web:b1a9f0d7069a9e66fbfa80"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);