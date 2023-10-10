// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcOrZw7A0Ew5ewlRb8ThcuibjVS7Pu_gQ",
  authDomain: "todos-app-f2f15.firebaseapp.com",
  projectId: "todos-app-f2f15",
  storageBucket: "todos-app-f2f15.appspot.com",
  messagingSenderId: "290942910093",
  appId: "1:290942910093:web:083e8a3e05a1940d2eacc4",
  measurementId: "G-79F1RGX370",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
