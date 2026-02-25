import { getCardByNameExact, getCardByNameFuzzy, getNewestSetCode, getFromSet, getAllCardsByReleaseDate, searchCards } from '../js/api.js';

let maxNumberOfCards = 30;
let cardIncrement = 30;
let allCards = "";


/**
 * 
 * @param {*} maxNumberOfCards 
 * @param {*} cardIncrement 
 * @param {*} sortingMode  
 * Sorting Options: name set released rarity color usd tix eur cmc power toughness edhrec penny artist review
  
 *  
 * @param {*} filterObject 
 */
async function loadCardArray(maxNumberOfCards, cardIncrement, sortingMode, filterObject, allCards) {
    const loadMore = document.querySelector('#load-more');
    loadMore.innerHTML = ``;

    const cardGrid = document.querySelector('#card-grid');
    // Card data fetches the data, then adds it to all Cards. 
    // To allow for multiple pages (scryfall api pages) we replace cardData whenever we need more cards then add them to allCards
    let cardData = await searchCards(`${sortingMode}`, filterObject); 
    let cards = cardData.data;
    
    cardGrid.innerHTML = ``;

    for(let i = 0; i < maxNumberOfCards && i < cards.length; i++) {
        let image = 'img/blank.avif';
        if(cards[i]['card_faces'] != null && cards[i]['image_uris'] == null) {
            image = cards[i]['card_faces'][0]['image_uris']['normal'];
        } else {
            image = cards[i]['image_uris']['normal'];
        }
        cardGrid.innerHTML += `<img class="mtg-card" src="${image}">`;
    }

    if(cards.length > maxNumberOfCards && document.querySelector('#load-more-button') == null) {
        const button = `<p id="load-more-button">Load More</p>`;
        loadMore.innerHTML += button;
        loadMore.addEventListener('click', () => {
            maxNumberOfCards += cardIncrement;
            loadCardArray(maxNumberOfCards, cardIncrement, 'cmc', filterObject);
        });
    }
}


let filterObject = {
    "color": "wb",
    "mana-value": null,
    "card-type": "land"
}

loadCardArray(maxNumberOfCards, cardIncrement, 'cmc', filterObject);