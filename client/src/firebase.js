// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASEAPIKEY,
  authDomain: "portfolio-blog-16951.firebaseapp.com",
  projectId: "portfolio-blog-16951",
  storageBucket: "portfolio-blog-16951.firebasestorage.app",
  messagingSenderId: "676813643672",
  appId: "1:676813643672:web:1f524a7549701303c455ed"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);