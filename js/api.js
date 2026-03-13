/**
 * This file is for api call functions to get data
 */

const BASE_API = 'https://api.scryfall.com';

const HEADERS = {
    "User-Agent": "EldritchSpellbook/1.0",
    "Accept": "application/json"
}

function getAllSymbols () {
    return fetch(`${BASE_API}/symbology`, {
        headers: HEADERS
    })
    .then(response => {
        if(response.status === 404) {
            return false;
        }
        return response.json();
    })
}

function getPrintsByOracleId (oracleId) {
    const queryString = encodeURIComponent(`oracle_id:${oracleId} include:extras`)+`&unique=prints`;
    const url = `${BASE_API}/cards/search?q=${queryString}`;
    console.log(url)
    return fetch(url, {
        headers: HEADERS
    })
    .then(response => {
        if(response.status === 404) {
            return false;
        }
        return response.json();
    })
}

function getPrintsById(id) {
    const queryString = `${id}`;
    const url = `${BASE_API}/cards/${queryString}`;
    console.log(url)
    return fetch(url, {
        headers: HEADERS
    })
    .then(response => {
        if(response.status === 404) {
            return false;
        }
        return response.json();
    })
}

/**
 * 
 * @param {string} sorting - The sotring string. Must be one of Scryfall's allowed values
 * @param {object} params - All parameters that the searched cards must match
 * 
 */
function filterCards(sortDirection, sorting, params) {
    let order = ""
    if(sorting != null) {
        order = `order=${sorting}`;
    } else {
        order = `order=released`;
    }
    if(sortDirection == null) {
        sortDirection = "desc";
    }
    let url = `${BASE_API}/cards/search?${order}&dir=${sortDirection}`;
    let filterString = [];

    if(params['card-search']) {
        let searchTerm = params['card-search'];
        filterString.push(`(o:${searchTerm} or t:${searchTerm} or name:${searchTerm})`)
    }

    if(params['color']) {
        filterString.push(`ci=${params['color']} -id:c`);
    }

    if(params['mana-value']) {
        let manaValues = params['mana-value'].split('-');
        let manaValueFilters = [];
        manaValues.forEach(v => {
            const manaValue = parseInt(v, 10);
            if(manaValue >= 10){
                manaValueFilters.push(`mv>=${manaValue}`);
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

    // Gimmick
    if(params['gimmick']) {
        let gimmicks = params['gimmick'].split('-');
        let gimmickFilters = [];
        gimmicks.forEach(gimmick => {
            if(gimmick == 'funny') {
                gimmickFilters.push(`is:funny`);
            } else {
                gimmickFilters.push(`type:${gimmick}`);
            }
        });
        filterString.push(`(${gimmickFilters.join(' or ')})`);
    }

    // Border
    if(params['border']) {
        let borders = params['border'].split('-');
        let borderFilters = [];
        borders.forEach(border => {
            borderFilters.push(`border:${border}`);
        });
        filterString.push(`(${borderFilters.join(' or ')})`);
    }

    if(params['rarity']) {
        let rarities = params['rarity'].split('-');
        let rarityFilters = [];
        rarities.forEach(rarity => {
            rarityFilters.push(`r:${rarity}`);
        });
        filterString.push(`(${rarityFilters.join(' or ')})`);
    }

    // Format Legality
    if(params['legality']) {
        let legalities = params['legality'].split('-');
        let legalityFilters = [];
        legalities.forEach(legality => {
            legalityFilters.push(`f:${legality}`);
        });
        filterString.push(`(${legalityFilters.join(' or ')})`);
    } 

    if(params['minyear']) {
        filterString.push(`year>=${params['minyear']}`);
    }
    
    if(params['maxyear']) {
        filterString.push(`year<=${params['maxyear']}`);
    }

    console.log(filterString)

    if(filterString.length > 0) {
        url += `&q=`;
    } else {
        url += `&q=mv>=0`
    }

    url += encodeURIComponent(filterString.join(" "));
    console.log(url);
    return fetch(url, {
        headers: HEADERS
    })
    .then(response => {
        if(response.status === 404) {
            return false;
        }
        return response.json();
    })
    .catch(err => {
        console.error('Fetch failed:', err);
    });
}

function fetchData(url) {
    return fetch(url, {
        headers: HEADERS
    })
    .then(response => {
        return response.json();
    })
}

export { filterCards, fetchData, getPrintsByOracleId, getPrintsById, getAllSymbols };