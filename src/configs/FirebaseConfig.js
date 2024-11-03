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
  apiKey: "AIzaSyDP2KB7EkkEH2YMfICtkMsP5txP55N5FVE",
  authDomain: "fills-6a8c1.firebaseapp.com",
  projectId: "fills-6a8c1",
  storageBucket: "fills-6a8c1.firebasestorage.app",
  messagingSenderId: "845138485428",
  appId: "1:845138485428:web:c5cf8cf1297f792cbf77e1",
  measurementId: "G-FBCM4ZXR3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
