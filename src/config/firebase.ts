import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDNoOAPLx9jtcoaj8vmxEgUKEqgLoklxpo",
    authDomain: "schools-administration.firebaseapp.com",
    projectId: "schools-administration",
    storageBucket: "schools-administration.appspot.com",
    messagingSenderId: "835283033630",
    appId: "1:835283033630:web:399737f87282739846980f",
    measurementId: "G-JLHC6QEK87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account',
    access_type: 'offline'
});

// Add scopes if needed
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Remove firebase.js if it exists