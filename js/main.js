import { getCardByNameExact, getCardByNameFuzzy, getNewestSetCode, getFromSet, getAllCardsByReleaseDate } from '../js/api.js';

async function loadCardArray() {
    let cardGrid = document.querySelector('#card-grid')
    const cardData = await getAllCardsByReleaseDate();
    const cards = cardData.data;
    cardData.innerHTML = ``;

    for(let i = 0; i < 30 && i < cards.length; i++) {
        let image = 'img/blank.avif'
        if(cards[i]['card_faces'] != null) {
            image = cards[i]['card_faces'][0]['image_uris']['normal'];
        } else {
            image = cards[i]['image_uris']['normal'];
        }
        cardGrid.innerHTML += `<img src="${image}">`;
    }
}

loadCardArray();