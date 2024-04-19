// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "house-hunter-9c2fb.firebaseapp.com",
  projectId: "house-hunter-9c2fb",
  storageBucket: "house-hunter-9c2fb.appspot.com",
  messagingSenderId: "1030232309525",
  appId: "1:1030232309525:web:bacdca43483e76fd9e731c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);