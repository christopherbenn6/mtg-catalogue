/**
 * This file is for api call functions to get data
 */

const BASE_API = 'https://api.scryfall.com';

const HEADERS = {
    "User-Agent": "EldritchSpellbook/1.0",
    "Accept": "application/json"
}

function getCardByNameExact (name) {
    return fetch(`${BASE_API}/cards/named?exact=`+encodeURIComponent(name), {
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
    return fetch(`${BASE_API}/cards/named?fuzzy=`+encodeURIComponent(name), {
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

function getNewestSetCode () {
    return fetch(`${BASE_API}/sets`, {
        headers: HEADERS
    })
    .then (response => {
        return response.json();
    })
    .then (allSets => {
        return allSets.data[0].code;
    })
}

function getFromSet(setCode) {
    return fetch(`${BASE_API}/cards/search?q=s%3A${setCode}&unique=cards&order=name&dir=asc&include_extras=false&include_variations=false&page=1&per_page=15`, {
        headers: HEADERS
    })
    .then(response => {
        return response.json();
    })
    .then(cardData => {
        return cardData.data;
    })
}

function getAllCardsByReleaseDate() {
    return fetch(`${BASE_API}/cards/search?q=game:paper&order=released&dir=desc`, {
        headers: HEADERS
    })
    .then(response => {
        return response.json();
    })
    .then(cardData => {
        return cardData;
    })
}

export { getCardByNameExact, getCardByNameFuzzy, getNewestSetCode, getFromSet, getAllCardsByReleaseDate };