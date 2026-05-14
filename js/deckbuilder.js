import { authListener, logOut, createUser, logIn, signInWithGoogle } from "./firebase/auth";
import { getPublicDecks, getDeckById, getPrivateDecks } from "./firebase/firestoreDecks";

import { renderPublicDeckList, renderPrivateDeckList } from "./ui/deckListUI";
import { renderDeck } from "./ui/deckViewUI";

import { deckState, setDeckState } from "./deck/deckState";
import { updateDeck } from "./deck/deckService";

const deckbuilder = document.querySelector("#deckbuilder-main");
const forms = document.querySelector("#forms");
const singlePublic = document.querySelector(".single-public-deck");

const params = new URLSearchParams(window.location.search);

let userId;

function initializeForms() {
    // Header log in / out button
    const logInOutButton = document.querySelector('#log-out-in-header');

    // Form Buttons
    const openSignUp = document.querySelector('#open-sign-up');
    const openLogIn = document.querySelector('#open-log-in');

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
        createUser(emailSignUpInput.value.trim(), passwordSignUpInput.value.trim());
    });

    logInButton.addEventListener('click', (e) => {
        e.preventDefault();
        logIn(emailLogInInput.value.trim(), passwordLogInInput.value.trim())
    });

    // Sign in with google
    logInWithGoogleButton.addEventListener('click', (e) => {
        e.preventDefault();
        signInWithGoogle();
    });

    // Same as above with other button
    signUpWithGoogle.addEventListener('click', (e) => {
        e.preventDefault();
        signInWithGoogle();
    });

    logInOutButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (userId) {
            logOut()
                .then(() => {
                    // Sign-out successful.
                    window.location.href = "/deckbuilder.html";
                }).catch((error) => {
                    // An error happened.
                    console.log(error.message);
                });
        }
    });
}

initializeForms();

authListener(async (user) => {
    if (!user) {
        forms.classList.remove("display-none");
        deckbuilder.classList.add("display-none");
        return;
    }

    userId = user.uid;

    const id = params.get("id");

    if (id) {
        forms.classList.add("display-none");
        deckbuilder.classList.add("display-none");
        singlePublic.classList.remove("display-none");

        const deck = await getDeckById(id);
        console.log(deck)
        setDeckState(deck);
        let notEditable = userId != deckState.user;

        if (deck) {
            renderDeck(deckState.Decklist, singlePublic, notEditable);
        }

        return;
    }

    // All Decks View
    forms.classList.add("display-none");
    deckbuilder.classList.remove("display-none");

    // Private Decks
    const privateDecks = await getPrivateDecks(userId);
    renderPrivateDeckList(privateDecks, document.querySelector("#user-decks"));
    // Public Decks
    const publicDecks = await getPublicDecks();
    renderPublicDeckList(publicDecks, document.querySelector("#public-decks"));
});