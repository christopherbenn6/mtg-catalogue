import { renderSidebar } from "./sidebarUI";
import { getCardsFromList, getAllSymbols } from "/js/api";
import { deckState } from "../deck/deckState";
import { updateDeck } from "../deck/deckService";

// Query String Parameters
const getValues = new URLSearchParams(window.location.search);

const symbolData = await getAllSymbols();
let symbolImagesAssoc = {};
symbolData.data.forEach(symbol => {
    symbolImagesAssoc[symbol.symbol] = symbol.svg_uri;
});

async function exchangeWithSymbols(string, symbolImagesAssoc) {
    Object.entries(symbolImagesAssoc).forEach(([key, value]) => {
        string = string.replaceAll(key, `<img class="symbol" src="${value}">`)
    });
    return string;
}

export async function renderDeck(decklist, container, isPublic) {

    // Array of objects containing an ID for every card
    let idArray = [];

    // Fetch cards from API, due to it being a POST request, it needs specific formatting
    decklist.forEach(cardId => {
        idArray.push({ id: cardId });
    });
    let cardData = await getCardsFromList({ identifiers: idArray });

    // Resets and Initialization
    container.innerHTML = "";
    let cardGridHTML = "";
    let sidebarHTML = "";
    let totalPrice = 0;
    let cardGroupings;

    let sort = getValues.get('sort') ?? "type";

    if (sort == "type") {
        cardGroupings = {
            land: "",
            creature: "",
            enchantment: "",
            artifact: "",
            instant: "",
            sorcery: "",
            planeswalker: "",
            battle: ""
        };
    } else if (sort == "mv") {
        cardGroupings = {
            0: "",
            1: "",
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "",
            8: "",
            9: "",
            10: ""
        };
    }

    for (const card of cardData['data']) {

        // Initialize Data for current card
        let price = card.prices.usd;
        if (price != null) {
            totalPrice += parseFloat(price);
        }

        let cardName = card.name;

        // Format name to max 17 characters
        if (cardName.length > 17) {
            cardName = cardName.slice(0, 17) + "...";
        }
        for (const key in cardGroupings) {

            // Get Mana Pips
            const symbols = await exchangeWithSymbols(card.mana_cost ?? card.card_faces[0].mana_cost, symbolImagesAssoc);

            if (sort == "type") {
                if (card.type_line.toLowerCase().includes(key)) {
                    cardGroupings[key] += `<li class="build-card-item" id=${card.id}><span class="card-name-span">${cardName}</span> <div class="price-mana-flex"><span>${symbols}</span> <span>$${price}</span></div></li>`;
                }
            } else if (sort == "mv") {
                if (card.cmc == key) {
                    cardGroupings[key] += `<li class="build-card-item" id=${card.id}><span class="card-name-span">${cardName}</span> <div class="price-mana-flex"><span>${symbols}</span> <span>$${price}</span></div></li>`;
                }
            }

        }
    };

    // Group Cards By Set Grouping
    Object.entries(cardGroupings).forEach(([key, value]) => {
        if (value != "") {
            if (sort == "type") {
                cardGridHTML += `<div><h3>${key.charAt(0).toUpperCase() + key.slice(1)}s</h3><ul class="deck-cards" id="${key}-grouping">
          ${value}
        </ul></div>`;
            } else if (sort == "mv") {
                cardGridHTML += `<div><h3>Mana Value ${key.charAt(0).toUpperCase() + key.slice(1)}</h3><ul class="deck-cards" id="${key}-grouping">
          ${value}
        </ul></div>`;
            }
        }
    });

    const html = isPublic ? `
    <div class="build-flex public">
        <div class="build-sidebar"></div>
        <div class="build-main">
        <div class="build-header">
            <div>
            <h2>${deckState.Title}</h2>
            <p>${totalPrice != 0 ? "$" + Math.round(totalPrice * 100) / 100 + " USD" : "No Price Available"}</p>
            </div>
            <div>
            <div class="select sorting builder-dropdown-button">
                <button type="button" class="dropdown-button">
                    Sort By
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div class="dropdown hidden">
                    <div data-value="type">
                        <a class="builder-sort-link" href="deckbuilder.html?id=${getValues.get('id')}&sort=type">Type</a>
                    </div>
                    <div data-value="mv">
                        <a class="builder-sort-link" href="deckbuilder.html?id=${getValues.get('id')}&sort=mv">Mana Value</a>
                    </div>
                </div>
                <input type="hidden" id="sorting" name="sorting" value="">
            </div>
            </div>
        </div>
        <div class="build-grid">
            ${cardGridHTML}
        </div>
        </div>
    </div>
    `

        :

        `<div class="build-flex public">
        <div class="build-sidebar"></div>
        <div class="build-main">
        <div class="build-header">
            <div class="deckbuilder-edit">
            <svg class="deckbuilder-edit-button" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"   stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            <div>
                <h2>${deckState.Title}</h2>
                <p>${totalPrice != 0 ? "$" + Math.round(totalPrice * 100) / 100 + " USD" : "No Price Available"}</p>
            </div>
            </div>
            <div>
            <div class="deckbuilder-header-flex">
                <button type="button" class="save button">Save</button>
                <div class="select sorting builder-dropdown-button">
                <button type="button" class="dropdown-button">
                    Sort By
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div class="dropdown hidden">
                    <div data-value="type">
                        <a class="builder-sort-link" href="deckbuilder.html?id=${getValues.get('id')}&sort=type">Type</a>
                    </div>
                    <div data-value="mv">
                        <a class="builder-sort-link" href="deckbuilder.html?id=${getValues.get('id')}&sort=mv">Mana Value</a>
                    </div>
                </div>
                <input type="hidden" id="sorting" name="sorting" value="">
                </div>
            </div>
            </div>
        </div>
        <div class="deckbuilder-edit-form hidden">
            <form>
            <div>
                <label for="deck-title">Deck Title</label>
                <input type="text" name="deck-title" id="deck-title">
            </div>
            <div class="deckbuilder-edit-form-checkboxes">
                <div>
                    <label for="set-private">Set As Private</label>
                    <input type="radio" name="set-status" id="set-private">
                </div>
                <div>
                    <label for="set-public">Set As Public</label>
                    <input type="radio" name="set-status" id="set-public">
                </div>
            </div>
            <div>
                <input class="button" type="submit" name="deckbuilder-edit-form-submit" id="deckbuilder-edit-form-submit" value="Update">
            </div>
            </form>
        </div>
        <div class="build-grid">
            ${cardGridHTML}
        </div>
        </div>
        </div>
    </div>`;
    container.innerHTML += html;

    if (isPublic) {
        initializePublic(cardData);
        renderSidebar(false, cardData['data'][0]);
    } else {
        initializePrivate(cardData, decklist, container, isPublic);
        renderSidebar(true, cardData['data'][0]);
    }
}

