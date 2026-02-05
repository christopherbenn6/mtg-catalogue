/**
 * This file is for api call functions to get data
 */

function getCardByNameExact (name) {
    fetch('https://api.scryfall.com/cards/named?exact='+name), {
        headers: {
            "User-Agent": "EldritchSpellbook/1.0",
            "Accept": "application/json"
        }    
    }
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
    })
}

export { getCardByNameExact };