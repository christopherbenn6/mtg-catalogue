// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPx6tPRZcyB9WyjvOshdfuPtrrsXFfJLE",
  authDomain: "eldritch-spellbook.firebaseapp.com",
  projectId: "eldritch-spellbook",
  storageBucket: "eldritch-spellbook.firebasestorage.app",
  messagingSenderId: "741085068658",
  appId: "1:741085068658:web:57e47ed2b145c78b38b1eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();