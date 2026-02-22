import { getCardByNameExact, getCardByNameFuzzy, getNewestSetCode, getFromSet, getAllCardsByReleaseDate } from '../js/api.js';

let maxNumberOfCards = 200;
let cardIncrement = 200;

/**
 * 
 * @param {int} maxNumberOfCards - The maximum number of cards displayed on the page
 * @param {int} cardIncrement - The number of cards that are created each button press
 * @returns 
 */
async function loadCardArray(maxNumberOfCards, cardIncrement) {
    let cardGrid = document.querySelector('#card-grid');
    const cardData = await getAllCardsByReleaseDate();
    const cards = cardData.data;
    cardGrid.innerHTML = ``;

    for(let i = 0; i < maxNumberOfCards && i < cards.length; i++) {
        let image = 'img/blank.avif';
        if(cards[i]['card_faces'] != null) {
            image = cards[i]['card_faces'][0]['image_uris']['normal'];
        } else {
            image = cards[i]['image_uris']['normal'];
        }
        cardGrid.innerHTML += `<img class="mtg-card" src="${image}">`;
    }

    if(cards.length > maxNumberOfCards && document.querySelector('#load-more-button') == null) {
        const loadMore = document.querySelector('#load-more');
        const button = `<p id="load-more-button">Load More</p>`;
        loadMore.innerHTML += button;
        loadMore.addEventListener('click', () => {
            maxNumberOfCards += cardIncrement;
            loadCardArray(maxNumberOfCards);
        });
    }
}

loadCardArray(maxNumberOfCards, cardIncrement);