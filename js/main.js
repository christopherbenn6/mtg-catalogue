import { filterCards, fetchData } from '../js/api.js';

let maxNumberOfCards = 80;
const cardIncrement = 80;
let cardData; // store all loaded cards and next_page

let selectedFilterButton = null;

// Select Dropdown Functionality
let dropdownButtons = document.querySelectorAll('.dropdown-button');
dropdownButtons.forEach(button => {
    button.addEventListener('click', (ev) => {
        ev.preventDefault();
        if(!advancedFiltersAreOpen) {
            if(selectedFilterButton != null && selectedFilterButton != button) {
                const selectedDropdown = selectedFilterButton.nextElementSibling;
                selectedDropdown.classList.add('hidden');
                selectedFilterButton.classList.remove('clicked');
            }
            const dropdown = button.nextElementSibling;
            dropdown.classList.toggle('hidden');
            button.classList.toggle('clicked');
            selectedFilterButton = button;
        }   
        button.blur();
    })
});

// SVG enable + add to active filters
let dropdownSelect = document.querySelectorAll('.dropdown:not(.sorting-dropdown) > div');
dropdownSelect.forEach(select => {
    select.addEventListener('click', () => {
        select.classList.toggle('selected');
        let svg = select.querySelector('svg');
        if(svg !=  null) {
            svg.classList.toggle('hidden');
        }
    });
});

// Color Selection
let colorButtons = document.querySelectorAll('.color .dropdown div');
let colorInput = document.querySelector('#color')
// Initialize it to previous settings
let colors = filterObject()['color'] ? filterObject()['color'].split("-") : [];

colorButtons.forEach(colorButton => {
    colorButton.addEventListener('click', () => {
        let color = colorButton.getAttribute('data-value');
        if(colors.includes(color)) {
            // 1 means remove only the first
            colors.splice(colors.indexOf(color), 1)
        } else {
            colors.push(color);
        }
        let colorString = colors.join('-');
        colorInput.value = colorString;
    })
});

// Card Type
let typeButtons = document.querySelectorAll('.card-type .dropdown div');
let typeInput = document.querySelector('#card-type')

// Types as an array thats converted to a string later
let types = filterObject()['card-type'] ? filterObject()['card-type'].split("-") : [];

typeButtons.forEach(typeButton => {
    typeButton.addEventListener('click', () => {
        let cardType = typeButton.getAttribute('data-value');
        if(types.includes(cardType)) {
            // 1 means remove only the first
            types.splice(types.indexOf(cardType), 1)
        } else {
            types.push(cardType);
        }
        let typesString = types.join('-')
        typeInput.value = typesString;
    })
});

// Mana Value
let manaButtons = document.querySelectorAll('.mana-value .dropdown div');
let manaInput = document.querySelector('#mana-value');

// Mana values as an array thats converted to a string later
let manaValues = filterObject()['mana-value'] ? filterObject()['mana-value'].split("-") : [];

manaButtons.forEach(manaButton => {
    manaButton.addEventListener('click', () => {
        let manaValue = manaButton.getAttribute('data-value');
        if(manaValues.includes(manaValue)) {
            // 1 means remove only the first
            manaValues.splice(manaValues.indexOf(manaValue), 1)
        } else {
            manaValues.push(manaValue);
        }
        let manaValuesString = manaValues.join('-')
        manaInput.value = manaValuesString;
    })
});

// Sorting Mode
let sortingButtons = document.querySelectorAll('.sorting-mode .dropdown div');
let selectedSortingOption = document.querySelector(`[data-value="${filterObject()['sorting-mode']}"]`) ?? null;
let sortingInput = document.querySelector('#sorting-mode');

