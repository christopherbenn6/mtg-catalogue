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
        let colors = params['color'].split('-');
        let colorFilters = "";
        colors.forEach(color => {
            colorFilters += color;
        });
        filterString.push(`ci=${colorFilters} -id:c`);
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

    // Flip / Transform / Meld / Split
    if(params['card-face']) {
        let cardFaces = params['card-face'].split('-');
        let cardFaceFilters = [];
        cardFaces.forEach(cardFace => {
            cardFaceFilters.push(`is:${cardFace}`);
        });
        filterString.push(`(${cardFaceFilters.join(' or ')})`);
    }

    // Other Card Types 
    if(params['other-card-types']) {
        let otherCardTypes = params['other-card-types'].split('-');
        let otherCardTypeFilters = [];
        otherCardTypes.forEach(otherCardType => {
            otherCardTypeFilters.push(`is:${otherCardType}`);
        });
        filterString.push(otherCardTypeFilters.join(' '));
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

    if(params['power']) {
        let powers = params['power'].split('-');
        let powerFilters = [];
        powers.forEach(power => {
            if(power >= 8) {
                powerFilters.push(`pow>=${power}`);
            } else {
                powerFilters.push(`pow=${power}`);  
            }
        });
        filterString.push(`(${powerFilters.join(' or ')})`);
    }

    if(params['toughness']) {
        let toughnesses = params['toughness'].split('-');
        let toughnessFilters = [];
        toughnesses.forEach(toughness => {
            if(power >= 8) {
                toughnessFilters.push(`pow>=${toughness}`);
            } else {
                toughnessFilters.push(`pow=${toughness}`);  
            }
        });
        filterString.push(`(${toughnessFilters.join(' or ')})`);
    }

    if(params['price-min']) {
        filterString.push(`usd>=${params['price-min']}`);
    }

    if(params['price-max']) {
        filterString.push(`usd<=${params['price-max']}`);
    }

    if(params['year-min']) {
        filterString.push(`year>=${params['year-min']}`);
    }
    
    if(params['year-max']) {
        filterString.push(`year<=${params['year-max']}`);
    }

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