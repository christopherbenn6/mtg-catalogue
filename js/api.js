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
/**
 * 
 * @param {string} sorting - The sotring string. Must be one of Scryfall's allowed values
 * @param {object} params - All parameters that the searched cards must match
 * 
 */
function filterCards(sortDirection, sorting, params) {
    let url = `${BASE_API}/cards/search?order=${sorting}&dir=${sortDirection}&q=`;
    let filterString = [];

    if(params['color']) {
        filterString.push(`ci=${params['color']} -c=c`);
    }

    if(params['mana-value']) {
        let manaValues = params['mana-value'].split('-');
        let manaValueFilters = [];
        manaValues.forEach(manaValue => {
            if(manaValue >= 10){
                filterString.push(`mv>=${params['mana-value']}`);
            } else {
                manaValueFilters.push(`mv=${manaValue}`);            
            }
        });
        filterString.push(`(${manaValueFilters.join(' or ')})`);
        
    } 

    // Card Type ex. creature, kindred
    // Is inclusive (artifact creature)
    if(params['card-type']) {
        let cardTypes = params['card-type'].split('-');
        let cardTypeFilters = [];
        cardTypes.forEach(cardType => {
            cardTypeFilters.push(`t:${cardType}`)
        });
        filterString.push(cardTypeFilters.join(' '));
    }

    // Card Rarity ex. common, rare, mythic
    if(params['rarity']) {
        filterString.push(`rarity:${params['rarity']}`);
    }

    // Format Legality
    if(params['legalty']) {
        filterString.push(`f:${params['legalty']}`);
    } else {
        // If nothing specified, use vintage cards
        filterString.push(`f:vintage`); 
    }

    if(params['minyear']) {
        filterString.push(`year>=${params['minyear']}`);
    }
    
    if(params['maxyear']) {
        filterString.push(`year<=${params['maxyear']}`);
    }

    if(params['minpower']) {
        filterString.push(`pow>=${params['minpower']}`);
    }

    if(params['maxpower']) {
        filterString.push(`pow<=${params['maxpower']}`);
    }

    if(params['mintoughness']) {
        filterString.push(`tou>=${params['mintoughness']}`);
    }

    if(params['maxtoughness']) {
        filterString.push(`tou<=${params['maxtoughness']}`);
    }

    if(params['minloyalty']) {
        filterString.push(`loy>=${params['minloyalty']}`);
    }

    if(params['maxloyalty']) {
        filterString.push(`loy<=${params['maxloyalty']}`);
    }

    url += encodeURIComponent(filterString.join(" "));
    console.log(url);
    return fetch(url, {
        headers: HEADERS
    })
    .then(response => {
        return response.json();
    })
}

function searchCards (sortDirection, sorting, searchTerm) {
    let filters = `o:${searchTerm} or t:${searchTerm} or name:${searchTerm}`
    filters = encodeURIComponent(filters);
    let url = `${BASE_API}/cards/search?order=${sorting}&dir=${sortDirection}&q=${filters}`;
    return fetch(url, {
        headers: HEADERS
    })
    .then(response => {
        return response.json();
    })
}

function fetchData(url) {
    return fetch(url, {
        headers: HEADERS
    })
    .then(response => {
        return response.json();
    })
}

export { getCardByNameExact, getCardByNameFuzzy, getNewestSetCode, getFromSet, getAllCardsByReleaseDate, filterCards, fetchData, searchCards };