sortingButtons.forEach(sortingButton => {
    sortingButton.addEventListener('click', () => {
        if(sortingButton != selectedSortingOption) {
            let sortingMode = sortingButton.getAttribute('data-value');
            sortingButton.classList.toggle('selected');
            if(selectedSortingOption != null) {
                selectedSortingOption.classList.toggle('selected');
            }
            // Svg enabling
            let svg = sortingButton.querySelector('svg');
            svg.classList.remove('hidden');
            if(selectedSortingOption) {
                let prevSvg = selectedSortingOption.querySelector('svg');
                prevSvg.classList.add('hidden');
            }

            selectedSortingOption = sortingButton;
            sortingInput.value = sortingMode;
        } 
    })
});

// Sorting Direction
let sortingDirectionButtons = document.querySelectorAll('.sort-direction .dropdown div');
let selectedSortingDirectionOption;
let sortingDirectionInput = document.querySelector('#sort-direction');

sortingDirectionButtons.forEach(sortingDirectionButton => {
    sortingDirectionButton.addEventListener('click', () => {
        if(sortingDirectionButton != selectedSortingDirectionOption) {
            let sortingDirection = sortingDirectionButton.getAttribute('data-value');

            // Selected Classes
            sortingDirectionButton.classList.toggle('selected');
            if(selectedSortingDirectionOption != null) {
                selectedSortingDirectionOption.classList.toggle('selected');
            }

            // Svg enabling
            let svg = sortingDirectionButton.querySelector('svg');
            svg.classList.remove('hidden');
            if(selectedSortingDirectionOption) {
                let prevSvg = selectedSortingDirectionOption.querySelector('svg');
                prevSvg.classList.add('hidden');
            }

            selectedSortingDirectionOption = sortingDirectionButton;
            sortingDirectionInput.value = sortingDirection;
        } 
    })
});

// Advanced / Basic Filter Button
let advancedFiltersButton = document.querySelector('.advanced-filters-button');
let advancedFilters = document.querySelector('.advanced-filters');
let advancedFiltersAreOpen = false;
advancedFiltersButton.addEventListener('click', () => {
    advancedFilters.classList.toggle('hidden');
    if(advancedFiltersAreOpen) {
        advancedFiltersButton.innerText = 'Advanced Filters';
        advancedFiltersAreOpen = false;
    } else {
        advancedFiltersButton.innerText = 'Basic Filters'
        advancedFiltersAreOpen = true;

    }
    dropdownButtons.forEach(button => {
        const dropdown = button.nextElementSibling;
        if(advancedFiltersAreOpen) {
            button.classList.add('clicked');
            dropdown.classList.remove('hidden');
        } else {
            button.classList.remove('clicked');
            dropdown.classList.add('hidden');
        }
    })
});

// Card Faces
let cardFaceButtons = document.querySelectorAll('.card-faces .dropdown div');
let cardFaceInput = document.querySelector('#card-face');
let cardFaces = filterObject()['card-face'] ? filterObject()['card-face'].split("-") : [];

cardFaceButtons.forEach(cardFaceButton => {
    cardFaceButton.addEventListener('click', () => {
        let cardFaceValue = cardFaceButton.getAttribute('data-value');
        if(cardFaces.includes(cardFaceValue)) {
            // 1 means remove only the first
            cardFaces.splice(cardFaces.indexOf(cardFaceValue), 1)
        } else {
            cardFaces.push(cardFaceValue);
        }
        let string = cardFaces.join('-')
        cardFaceInput.value = string;
    })
});

// Other Card Types
let otherCardTypeButtons = document.querySelectorAll('.other-card-types .dropdown div');
let otherCardTypeInput = document.querySelector('#other-card-types');
let otherCardTypes = filterObject()['other-card-types'] ? filterObject()['other-card-types'].split("-") : [];

otherCardTypeButtons.forEach(otherCardTypeButton => {
    otherCardTypeButton.addEventListener('click', () => {
        let otherCardTypeValue = otherCardTypeButton.getAttribute('data-value');
        if(otherCardTypes.includes(otherCardTypeValue)) {
            // 1 means remove only the first
            otherCardTypes.splice(otherCardTypes.indexOf(otherCardTypeValue), 1)
        } else {
            otherCardTypes.push(otherCardTypeValue);
        }
        let string = otherCardTypes.join('-')
        otherCardTypeInput.value = string;
    })
});