export function initializePublic(cardData) {
    const allItemsInDeck = document.querySelectorAll('.build-card-item');
    allItemsInDeck.forEach(item => {
        let itemId = item.getAttribute('id');
        let singleCardData = cardData['data'].find((card) => card.id === itemId);
        item.addEventListener('click', () => renderSidebar(false, singleCardData));
    });

    // Select Dropdown Functionality
    let dropdownButtons = document.querySelectorAll('.dropdown-button');
    dropdownButtons.forEach(button => {
        button.addEventListener('click', (ev) => {
            ev.preventDefault();
            const dropdown = button.nextElementSibling;
            dropdown.classList.toggle('hidden');
            button.classList.toggle('clicked');
            button.blur();
        })
    });
}

export function initializePrivate(cardData, decklist, container, isPublic) {
    const allItemsInDeck = document.querySelectorAll('.build-card-item');
    allItemsInDeck.forEach(item => {
        let itemId = item.getAttribute('id');
        let singleCardData = cardData['data'].find((card) => card.id === itemId);
        item.addEventListener('click', () => renderSidebar(true, singleCardData));
    });
    const editForm = document.querySelector('.deckbuilder-edit-form');

    // Deck Edit Form Opening button
    const editButton = document.querySelector('.deckbuilder-edit-button')
    editButton.addEventListener('click', () => {
        editForm.classList.toggle('hidden');
    });

    // Disable form Defaults. This sets the update button
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateDeck(getValues.get('id'), cardData);
        renderDeck(decklist, container, isPublic);
    });

    const saveButton = document.querySelector('.save');
    saveButton.addEventListener('click', () => {
        updateDeck(getValues.get('id'), cardData);
        renderDeck(decklist, container, isPublic);
    });

    // Select Dropdown Functionality
    let dropdownButtons = document.querySelectorAll('.dropdown-button');
    dropdownButtons.forEach(button => {
        button.addEventListener('click', (ev) => {
            ev.preventDefault();
            const dropdown = button.nextElementSibling;
            dropdown.classList.toggle('hidden');
            button.classList.toggle('clicked');
            button.blur();
        })
    });
}