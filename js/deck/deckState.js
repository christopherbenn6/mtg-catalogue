// Exports a default of null on everything
export let deckState = {
    "Colors": "",
    "Commander": "",
    "Companion": "",
    "Format": "",
    "Public": false,
    "Title": "",
    "Decklist": [],
    "user": ""
};

export function setDeckState(newState) {
    Object.assign(deckState, newState)
    console.log(newState)
}