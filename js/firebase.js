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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup  
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

// Authorization
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Firestore / DB content
const db = getFirestore();

// Get form sign up input
const signUpForm = document.querySelector('#sign-up-form');
const emailSignUpInput = document.querySelector('#email-sign-up');
const passwordSignUpInput = document.querySelector('#password-sign-up');
const signUpWithGoogle = document.querySelector('#sign-up-with-google');
const signUpButton = document.querySelector('#submit-sign-up');

// Get form sign in input
const logInForm = document.querySelector('#log-in-form');
const emailLogInInput = document.querySelector('#email-log-in');
const passwordLogInInput = document.querySelector('#password-log-in');
const logInWithGoogleButton = document.querySelector('#log-in-with-google');
const logInButton = document.querySelector('#submit-log-in');

// Create Account
signUpButton.addEventListener('click', (e) => {
  e.preventDefault();
  createUser(auth, emailSignUpInput.value, passwordSignUpInput.value);
});

logInButton.addEventListener('click', (e)=> {
  e.preventDefault();
  logIn(auth, emailLogInInput.value, passwordLogInInput.value)
});

// Sign in with google
logInWithGoogleButton.addEventListener('click', (e) => {
  e.preventDefault();
  signInWithGoogle(auth);
});

// Same as above with other button
signUpWithGoogle.addEventListener('click', (e) => {
  e.preventDefault();
  signInWithGoogle(auth);
});

/**
 * 
 * @param {string} tableName - The name of the table to fetch from
 * @returns {Promise} - array of data as a promise
 */
function getDataArray(tableName) {
  let dataArray = []
  const colRef = collection(db, tableName);
  return getDocs(colRef)
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      dataArray.push({ ...doc.data(), id: doc.id}) 
    });
    return dataArray;
  });
}

/**
 * 
 * @param {object} auth -- Authentication Instance
 * @param {*} email -- User Input Email
 * @param {*} password -- User Input Password 
 */
function createUser(auth, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log("Signed Up");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
  });
}

/**
 * 
 * @param {object} auth -- Authentication Instance
 * @param {*} email -- User Input Email
 * @param {*} password -- User Input Password 
 */
function logIn(auth, email, password) {
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("Logged In");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  });
}

/**
 * This function works for both signing in and signing up.
 * @param {object} auth 
 */
function signInWithGoogle (auth) {
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log("Logged in with Google");
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorMessage);
    // ...
  });
}

let data = await getDataArray('decks');
console.log(data);