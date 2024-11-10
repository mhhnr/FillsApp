// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZuq_cAk81kejQ_89F7uJiyGxm0NuBZOg",
  authDomain: "fillsapp.firebaseapp.com",
  projectId: "fillsapp",
  storageBucket: "fillsapp.firebasestorage.app",
  messagingSenderId: "17652565478",
  appId: "1:17652565478:web:e8ea1c94b2a978f31d4227",
  measurementId: "G-5YG8CTK0HZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});