// Gimmicks
let gimmickButtons = document.querySelectorAll('.gimmick .dropdown div');
let gimmickInput = document.querySelector('#gimmick');
let gimmicks = filterObject()['gimmick'] ? filterObject()['gimmick'].split("-") : [];

gimmickButtons.forEach(gimmickButton => {
    gimmickButton.addEventListener('click', () => {
        let gimmickValue = gimmickButton.getAttribute('data-value');
        if(gimmicks.includes(gimmickValue)) {
            // 1 means remove only the first
            gimmicks.splice(gimmicks.indexOf(gimmickValue), 1)
        } else {
            gimmicks.push(gimmickValue);
        }
        let string = gimmicks.join('-')
        gimmickInput.value = string;
    })
});

// Rarity
let rarityButtons = document.querySelectorAll('.rarity .dropdown div');
let rarityInput = document.querySelector('#rarity');
let rarities = filterObject()['rarity'] ? filterObject()['rarity'].split("-") : [];

rarityButtons.forEach(rarityButton => {
    rarityButton.addEventListener('click', () => {
        let rarityValue = rarityButton.getAttribute('data-value');
        if(rarities.includes(rarityValue)) {
            // 1 means remove only the first
            rarities.splice(rarities.indexOf(rarityValue), 1)
        } else {
            rarities.push(rarityValue);
        }
        let string = rarities.join('-')
        rarityInput.value = string;
    })
});

// Border
let borderButtons = document.querySelectorAll('.border .dropdown div');
let borderInput = document.querySelector('#border');
let borders = filterObject()['border'] ? filterObject()['border'].split("-") : [];

borderButtons.forEach(borderButton => {
    borderButton.addEventListener('click', () => {
        let borderValue = borderButton.getAttribute('data-value');
        if(borders.includes(borderValue)) {
            // 1 means remove only the first
            borders.splice(borders.indexOf(borderValue), 1)
        } else {
            borders.push(borderValue);
        }
        let string = borders.join('-')
        borderInput.value = string;
    })
});

// Legality
let legalityButtons = document.querySelectorAll('.legality .dropdown div');
let legalityInput = document.querySelector('#legality');
let legalities = filterObject()['legality'] ? filterObject()['legality'].split("-") : [];

legalityButtons.forEach(legalityButton => {
    legalityButton.addEventListener('click', () => {
        let legalityValue = legalityButton.getAttribute('data-value');
        if(legalities.includes(legalityValue)) {
            // 1 means remove only the first
            legalities.splice(legalities.indexOf(legalityValue), 1)
        } else {
            legalities.push(legalityValue);
        }
        let string = legalities.join('-')
        legalityInput.value = string;
    })
});

// Power
let powerButtons = document.querySelectorAll('.power .dropdown div');
let powerInput = document.querySelector('#power');
let powers = filterObject()['power'] ? filterObject()['power'].split("-") : [];

powerButtons.forEach(powerButton => {
    powerButton.addEventListener('click', () => {
        let powerValue = powerButton.getAttribute('data-value');
        if(powers.includes(powerValue)) {
            // 1 means remove only the first
            powers.splice(powers.indexOf(powerValue), 1)
        } else {
            powers.push(powerValue);
        }
        let string = powers.join('-')
        powerInput.value = string;
    })
});

// Toughness
let toughnessButtons = document.querySelectorAll('.toughness .dropdown div');
let toughnessInput = document.querySelector('#toughness');
let toughnesses = filterObject()['toughness'] ? filterObject()['toughness'].split("-") : [];

toughnessButtons.forEach(toughnessButton => {
    toughnessButton.addEventListener('click', () => {
        let toughnessValue = toughnessButton.getAttribute('data-value');
        if(toughnesses.includes(toughnessValue)) {
            // 1 means remove only the first
            toughnesses.splice(toughnesses.indexOf(toughnessValue), 1)
        } else {
            toughnesses.push(toughnessValue);
        }
        let string = toughnesses.join('-')
        toughnessInput.value = string;
    })
});

