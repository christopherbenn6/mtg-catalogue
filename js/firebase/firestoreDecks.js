import { db } from "./firebaseConfig";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    setDoc
} from "firebase/firestore";

export async function getPublicDecks() {
    const q = query(collection(db, "decks"), where("Public", "==", true));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

export async function getPrivateDecks(userId) {
    const q = query(collection(db, "decks"), where("user", "==", userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

export async function getDeckById(id) {
    const snap = await getDoc(doc(db, "decks", id));
    return snap.exists() ? snap.data() : null;
}

export async function saveDeck(id, data) {
    return setDoc(doc(db, "decks", id), data);
    // Refer to deckState.js to see data format
}