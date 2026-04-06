// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Firestore
import {
  collection,
  getFirestore,
  getDocs
} from "firebase/firestore";

// Authentication
import { 
  getAuth, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

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
const db = getFirestore();

// Get form input
const signUpForm = document.querySelector('#sign-up-form');
const emailInput = document.querySelector('#email-sign-up');
const passwordInput = document.querySelector('#password-sign-up');
const createAccountButton = document.querySelector('#sign-up-with-google');
const submitButton = document.querySelector('#submit-sign-up');

// Create Account
submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // ..
  });
});
// CbDa:sdR74

const colRef = collection(db, 'decks');
getDocs(colRef)
  .then((snapshot) => {
    console.log(snapshot.docs)
  });