async function loadCardArray(filterObject) {
    // Initial fetch
    cardData = await filterCards(filterObject['sort-direction'], filterObject['sorting-mode'], filterObject);
    // If there were cards in the search
    if(cardData != false) {
        renderCards(cardData.data, 0, maxNumberOfCards);
        setupLoadMore();
    } else {
        const cardGrid = document.querySelector('#card-grid');

        // Heading
        const h2 = document.createElement('h2');
        h2.classList = "no-cards";
        h2.innerText = "404 No Cards Found";

        // Text
        const p = document.createElement('p');
        p.classList = "no-cards";
        p.innerText = "There were no cards found that match your search. Or there was an error.";

        // Add it 
        cardGrid.appendChild(h2);
        cardGrid.appendChild(p);

        // Change Styling
        cardGrid.classList.add('no-results')
    }
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
        let transformImage = "";
        let transImg = "";

        if (cards[i].card_faces && !cards[i].image_uris) {
            image = cards[i].card_faces[0].image_uris.normal;
            transformImage = cards[i].card_faces[1].image_uris.normal
        } else if (cards[i].image_uris) {
            image = cards[i].image_uris.normal;
        }

        const img = document.createElement('img');
        img.className = 'mtg-card';
        img.src = image;
        img.loading = "lazy";

        if(transformImage != "") {
            transImg = document.createElement('img');
            transImg.className = 'mtg-card hidden';
            transImg.src = transformImage;
            transImg.loading = "lazy";
        }
        
        let div = document.createElement('div');
        div.className = 'flip-button-container';
        const a = document.createElement('a');
        a.href = `single.html?id=${cards[i].id}`
        a.appendChild(img);

        if(transformImage != "") {
            let flipButton = `<button class="flip-button"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>`;
            a.appendChild(transImg);
            div.appendChild(a);
            div.innerHTML += flipButton;
            div.querySelector('.flip-button').addEventListener('click', () => {
                let selectedImage = div.querySelector('img:not(.hidden)');
                let unselectedImage = div.querySelector('img.hidden');
                selectedImage.classList.add('hidden');
                unselectedImage.classList.remove('hidden')
            });
        } else {
            div.appendChild(a);
        }

        fragment.appendChild(div);  
    }

    cardGrid.appendChild(fragment);
}

// Start loading

function filterObject() {
    const params = new URLSearchParams(window.location.search);
    const filters = {};

    for (const [key, value] of params.entries()) {
        filters[key] = value ? decodeURIComponent(value).replace(/\+/g, " ") : null;
    }

    if (Object.keys(filters).length > 0) {
        return filters;
    }

    return {
        "sorting-mode": "released",
        "sort-direction": "desc",
        "card-search": null,
        "color": null,
        "mana-value": null,
        "card-type": null,
        "rarity": null,
        "legalty": null,
        "power": null,
        "toughness": null,
        "card-face": null,
        "other-card-types": null,
        "gimmick": null,
        "border": null,
        "price-min": null,
        "price-max": null,
        "year-max": null,
        "year-min": null
    };
}

function setStickyFilters () {
    let filters = filterObject();
    Object.entries(filters).forEach(([filter, value]) => {
        if(value != null && value != "Apply Filters") {
            let input = document.querySelector(`#${filter}`);
            input.value = value;
            if(filter == "card-search" || filter == "price-min" || filter == "price-max" || filter == "year-min" || filter == "year-max") {
                return;
            }

            let valuesArray = value.split("-");
            valuesArray.forEach(dataValue => {
                let select = document.querySelector(`[data-value="${dataValue}"]`);
                select.classList.toggle('selected');
                let svg = select.querySelector('svg');
                if(svg !=  null) {
                    svg.classList.toggle('hidden');
                }
            });
        }
    });
}

setStickyFilters();

console.log(filterObject());

loadCardArray(filterObject());