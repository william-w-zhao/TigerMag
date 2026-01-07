// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDX1aEckJeHypcOqLBEvEiwSuCcX2kAKEI",
  authDomain: "the-princeton-tiger.firebaseapp.com",
  projectId: "the-princeton-tiger",
  storageBucket: "the-princeton-tiger.firebasestorage.app",
  messagingSenderId: "97404712630",
  appId: "1:97404712630:web:ec785cc4717022825d1817",
  measurementId: "G-99C7WJV0HM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export {app}
export const db = getFirestore(app);