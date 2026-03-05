/**
 * This file is for api call functions to get data
 */

const BASE_API = 'https://api.scryfall.com';

const HEADERS = {
    "User-Agent": "EldritchSpellbook/1.0",
    "Accept": "application/json"
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
    let url = `${BASE_API}/cards/search?${order}&dir=${sortDirection}&q=`;
    let filterString = [];

    if(params['card-search']) {
        let searchTerm = params['card-search'];
        filterString.push(`(o:${searchTerm} or t:${searchTerm} or name:${searchTerm})`)
    }

    if(params['color']) {
        filterString.push(`ci=${params['color']} -c=c`);
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

export { filterCards, fetchData, getPrintsByOracleId, getPrintsById };