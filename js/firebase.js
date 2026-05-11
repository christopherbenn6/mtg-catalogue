// Import the functions you need from the SDKs you need
import { getCardsFromList, getAllSymbols } from "../js/api";
import { initializeApp } from "firebase/app";

// Firestore
import {
  collection,
  getFirestore,
  getDocs,
  setDoc,
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

let isOwned = false;

// If user logs in or out
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties

    userId = user.uid;

    // If user is currently viewing a deck
    if(getValues.get('id') != null && getValues.get('id') != "") {
      forms.classList.add('display-none');
      deckbuilder.classList.add('display-none');
      singlePublic.classList.remove('display-none');

      // Check if the deck is made by the current user logged in, and make it editable if so
      let deck = await getPublicDeckById(getValues.get('id'));
      if(deck['user'] == userId) {
        isOwned = true;
        renderPrivateDeck(deck);
      } else {
        renderPublicDeck(deck);
      }
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
      <a id="${deck.id}" href="deckbuilder.html?id=${deck.id}">
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

const symbolData = await getAllSymbols();
let symbolImagesAssoc = {};
symbolData.data.forEach(symbol => {
    symbolImagesAssoc[symbol.symbol] = symbol.svg_uri;
});

async function exchangeWithSymbols(string, symbolImagesAssoc) {
    Object.entries(symbolImagesAssoc).forEach(([key, value]) => {
        string = string.replaceAll(key, `<img class="symbol" src="${value}">`)
    });
    return string;
}

async function renderPublicDeck (deck) {
  // Check if the id is actually an ID: 
  let sort = getValues.get('sort') ?? "type";

  // Array of objects containing an ID for every card
  let idArray = [];
  singlePublic.innerHTML = "";
  
  // Fetch cards from API
  let cards = deck['deck-list'];
  cards.forEach(cardId => {
    idArray.push({ id: cardId });
  });
  let cardData = await getCardsFromList({ identifiers: idArray });

  // Resets and Initialization
  let cardGridHTML = "";
  let sidebarHTML = "";
  let totalPrice = 0;
  let cardGroupings;

  if(sort == "type") {
    cardGroupings = {
      land: "",
      creature: "",
      enchantment: "",
      artifact: "",
      instant: "",
      sorcery: "",
      planeswalker: "",
      battle: ""
    };
  } else if (sort == "mv") {
    cardGroupings = {
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      9: "",
      10: ""
    };
  }

  for (const card of cardData['data'])  {
    let price = card.prices.usd;
    let cardName = card.name;
    if(cardName.length > 17) {
      cardName = cardName.slice(0, 17)+"...";
    }
    for (const key in cardGroupings) {

      // Get Mana Pips
      const symbols = await exchangeWithSymbols(card.mana_cost ?? card.card_faces[0].mana_cost, symbolImagesAssoc);

      if(sort == "type") {
        if(card.type_line.toLowerCase().includes(key)) {
          cardGroupings[key] += `<li class="build-card-item" id=${card.id}><span class="card-name-span">${cardName}</span> <div class="price-mana-flex"><span>${symbols}</span> <span>$${price}</span></div></li>`;
        }
      } else if (sort == "mv") {
        if(card.cmc == key) {
          cardGroupings[key] += `<li class="build-card-item" id=${card.id}><span class="card-name-span">${cardName}</span> <div class="price-mana-flex"><span>${symbols}</span> <span>$${price}</span></div></li>`;
        }
      }

    }

    if(price != null) {
      totalPrice += parseFloat(price);
    }
  };

  Object.entries(cardGroupings).forEach(([key, value]) => {
    if(value != "") {
      if(sort == "type") {
        cardGridHTML += `<div><h3>${key.charAt(0).toUpperCase() + key.slice(1)}s</h3><ul class="deck-cards" id="${key}-grouping">
          ${value}
        </ul></div>`;
      } else if (sort == "mv") {
        cardGridHTML += `<div><h3>Mana Value ${key.charAt(0).toUpperCase() + key.slice(1)}</h3><ul class="deck-cards" id="${key}-grouping">
          ${value}
        </ul></div>`;
      }
    }
  });

  const html = `
  

  <div class="build-flex public">
    <div class="build-sidebar"></div>
    <div class="build-main">
      <div class="build-header">
        <div>
          <h2>${deck.Title}</h2>
          <p>${totalPrice != 0 ? "$"+Math.round(totalPrice * 100) / 100+" USD" : "No Price Available"}</p>
        </div>
        <div>
          <div class="select sorting builder-dropdown-button">
            <button type="button" class="dropdown-button">
                Sort By
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
            <div class="dropdown hidden">
                <div data-value="type">
                    <a class="builder-sort-link" href="deckbuilder.html?id=${getValues.get('id')}&sort=type">Type</a>
                </div>
                <div data-value="mv">
                    <a class="builder-sort-link" href="deckbuilder.html?id=${getValues.get('id')}&sort=mv">Mana Value</a>
                </div>
            </div>
            <input type="hidden" id="sorting" name="sorting" value="">
          </div>
        </div>
      </div>
      <div class="build-grid">
        ${cardGridHTML}
      </div>
    </div>
  </div>
  `;
  singlePublic.innerHTML += html;

  const allItemsInDeck = document.querySelectorAll('.build-card-item');
  allItemsInDeck.forEach(item => {
    let itemId = item.getAttribute('id');
    let singleCardData = cardData['data'].find((card) => card.id === itemId);
    item.addEventListener('click', () => renderSidebar(singleCardData));
  });

  // Select Dropdown Functionality
  let dropdownButtons = document.querySelectorAll('.dropdown-button');
  dropdownButtons.forEach(button => {
      button.addEventListener('click', (ev) => {
          ev.preventDefault();
          const dropdown = button.nextElementSibling;
          dropdown.classList.toggle('hidden');
          button.classList.toggle('clicked');
          button.blur();
      })
  });

  renderSidebar(cardData['data'][0]);
}



async function renderPrivateDeck(deck) {
    // Check if the id is actually an ID: 
  let sort = getValues.get('sort') ?? "type";

  // Array of objects containing an ID for every card
  let idArray = [];
  singlePublic.innerHTML = "";
  
  // Fetch cards from API
  let cards = deck['deck-list'];
  cards.forEach(cardId => {
    idArray.push({ id: cardId });
  });
  let cardData = await getCardsFromList({ identifiers: idArray });

  // Resets and Initialization
  let cardGridHTML = "";
  let sidebarHTML = "";
  let totalPrice = 0;
  let cardGroupings;

  if(sort == "type") {
    cardGroupings = {
      land: "",
      creature: "",
      enchantment: "",
      artifact: "",
      instant: "",
      sorcery: "",
      planeswalker: "",
      battle: ""
    };
  } else if (sort == "mv") {
    cardGroupings = {
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      9: "",
      10: ""
    };
  }

  for (const card of cardData['data'])  {
    let price = card.prices.usd;
    let cardName = card.name;
    if(cardName.length > 17) {
      cardName = cardName.slice(0, 17)+"...";
    }
    for (const key in cardGroupings) {

      // Get Mana Pips
      const symbols = await exchangeWithSymbols(card.mana_cost ?? card.card_faces[0].mana_cost, symbolImagesAssoc);

      if(sort == "type") {
        if(card.type_line.toLowerCase().includes(key)) {
          cardGroupings[key] += `<li class="build-card-item" id=${card.id}><span class="card-name-span">${cardName}</span> <div class="price-mana-flex"><span>${symbols}</span> <span>$${price}</span></div></li>`;
        }
      } else if (sort == "mv") {
        if(card.cmc == key) {
          cardGroupings[key] += `<li class="build-card-item" id=${card.id}><span class="card-name-span">${cardName}</span> <div class="price-mana-flex"><span>${symbols}</span> <span>$${price}</span></div></li>`;
        }
      }

    }

    if(price != null) {
      totalPrice += parseFloat(price);
    }
  };

  Object.entries(cardGroupings).forEach(([key, value]) => {
    if(value != "") {
      if(sort == "type") {
        cardGridHTML += `<div><h3>${key.charAt(0).toUpperCase() + key.slice(1)}s</h3><ul class="deck-cards" id="${key}-grouping">
          ${value}
        </ul></div>`;
      } else if (sort == "mv") {
        cardGridHTML += `<div><h3>Mana Value ${key.charAt(0).toUpperCase() + key.slice(1)}</h3><ul class="deck-cards" id="${key}-grouping">
          ${value}
        </ul></div>`;
      }
    }
  });

  const html = `
  

  <div class="build-flex public">
    <div class="build-sidebar"></div>
    <div class="build-main">
      <div class="build-header">
        <div class="deckbuilder-edit">
          <svg class="deckbuilder-edit-button" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"   stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          <div>
            <h2>${deck.Title}</h2>
            <p>${totalPrice != 0 ? "$"+Math.round(totalPrice * 100) / 100+" USD" : "No Price Available"}</p>
          </div>
        </div>
        <div>
          <div class="deckbuilder-header-flex">
            <button type="button" class="save button">Save</button>
            <div class="select sorting builder-dropdown-button">
              <button type="button" class="dropdown-button">
                  Sort By
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
              </button>
              <div class="dropdown hidden">
                  <div data-value="type">
                      <a class="builder-sort-link" href="deckbuilder.html?id=${getValues.get('id')}&sort=type">Type</a>
                  </div>
                  <div data-value="mv">
                      <a class="builder-sort-link" href="deckbuilder.html?id=${getValues.get('id')}&sort=mv">Mana Value</a>
                  </div>
              </div>
              <input type="hidden" id="sorting" name="sorting" value="">
            </div>
          </div>
        </div>
      </div>
      <div class="deckbuilder-edit-form hidden">
        <form>
          <div>
            <label for="deck-title">Deck Title</label>
            <input type="text" name="deck-title" id="deck-title">
          </div>
          <div class="deckbuilder-edit-form-checkboxes">
            <div>
              <label for="set-private">Set As Private</label>
              <input type="checkbox" name="set-private" id="set-private">
            </div>
            <div>
              <label for="set-public">Set As Public</label>
              <input type="checkbox" name="set-public" id="set-public">
            </div>
          </div>
          <div>
            <input class="button" type="submit" name="deckbuilder-edit-form-submit" id="deckbuilder-edit-form-submit" value="Update">
          </div>
        </form
      </div>
      </div>
      <div class="build-grid">
        ${cardGridHTML}
      </div>
    </div>
  </div>
  `;
  singlePublic.innerHTML += html;

  const allItemsInDeck = document.querySelectorAll('.build-card-item');
  allItemsInDeck.forEach(item => {
    let itemId = item.getAttribute('id');
    let singleCardData = cardData['data'].find((card) => card.id === itemId);
    item.addEventListener('click', () => renderSidebar(singleCardData));
  });

  // Disable form Defaults
  const editForm = document.querySelector('.deckbuilder-edit-form');
  editForm.addEventListener('submit', () => {

  });

  const editButton = document.querySelector('.deckbuilder-edit-button')
  editButton.addEventListener('click', () => {
    editForm.classList.toggle('hidden')
  });

  // Select Dropdown Functionality
  let dropdownButtons = document.querySelectorAll('.dropdown-button');
  dropdownButtons.forEach(button => {
      button.addEventListener('click', (ev) => {
          ev.preventDefault();
          const dropdown = button.nextElementSibling;
          dropdown.classList.toggle('hidden');
          button.classList.toggle('clicked');
          button.blur();
      })
  });

  renderSidebar(cardData['data'][0]);
}

function renderSidebar(card) {
  if(isOwned) {
    renderPrivateSidebar(card);
  } else {
    renderPublicSidebar(card);
  }
}

function renderPublicSidebar(card) {
  console.log(card);
  // Notes: 
  // When the format is singleton, do not show add, instead just a "remove from deck"
  // When the card is 2 sided, add a transform button
  const sidebar = document.querySelector('.build-sidebar');
  let image;
  let price = card.prices.usd ? `<p class="price">${card.prices.usd} USD </p>` : "";
  if(card.card_faces != null) {
    image = card.card_faces[0].image_uris.normal;
  } else {
    image = card.image_uris.normal;
  }
  sidebar.innerHTML = `<div>
    <img class="mtg-card display-card" src="${image}">
    ${price}
    <div class="button-wrapper">
      <a href="single.html?id=${card.id}">More Card Info</a>
    </div>
  </div>`;
}

function renderPrivateSidebar(card) {
  console.log(card);
  // Notes: 
  // When the format is singleton, do not show add, instead just a "remove from deck"
  // When the card is 2 sided, add a transform button
  const sidebar = document.querySelector('.build-sidebar');
  let image;
  let price = card.prices.usd ? `<p class="price">${card.prices.usd} USD </p>` : "";

  let elidgebleCommander = false;

  // If the card is legendary
  if(card.type_line.toLowerCase().includes("legendary")) {
    // If the card is a creature, vehicle or spacecraft
    if(card.type_line.toLowerCase().includes("creature") || card.type_line.toLowerCase().includes("spacecraft") || card.type_line.toLowerCase().includes("vehicle")) {
      elidgebleCommander = true;
    } else if (card.type_line.toLowerCase().includes("planeswalker")){
      if(card.oracle_text.toLowerCase().includes("commander")) {
        elidgebleCommander = true;
      }
    }
  }

  let setCommander = "";
  if(elidgebleCommander) {
    setCommander = `<button type="button">Set As Commander</button>`;
  }

  if(card.card_faces != null) {
    image = card.card_faces[0].image_uris.normal;
  } else {
    image = card.image_uris.normal;
  }
  sidebar.innerHTML = `<div>
    <img class="mtg-card display-card" src="${image}">
    ${price}
    <div class="button-wrapper">
      <a href="single.html?id=${card.id}">More Card Info</a>
      ${setCommander}
    </div>
  </div>`;
}