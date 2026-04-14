// Import the functions you need from the SDKs you need
import { getCardsFromList } from "../js/api";
import { initializeApp } from "firebase/app";

// Firestore
import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from "firebase/firestore";

// Authentication
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut 
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

// Header log in / out button
const logInOutButton = document.querySelector('#log-out-in-header');

// Form Buttons
const openSignUp = document.querySelector('#open-sign-up');
const openLogIn = document.querySelector('#open-log-in')

// Both Forms
const forms = document.querySelector('#forms');

// Main Page after sign in
const deckbuilder = document.querySelector('#deckbuilder-main');
const singlePublic = document.querySelector('.single-public-deck');
const singleUser = document.querySelector('.single-user-deck');

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

let userId;

openSignUp.addEventListener('click', (e) => {
  e.preventDefault();
  openSignUp.classList.add('button-selected');
  openLogIn.classList.remove('button-selected');
  signUpForm.classList.remove('display-none');
  logInForm.classList.add('display-none');
});

openLogIn.addEventListener('click', (e) => {
  e.preventDefault();
  openSignUp.classList.remove('button-selected');
  openLogIn.classList.add('button-selected');
  signUpForm.classList.add('display-none');
  logInForm.classList.remove('display-none');
});

// Create Account
signUpButton.addEventListener('click', (e) => {
  e.preventDefault();
  createUser(auth, emailSignUpInput.value.trim(), passwordSignUpInput.value.trim());
});

logInButton.addEventListener('click', (e)=> {
  e.preventDefault();
  logIn(auth, emailLogInInput.value.trim(), passwordLogInInput.value.trim())
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

logInOutButton.addEventListener('click', (e) => {
  e.preventDefault();
  if(userId) {
    signOut(auth)
      .then(() => {
      // Sign-out successful.
      }).catch((error) => {
        // An error happened.
        console.log(error.message);
      });
  } 
  window.location.href = "/deckbuilder.html";
});

const getValues = new URLSearchParams(window.location.search);

// If user logs in or out
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties

    userId = user.uid;

    // If user is currently viewing a deck
    if(getValues.get('public-id') != null && getValues.get('public-id') != "") {
      forms.classList.add('display-none');
      deckbuilder.classList.add('display-none');
      singlePublic.classList.remove('display-none');
      renderPublicDeck();
      return;
    }
    forms.classList.add('display-none');
    deckbuilder.classList.remove('display-none');
    const decks = await getPublicDecks();
    createPublicDecksHTML(decks);
    // ...
  } else {
    // User is signed out
    forms.classList.remove('display-none');
    deckbuilder.classList.add('display-none');
  }
});

/**
 * 
 * @param {string} tableName - The name of the table to fetch from
 * @returns {Promise} - array of data as a promise
 */
async function getPublicDecks() {
  let dataArray = []

  const colRef = collection(db, 'decks');
  const q = query(colRef, where("Public", "==", true));
  const snapshot = await getDocs(q);

  snapshot.docs.forEach((doc) => {
    dataArray.push({ ...doc.data(), id: doc.id}) 
  });

  return dataArray;
}

async function getPublicDeckById(id) {
  const colRef = doc(db, 'decks', id);
  const docSnap = await getDoc(colRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    return false;
  }
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
      signUpForm.reset();
      // ...
    })
    .catch((error) => {
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
  console.log(email+password);
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("Logged In");
    // Reset Form
    logInForm.reset();
  })
  .catch((error) => {
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
    logInForm.reset();
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

async function createPublicDecksHTML (decks) {
  let element = document.querySelector('#public-decks');
  element.innerHTML = ``;

  decks.forEach(deck => {
    element.innerHTML += `
    <section>
      <a id="${deck.id}" href="deckbuilder.html?public-id=${deck.id}">
        <h3>${deck.Title}</h3>
      </a>
    </section>`;
    let deckLink = document.querySelector(`#${deck.id}`);
    deckLink.addEventListener('click', () => {
      singlePublic.classList.remove('display-none');
      deckbuilder.classList.add('display-none');
    });
  });
}

async function renderPublicDeck () {
  // Check if the id is actually an ID: 
  let deck = await getPublicDeckById(getValues.get('public-id'));

  // Array of objects containing an ID for every card
  let idArray = [];
  
  let cards = deck['deck-list'];
  cards.forEach(cardId => {
    idArray.push({ id: cardId });
  });
  let cardData = await getCardsFromList({ identifiers: idArray });
  console.log(cardData);

  let cardGridHTML = "";
  let cardGroupings = {
    land: [],
    creature: [],
    enchantment: [],
    artifact: [],
    instant: [],
    sorcery: [],
    planeswalker: [],
    battle: []
  };
  let totalPrice = 0;

  cardData['data'].forEach(card => {
    let price = card.prices.usd;
    for (const key in cardGroupings) {
      if(card.type_line.toLowerCase().includes(key))
      cardGroupings[key] += `<ul class="deck-cards"><li>${card.name}</li></ul>`
    }
    if(price != null) {
      totalPrice += parseFloat(price);
    }
  });

  Object.entries(cardGroupings).forEach(([key, value]) => {
    cardGridHTML += `<ul>
      ${...value}
    </ul>`;
  });
  console.log(cardGroupings);
  

  const html = `
  <div>
    <div>
      <h2>${deck.Title}</h2>
      <p>${totalPrice != 0 ? "$"+totalPrice+" USD" : "No Price Available"}</p>
    </div>
  </div>

  <div>
    <div class="build-sidebar">

    </div>
    <div class="build-grid">
      ${cardGroupings}
    </div>
  </div>
  `;
  singlePublic.innerHTML += html;
}