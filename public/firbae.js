// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOrnJmzhF6LGlUc5VqxCw-eg7en5vMLog",
  authDomain: "micropict-57834.firebaseapp.com",
  projectId: "micropict-57834",
  storageBucket: "micropict-57834.firebasestorage.app",
  messagingSenderId: "685393011060",
  appId: "1:685393011060:web:a3cd0df0d028e16ac94c21",
  measurementId: "G-2F8F09V33J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);