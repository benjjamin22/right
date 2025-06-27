// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJ_gCuSA8521ool3KsDmRHPNICxkg6YS4",
  authDomain: "micro-pict.firebaseapp.com",
  projectId: "micro-pict",
  storageBucket: "micro-pict.firebasestorage.app",
  messagingSenderId: "948489916346",
  appId: "1:948489916346:web:f104a15a66937f9929d783",
  measurementId: "G-SWLPPYP8K9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);