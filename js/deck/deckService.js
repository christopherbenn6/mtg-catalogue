import { saveDeck } from "../firebase/firestoreDecks";
import { deckState } from "./deckState";

export async function updateDeck(id, cardData) {
  // Commander, Companion, Decklist and user, just use deckState.

  // Set Deck Colors based on deck
  let allPips = "";
  cardData['data'].forEach(card => {
    card.color_identity.forEach(pipLetter => {
      if(!allPips.includes(pipLetter)) {
        allPips += pipLetter;
      }
    });
  });

  // Get Title, Public and Format from Form Values
  let title = document.querySelector('#deck-title').value.trim();

  // If the Title was not set, make it use the previous entry. If THAT doesn't exist, default to "New Deck"
  if(title == "" || title == null) {
    if(deckState.Title == "" || deckState.Title == null) {
      title = "New Deck";
    } else {
      title = deckState.Title;
    }
  }

  const isPublicInput = document.querySelector('#set-public');
  const isPrivateInput = document.querySelector('#set-private');

  let isPublic;

  if(isPublicInput.checked) {
    isPublic = true;
    console.log('public')
  } else if (isPrivateInput.checked) {
    isPublic = false;
    console.log('private')
  } else {
    isPublic = deckState.Public;
  }

  deckState.Public = isPublic;

  isPublicInput.checked = false;
  isPrivateInput.checked = false;

  return saveDeck(id, {
    Colors: allPips,
    Commander: deckState.Commander,
    Companion: deckState.Companion,
    Format: deckState.Format,
    Public: isPublic,
    Title: title,
    Decklist: deckState.Decklist,
    user: deckState.user
  });
}