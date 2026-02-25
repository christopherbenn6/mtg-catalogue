import { getCardByNameExact, getCardByNameFuzzy, getNewestSetCode, getFromSet, getAllCardsByReleaseDate, filterCards, fetchData, searchCards } from '../js/api.js';

let maxNumberOfCards = 80;
const cardIncrement = 80;
let cardData; // store all loaded cards and next_page

async function loadCardArray(filterObject) {
    // Initial fetch
    if(filterObject['card-search'] != "" && filterObject['card-search'] != null) {
        cardData = await searchCards(filterObject['sort-direction'], filterObject['sorting-mode'], filterObject['card-search']);
    } else {
        cardData = await filterCards(filterObject['sort-direction'], filterObject['sorting-mode'], filterObject);
    }
    renderCards(cardData.data, 0, maxNumberOfCards);
    setupLoadMore();
}

function setupLoadMore() {
    const loadMore = document.querySelector('#load-more');
    loadMore.innerHTML = '';

    if (cardData.data.length > maxNumberOfCards || cardData.next_page) {
        const button = document.createElement('p');
        button.id = 'load-more-button';
        button.textContent = 'Load More';

        button.addEventListener('click', async () => {
            const previousCount = maxNumberOfCards;
            maxNumberOfCards += cardIncrement;

            // Check if we need to fetch next page
            if (maxNumberOfCards > cardData.data.length && cardData.next_page) {
                const nextPageData = await fetchData(cardData.next_page);
                cardData.data = [...cardData.data, ...nextPageData.data];
                cardData.next_page = nextPageData.next_page;
            }

            renderCards(cardData.data, previousCount, maxNumberOfCards);

            // Recheck if the button should remain
            if (maxNumberOfCards >= cardData.data.length && !cardData.next_page) {
                loadMore.innerHTML = ''; // remove button if no more cards
            }
        });

        loadMore.appendChild(button);
    }
}

function renderCards(cards, startIndex, endIndex) {
    const cardGrid = document.querySelector('#card-grid');
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i < endIndex && i < cards.length; i++) {
        let image = 'img/blank.avif';

        if (cards[i].card_faces && !cards[i].image_uris) {
            image = cards[i].card_faces[0].image_uris.normal;
        } else if (cards[i].image_uris) {
            image = cards[i].image_uris.normal;
        }

        const img = document.createElement('img');
        img.className = 'mtg-card';
        img.src = image;
        img.loading = "lazy";
        fragment.appendChild(img);
    }

    cardGrid.appendChild(fragment);
}

// Start loading

function filterObject () {
    let getValues = window.location.search.substring(1).split('&');
    let $_GET = {}
    for(let i = 0; i < getValues.length; i++) {
        let temp = getValues[i].split('=');
        $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }
    let filterCount = getValues.length;
    for(let i = 0; i < getValues.length; i++) {
        if($_GET[i] == "") {
            $_GET[i] = null;
            filterCount--;
        }
    }
    if ($_GET != {} && filterCount >= 0) {
        return $_GET;
    } else {
        return {
            "sorting-mode": "released",
            "sort-direction": "asc",
            "card-search": null,
            "color": null,
            "mana-value": null,
            "card-type": null,
            "rarity": null,
            "legalty": "vintage",
            "minyear": null,
            "maxyear": null,
            "minpower": null,
            "maxpower": null,
            "mintoughness": null,
            "maxtoughness": null,
            "minloyalty": null,
            "maxloyalty": null
        }
    }
}
 
loadCardArray(filterObject());