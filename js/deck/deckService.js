import { saveDeck } from "../firebase/firestoreDecks";
import { deckState } from "./deckState";

export async function updateDeck(id) {
  if (!deckState.deck) return;

  return saveDeck(id, {
    Colors: deckState.colors,
    Commander: deckState.commander,
    Companion: deckState.companion,
    Format: deckState.format,
    Public: deckState.isPublic,
    Title: deckState.title,
    Decklist: deckState.decklist,
    user: deckState.userId
  });
}