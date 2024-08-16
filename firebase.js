// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0-D5cMC4tzDxN95uegtkopsD0Yirt3fQ",
  authDomain: "flashcardsaas-57ab6.firebaseapp.com",
  projectId: "flashcardsaas-57ab6",
  storageBucket: "flashcardsaas-57ab6.appspot.com",
  messagingSenderId: "303829177883",
  appId: "1:303829177883:web:ab9fad7b213fe328070abe",
  measurementId: "G-YS2J6ESHJW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}