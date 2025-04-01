
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVyHiDoQ0-SKQpH4DbBf_Jopi0ckpmhZw",
  authDomain: "focusforge-36e43.firebaseapp.com",
  projectId: "focusforge-36e43",
  storageBucket: "focusforge-36e43.firebasestorage.app",
  messagingSenderId: "478654809540",
  appId: "1:478654809540:web:da5a5156ce261a066f1091",
  measurementId: "G-1VQXD0PSWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth= getAuth(app);