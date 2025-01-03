// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyBs7EOyYqAXc3B-fprQZyF5MveLsuhbE4s",
  authDomain: "socialevent-6ecc2.firebaseapp.com",
  projectId: "socialevent-6ecc2",
  storageBucket: "socialevent-6ecc2.firebasestorage.app",
  messagingSenderId: "193082872516",
  appId: "1:193082872516:web:2765615dcd3a7a0d3d6f91",
  measurementId: "G-GSBWPTGDKQ",
  databaseURL:  "https://socialevent-6ecc2-default-rtdb.firebaseio.com/",


};
// Initialize Firebase
const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebaseApp;

// Get the Firestore instance
export const firestore = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
