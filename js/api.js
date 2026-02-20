/**
 * This file is for api call functions to get data
 */

const HEADERS = {
    "User-Agent": "EldritchSpellbook/1.0",
    "Accept": "application/json"
}

function getCardByNameExact (name) {
    return fetch('https://api.scryfall.com/cards/named?exact='+encodeURIComponent(name), {
        headers: HEADERS
    })
    .then((response) => {
        if(!response.ok) {
            return null;
        }
        return response.json();
    })
}

function getCardByNameFuzzy (name) {
    return fetch('https://api.scryfall.com/cards/named?fuzzy='+encodeURIComponent(name), {
        headers: HEADERS
    })
    .then((response) => {
        if(!response.ok) {
            return null;
        }
        return response.json();
    })
    .catch (() => {
        return null;
    })
}


export { getCardByNameExact, getCardByNameFuzzy };